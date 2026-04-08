const normalizeIP = (ip) => {
    if (!ip) return "unknown";
    let normalized = ip.replace(/^::ffff:/, "");
    if (normalized === "::1") return "127.0.0.1";
    return normalized;
};

/**
 * XSS Sanitization Middleware
 * Recursively strips dangerous HTML tags from request body and query.
 */
const xssSanitizer = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string') {
            // Remove <script> tags and other common XSS patterns
            return obj.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "[REMOVED_SCRIPT]")
                      .replace(/on\w+=(['"]?).*?\1/gmi, "[REMOVED_EVENT]") // remove onmouseover, onclick etc
                      .replace(/javascript:/gmi, "[REMOVED_JS_PROTOCOL]");
        }
        return obj;
    }

    const sanitized = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        sanitized[key] = xssSanitizer(obj[key]);
    }
    return sanitized;
};

const xssDefenseMiddleware = (req, res, next) => {
    if (req.body) {
        req.body = xssSanitizer(req.body);
    }
    if (req.query) {
        req.query = xssSanitizer(req.query);
    }
    next();
};

module.exports = { xssDefenseMiddleware };
