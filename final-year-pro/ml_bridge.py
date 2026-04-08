"""
ml_bridge.py  —  Continuous AI Defense Agent Terminal Feed
State machine:
  NORMAL        → scrolling log display  (NO full AI pipeline — just display)
  UNDER_ATTACK  → big attack banner + live blocked-request counter
  DEFENDED      → "threat neutralized / server normal" cool-down
"""

import os, json, time, subprocess
from defense_agent import run_agent

# ── File Paths (Relative to project root) ──────────────────────────────────────
BASE_DIR               = os.path.dirname(os.path.abspath(__file__))
PROJECT_DEFEND_LOGS_JS = os.path.join(BASE_DIR, "..", "Elearning-Platform-Using-MERN", "backend", "gather_logs.js")
LOGS_JSON_PATH         = os.path.join(BASE_DIR, "..", "Elearning-Platform-Using-MERN", "backend", "defend_logs_export.json")
BLOCKED_IPS_PATH       = os.path.join(BASE_DIR, "blocked_ips.json")

# ── Tuning knobs ──────────────────────────────────────────────────────────────
THREAT_SCAN_WINDOW   = 20    # check the N most recent logs for threats each cycle
THREAT_RPM_THRESHOLD = 80    # higher than dashboard polling (~20-30 rpm) to avoid false alarms
BRUTE_FAIL_THRESHOLD = 8     # failed login count before flagging brute force
DEFENDED_HOLD_SECS   = 8     # seconds to show "server normal" before re-scrolling

# Admin / dashboard endpoints — never flag these as attacks
ADMIN_ENDPOINTS = [
    "/universal-logs", "/activities", "/stats",
    "/request-stats", "/logs", "/dashboard",
]

# ── State Machine ─────────────────────────────────────────────────────────────
STATE_NORMAL       = "NORMAL"
STATE_UNDER_ATTACK = "UNDER_ATTACK"
STATE_DEFENDED     = "DEFENDED"

# ── Human-readable attack labels ──────────────────────────────────────────────
LABEL = {
    "nosql_injection": "NoSQL Injection",
    "xss_attack":      "Cross-Site Scripting (XSS)",
    "sql_injection":   "SQL Injection",
    "brute_force":     "Brute Force Login",
    "dos":             "Denial-of-Service (DoS) Flood",
    "csrf":            "Cross-Site Request Forgery (CSRF)",
    "unauth_access":   "Unauthorized Access",
    "unknown":         "Unknown Anomaly",
    "normal":          "Normal Traffic",
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def map_log(log):
    net = log.get("network", {})
    web = log.get("web", {})
    app = log.get("app", {})
    return {
        "source_ip":           net.get("source_ip") or "unknown",
        "requests_per_minute": net.get("request_rate_per_min") or 0,
        "failed_logins":       net.get("failed_login_attempts") or 0,
        "request_method":      web.get("http_method") or "GET",
        "endpoint":            web.get("request_uri") or "/",
        "status_code":         web.get("status_code") or 200,
        "session_duration_ms": net.get("session_duration_ms") or 0,
        "data_transfer_bytes": net.get("data_transfer_bytes") or 0,
        "request_interval_ms": net.get("request_interval_ms") or 0,
        "cpu_usage_percent":   net.get("cpu_usage_percent") or 0,
        "total_failed_logins": net.get("failed_login_attempts") or 0,
        "geographic_location": net.get("geographic_location") or "Unknown",
        "request_payload":     app.get("request_payload") or {},
        "referrer":            web.get("referrer") or "",
    }


def is_suspicious(log):
    """
    Fast signature-based pre-filter.
    Returns True ONLY for clear attack indicators — not for normal dashboard noise.
    The full AI pipeline runs only when this returns True.
    """
    net     = log.get("network", {})
    web     = log.get("web", {})
    app     = log.get("app", {})

    rpm     = net.get("request_rate_per_min", 0) or 0
    fails   = net.get("failed_login_attempts", 0) or 0
    code    = web.get("status_code", 200) or 200
    action  = str(app.get("response_status", ""))
    payload = str(app.get("request_payload", "")).lower()
    ep      = str(web.get("request_uri", "") or app.get("endpoint", "")).lower()

    # Skip admin/dashboard noise entirely
    if any(a in ep for a in ADMIN_ENDPOINTS):
        return False

    # DoS flood (use higher threshold to avoid flagging dashboard polling)
    if rpm > THREAT_RPM_THRESHOLD:
        return True

    # Brute force (Only if hitting a login endpoint)
    if fails > BRUTE_FAIL_THRESHOLD and ("/login" in ep or "/auth" in ep):
        return True

    # Already blocked by middleware (403 from blocked_ips.json)
    if code == 403 or action == "BLOCKED":
        return True

    # Injection payloads
    if any(x in payload for x in [
        "$gt", "$ne", "$regex", "$where", "$in",
        "<script", "onerror", "onload", "alert(",
        "union select", "drop table", "' or '",
    ]):
        return True

    return False


def read_blocked_ips():
    try:
        with open(BLOCKED_IPS_PATH, encoding="utf-8") as f:
            return set(json.load(f))
    except Exception:
        return set()


def parse_log_time(log):
    """Parse the core.timestamp from a log entry into a float (epoch seconds)."""
    try:
        ts = log.get("core", {}).get("timestamp", "")
        if not ts:
            return 0.0
        ts = str(ts).replace("Z", "+00:00")
        from datetime import datetime, timezone
        dt = datetime.fromisoformat(ts)
        # Convert to UTC epoch
        return dt.timestamp()
    except Exception:
        return 0.0


BACKEND_DIR = os.path.join(BASE_DIR, "..", "Elearning-Platform-Using-MERN", "backend")

def refresh_logs():
    """Asks Node.js to export latest logs from MongoDB, then reads the JSON."""
    subprocess.run(
        ["node", PROJECT_DEFEND_LOGS_JS],
        capture_output=True, text=True,
        cwd=BACKEND_DIR   # makes dotenv.config() load the correct backend .env
    )
    if not os.path.exists(LOGS_JSON_PATH):
        return []
    try:
        with open(LOGS_JSON_PATH, encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[refresh_logs ERROR] {e}", flush=True)
        return []


# ── Terminal display helpers ──────────────────────────────────────────────────

def sep(ch="=", n=62):
    print(ch * n)

def print_startup():
    print()
    sep()
    print("  @@  PROJECT DEFEND AI AGENT  -  LIVE MONITOR  @@")
    print("  Project Defend Platform  |  Real-Time Threat Detection")
    sep()
    print()

def print_normal_line(ts, method, endpoint, ip, code):
    # Trim long endpoints for clean display
    ep = endpoint[:38] + ".." if len(endpoint) > 40 else endpoint
    print(f"[{ts}] [OK]  {method:<5} {ep:<40} {code}  IP={ip}")

def print_attack_start(attack_type, ip, endpoint):
    label = LABEL.get(attack_type, attack_type.upper())
    print()
    sep("!")
    print(f"  *** LIVE ATTACK DETECTED  -  {label.upper()} ***")
    print(f"  Source IP  : {ip}")
    print(f"  Target     : {endpoint}")
    print(f"  Time       : {time.strftime('%H:%M:%S')}")
    sep("!")
    print()

def print_defence_action(result, ip, attack_type):
    label  = LABEL.get(attack_type, attack_type.upper())
    action = str(result.get("action", "ip_blocked")).upper().replace("_", " ")
    sep("*")
    print(f"  THREAT NEUTRALIZED  -  AI DEFENSE AGENT RESPONDED")
    print(f"  Attack Type : {label}")
    print(f"  IP Address  : {ip}")
    print(f"  Action Taken: {action}")
    print(f"  Time        : {time.strftime('%H:%M:%S')}")
    sep("*")
    print()

def print_attack_ongoing(ts, attack_type, ip, count):
    label = LABEL.get(attack_type, attack_type.upper())
    print(f"[{ts}] [!!] {label:<35} IP={ip}  |  Blocked requests: {count}")

def print_server_normal(attack_type):
    label = LABEL.get(attack_type, "the attack")
    print()
    sep()
    print(f"  [OK] SERVER IS NOW BACK TO NORMAL")
    print(f"  {label} has been fully mitigated by the AI agent.")
    print(f"  Resuming normal traffic monitoring...")
    sep()
    print()


# ── Main loop ─────────────────────────────────────────────────────────────────

def main():
    print_startup()

    state          = STATE_NORMAL
    logs           = []
    log_index      = 0          # round-robin pointer (normal scroll)
    alerted_ids    = set()      # event_ids already sent through AI pipeline
    active_ip      = None
    active_type    = None
    attack_count   = 0
    defended_until = 0.0
    # After defending, ignore all logs older than this epoch timestamp.
    # Prevents residual attack logs from triggering a false second alert.
    # On start, only look at logs from *now* onwards.
    skip_logs_before = time.time()

    while True:
        ts = time.strftime('%H:%M:%S')

        # Refresh log batch from MongoDB every cycle (silently)
        fresh = refresh_logs()
        if fresh:
            logs = fresh

        if not logs:
            print(f"[{ts}] Waiting for logs from MongoDB...", flush=True)
            time.sleep(1)
            continue

        blocked_ips = read_blocked_ips()

        # ══════════════════════════════════════════════════════
        # STATE: DEFENDED  — cool-down, then back to normal
        # ══════════════════════════════════════════════════════
        if state == STATE_DEFENDED:
            if time.time() >= defended_until:
                print_server_normal(active_type)
                state            = STATE_NORMAL
                active_ip        = None
                active_type      = None
                attack_count     = 0
                # Key fix: skip any log that existed before this moment.
                # This prevents residual DoS/attack logs from triggering
                # a false "brute force" or second attack immediately after.
                skip_logs_before = time.time()
                alerted_ids.clear()   # fresh slate for the new normal phase
            else:
                remaining = int(defended_until - time.time())
                print(f"[{ts}] [SHIELD] Monitoring post-attack traffic... ({remaining}s remaining)")
                time.sleep(1)
                continue

        # ══════════════════════════════════════════════════════
        # PRIORITY SCAN — check recent N logs for real threats
        # Only runs full AI pipeline when is_suspicious() is True
        # ══════════════════════════════════════════════════════
        threat_found = False
        recent = logs[:THREAT_SCAN_WINDOW]

        for log in recent:
            event_id = log.get("core", {}).get("event_id", "")
            if event_id in alerted_ids:
                continue

            # Skip logs that pre-date the last defense action
            # (residual attack logs sitting in MongoDB)
            if skip_logs_before > 0 and parse_log_time(log) < skip_logs_before:
                alerted_ids.add(event_id)   # mark so we never re-check it
                continue

            if not is_suspicious(log):
                continue

            # ── Run full AI pipeline ONLY for suspicious logs ──
            record = map_log(log)
            result = run_agent(record)
            alerted_ids.add(event_id)

            verdict     = result.get("verdict", "Normal")
            attack_type = result.get("attack_type", "unknown")
            ip          = record["source_ip"]
            endpoint    = record["endpoint"]

            if verdict == "Abnormal" or result.get("ip_blocked") or result.get("temp_blocked"):
                threat_found = True

                if state == STATE_NORMAL:
                    active_ip    = ip
                    active_type  = attack_type
                    attack_count = 1
                    state        = STATE_UNDER_ATTACK
                    print_attack_start(attack_type, ip, endpoint)
                    print_defence_action(result, ip, attack_type)
                    if ip in read_blocked_ips():
                        defended_until = time.time() + DEFENDED_HOLD_SECS
                        state = STATE_DEFENDED

                elif state == STATE_UNDER_ATTACK and ip == active_ip:
                    attack_count += 1
                    print_attack_ongoing(ts, active_type, ip, attack_count)
                    if active_ip in read_blocked_ips():
                        defended_until = time.time() + DEFENDED_HOLD_SECS
                        state = STATE_DEFENDED
                break

        if len(alerted_ids) > 500:
            alerted_ids.clear()

        # ══════════════════════════════════════════════════════
        # NORMAL SCROLL — display one log per second
        # No AI pipeline here — just show the traffic is normal
        # ══════════════════════════════════════════════════════
        if not threat_found and state == STATE_NORMAL:
            log_index %= len(logs)
            log        = logs[log_index]
            log_index += 1

            rec    = map_log(log)
            method = rec["request_method"]
            ep     = rec["endpoint"]
            ip     = rec["source_ip"]
            code   = log.get("web", {}).get("status_code", 200) or 200

            # Normal scroll: display every log EXCEPT 403 (hard blocked).
            # is_suspicious() is intentionally NOT used here — this pass is
            # purely for visual continuity. Real threat detection happens in
            # the PRIORITY SCAN above.
            # Post-attack, old high-fail-count logs still need to show as
            # "ANALYZED - Normal" so the terminal doesn't freeze.
            if code != 403:
                print_normal_line(ts, method, ep, ip, code)

        time.sleep(1.0)


if __name__ == "__main__":
    main()
