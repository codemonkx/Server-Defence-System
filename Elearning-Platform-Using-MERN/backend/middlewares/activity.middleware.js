const { UniversalLogModel } = require("../models/universalLog.models");
const { v4: uuidv4 } = require("uuid");
const onFinished = require("on-finished");
const os = require("os");
const fs = require("fs");
const path = require("path");

const BLOCKED_IPS_PATH = path.join(__dirname, "..", "..", "final-year-pro", "blocked_ips.json");
const CAPTCHA_IPS_PATH = path.join(__dirname, "..", "..", "final-year-pro", "captcha_required_ips.json");

function isIpBlocked(ip) {
    try {
        if (fs.existsSync(BLOCKED_IPS_PATH)) {
            const blocked = JSON.parse(fs.readFileSync(BLOCKED_IPS_PATH, 'utf8'));
            if (blocked.includes(ip)) {
                console.log(`\n!! [FIREWALL] BLOCKED IP ATTEMPT: ${ip} (Access Denied) !!`);
                return { blocked: true };
            }
        }
        if (fs.existsSync(CAPTCHA_IPS_PATH)) {
            const captcha = JSON.parse(fs.readFileSync(CAPTCHA_IPS_PATH, 'utf8'));
            if (captcha.includes(ip)) {
                console.log(`[FIREWALL] CAPTCHA REQUIRED FOR IP: ${ip}`);
                return { captcha: true };
            }
        }
    } catch (e) {}
    return { blocked: false, captcha: false };
}

const normalizeIP = (ip) => {
    if (!ip) return "unknown";
    let normalized = ip.replace(/^::ffff:/, "");
    if (normalized === "::1") return "127.0.0.1";
    return normalized;
};

const ipRequestMap = {};  
const ipFailedLogins = {}; 
const sessionStart = {};   

const RATE_WINDOW_MS = 60 * 1000; 

const recordFailedLogin = (ip) => {
    ipFailedLogins[ip] = (ipFailedLogins[ip] || 0) + 1;
};

const getRequestRate = (ip) => {
    const now = Date.now();
    if (!ipRequestMap[ip]) return 1;
    const recent = ipRequestMap[ip].filter(t => now - t < RATE_WINDOW_MS);
    return recent.length;
};

const universalActivityLogger = async (req, res, next) => {
    const start = Date.now();
    const ip = normalizeIP(req.headers["x-forwarded-for"] || req.socket.remoteAddress);

    const check = isIpBlocked(ip);
    if (check.blocked) {
        // Log the blocked attack attempt so the AI agent can report it
        const blockLog = new UniversalLogModel({
            core: { event_id: require('uuid').v4(), event_type: "SECURITY_EVENT", log_level: "ERROR", service_name: "Project-Defend-Backend", host: os.hostname(), host_name: os.type() },
            web:  { remote_ip: ip, http_method: req.method, request_uri: req.originalUrl || req.url, status_code: 403 },
            app:  { endpoint: req.path, action: `BLOCKED: ${req.method} ${req.path}`, response_status: "BLOCKED", request_payload: req.body },
            network: { source_ip: ip, request_rate_per_min: getRequestRate(ip), failed_login_attempts: ipFailedLogins[ip] || 0, session_duration_ms: 0, data_transfer_bytes: 0, request_interval_ms: 0, cpu_usage_percent: parseFloat(((os.loadavg()[0] / os.cpus().length) * 100).toFixed(2)) },
            os: { process_id: process.pid, process_name: "node", parent_process_id: process.ppid, user_id: os.userInfo().username }
        });
        blockLog.save().catch(() => {});
        return res.status(403).json({ error: "Access Denied: Your IP has been permanently blocked by Project Defend." });
    }
    if (check.captcha) {
        return res.status(403).json({ error: "Captcha Required: Please complete the challenge to continue." });
    }

    // Track request timestamps per IP
    if (!ipRequestMap[ip]) ipRequestMap[ip] = [];
    ipRequestMap[ip].push(start);
    // Keep only last 5 minutes to avoid memory bloat
    const fiveMin = 5 * 60 * 1000;
    ipRequestMap[ip] = ipRequestMap[ip].filter(t => start - t < fiveMin);

    const coreInfo = {
        event_id: uuidv4(),
        event_type: "WEB_REQUEST",
        log_level: "INFO",
        service_name: "Project-Defend-Backend",
        host: os.hostname(),
        host_name: os.type(),
    };

    const osInfo = {
        process_id: process.pid,
        process_name: "node",
        parent_process_id: process.ppid,
        user_id: os.userInfo().username,
    };

    onFinished(res, async (err) => {
        const duration = Date.now() - start;

        // Data transfer size: request body + response content-length
        const reqSize = req.headers["content-length"] ? parseInt(req.headers["content-length"]) : JSON.stringify(req.body || {}).length;
        const resSize = res.getHeader("content-length") ? parseInt(res.getHeader("content-length")) : 0;

        const webInfo = {
            remote_ip: ip,
            remote_port: req.socket.remotePort,
            http_method: req.method,
            request_uri: req.originalUrl || req.url,
            http_version: req.httpVersion,
            status_code: res.statusCode,
            response_size: resSize,
            response_time: duration,
            referrer: req.headers["referer"] || req.headers["referrer"],
            user_agent: req.headers["user-agent"],
            connection_status: res.finished ? "finished" : "unfinished",
        };

        const appInfo = {
            endpoint: req.route?.path || req.path,
            action: `${req.method} ${req.path}`,
            request_payload: req.body,
            response_status: res.statusCode >= 400 ? "ERROR" : "SUCCESS",
            error_message: err ? err.message : null,
            execution_time: duration,
        };

        // Extended security/traffic fields stored in network section
        const networkInfo = {
            source_ip: ip,
            request_rate_per_min: getRequestRate(ip),
            failed_login_attempts: ipFailedLogins[ip] || 0,
            session_duration_ms: duration,
            data_transfer_bytes: reqSize + resSize,
            request_size_bytes: reqSize,
            response_size_bytes: resSize,
            geographic_location: null, // populated by geoip in login route
            request_method: req.method,
            request_interval_ms: duration,
            cpu_usage_percent: parseFloat(((os.loadavg()[0] / os.cpus().length) * 100).toFixed(2)),
        };

        const log = new UniversalLogModel({
            core: coreInfo,
            web: webInfo,
            app: appInfo,
            os: osInfo,
            network: networkInfo,
        });

        log.save().catch((e) => console.error("Universal logging failed:", e));
    });

    next();
};

module.exports = { universalActivityLogger, recordFailedLogin, getRequestRate, ipRequestMap, ipFailedLogins };
