"""
defense_agent.py  –  LangGraph Web Server Defense Agent
LLM: Mistral AI (mistral-large-latest)

8 Tools:
  1. log_getter          – fetch server telemetry
  2. ml_model            – IF + OC-SVM anomaly detection
  3. llm_model           – Mistral reasoning for unknown anomalies
  4. captcha_giver       – issue CAPTCHA to suspicious IP
  5. login_remover       – revoke session / access for unauthorised resource access
  6. temp_block          – block user login for 3 hours
  7. ip_blocker          – permanent firewall-level IP block
  8. status_check        – re-poll server to see if threat persists
"""

import os, json, time
from typing import TypedDict
from pathlib import Path
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END

load_dotenv()   # reads .env file
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")

from realtime_preprocessor import preprocess, load_artefacts
from realtime_predictor     import load_models, predict as ml_predict, compute_threshold

# ── Optional GNN ──────────────────────────────────────────────────────────────
try:
    from gnn_user_model import load_gnn, predict_user_node
    _gnn_model, _gnn_feat_min, _gnn_feat_max = load_gnn()
    GNN_AVAILABLE = True
    print("[AGENT] GNN loaded")
except Exception as e:
    GNN_AVAILABLE = False
    print(f"[AGENT] GNN skipped: {e}")

# ── Load ML artefacts once at startup ─────────────────────────────────────────
print("[AGENT] Loading ML models ...")
_scaler, _encoders = load_artefacts()
_models             = load_models()
_threshold          = compute_threshold(_models, _scaler, _encoders)

# ── Groq client ───────────────────────────────────────────────────────────────
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
from groq import Groq
_groq = Groq(api_key=GROQ_API_KEY)
GROQ_MODEL = "llama-3.3-70b-versatile"

# ─────────────────────────────────────────────
# STATE
# ─────────────────────────────────────────────
class AgentState(TypedDict):
    raw_input:       dict    # server telemetry
    ml_result:       dict    # ml_model output
    gnn_result:      dict    # gnn output
    attack_type:     str     # brute_force | dos | unauth_access | unknown | normal
    llm_action:      str     # action recommended by LLM
    llm_reasoning:   str     # LLM explanation
    captcha_issued:  bool
    login_removed:   bool
    temp_blocked:    bool
    ip_blocked:      bool
    status_normal:   bool    # True = threat resolved
    escalation_step: int     # tracks how many escalation steps taken
    final_verdict:   str     # Normal | Abnormal
    final_action:    str
    explanation:     str

# ─────────────────────────────────────────────
# TOOL 1 – LOG GETTER
# ─────────────────────────────────────────────
def log_getter(state: AgentState) -> AgentState:
    ip   = state["raw_input"].get("source_ip", "unknown")
    state["escalation_step"] = 0
    print(f"\n[TOOL 1 - log_getter] IP={ip}")
    return state

# ─────────────────────────────────────────────
# TOOL 2 – SIGNATURE CLASSIFIER (PRE-ML)
# ─────────────────────────────────────────────
def classify_attack(state: AgentState) -> AgentState:
    """
    Checks for high-confidence attack signatures.
    If found, it bypasses the ML model to ensure instant blocking.
    """
    rec   = state["raw_input"]
    rpm   = float(rec.get("requests_per_minute", 0))
    fails = float(rec.get("failed_logins", 0)) + float(rec.get("total_failed_logins", 0))
    cpu   = float(str(rec.get("cpu_usage_percent", 0)).replace("%", ""))
    code  = int(rec.get("status_code", 200))
    payload = str(rec.get("request_payload", "")).lower()
    endpoint = str(rec.get("endpoint", "")).lower()

    PROTECTED = ["/admin", "/config", "/api/user", "/dashboard", "/internal"]

    # 1. ATTACK SIGNATURES
    XSS_MARKERS = ["<script", "javascript:", "onerror", "onload", "<img", "alert(", "prompt(", "confirm(", "eval(", "svg/onload", "body/onload", "src="]
    if any(x in payload for x in XSS_MARKERS):
        state["attack_type"] = "xss_attack"
        print(f"[DETECT] SIGNATURE MATCH: XSS Payload")
        return state
        
    if any(o in payload for o in ["$gt", "$ne", "$regex", "$where", "$in"]):
        state["attack_type"] = "nosql_injection"
        print(f"[DETECT] SIGNATURE MATCH: NoSQLi Payload")
        return state

    if any(s in payload for s in ["' or '1'='1", "union select", "drop table", "select *", "--;", "-- "]):
        state["attack_type"] = "sql_injection"
        print(f"[DETECT] SIGNATURE MATCH: SQLi Payload")
        return state

    if ("enroll-demo" in endpoint or "enroll" in endpoint) and (not rec.get("referrer") or "localhost" not in str(rec.get("referrer"))):
        state["attack_type"] = "csrf"
        print(f"[DETECT] SIGNATURE MATCH: CSRF Header Anomaly")
        return state

    # 2. SEVERE THRESHOLDS (Fast-track)
    if rpm > 100 or cpu > 85:
        state["attack_type"] = "dos"
        print(f"[DETECT] THRESHOLD EXCEEDED: Volumetric (DoS)")
        return state

    if (fails > 5 or (code in (401, 403) and rpm > 30)) and ("/login" in endpoint or "/auth" in endpoint):
        state["attack_type"] = "brute_force"
        print(f"[DETECT] THRESHOLD EXCEEDED: Brute Force")
        return state

    if any(endpoint.startswith(p) for p in PROTECTED) and code in (401, 403):
        state["attack_type"] = "unauth_access"
        print(f"[DETECT] SENSITIVE RESOURCE: Unauthorized Access")
        return state

    # Otherwise, let ML handle it
    state["attack_type"] = "unknown"
    return state

# ─────────────────────────────────────────────
# TOOL 3 – ML MODEL
# ─────────────────────────────────────────────
def ml_model(state: AgentState) -> AgentState:
    try:
        result = ml_predict(state["raw_input"], _models, _scaler, _encoders, _threshold)
        state["ml_result"] = result
        if GNN_AVAILABLE:
            state["gnn_result"] = predict_user_node(state["raw_input"], _gnn_model, _gnn_feat_min, _gnn_feat_max)
        else:
            state["gnn_result"] = {"gnn_label": "Unknown", "gnn_anomaly": -1}

        ml_abn = result['result'] == "Abnormal"
        gnn_abn = GNN_AVAILABLE and state["gnn_result"].get("gnn_anomaly", 0) == 1
        
        if ml_abn or gnn_abn:
            print(f"[TOOL 2 - ml_model] ML={result['result']} vote={result['weighted_vote']} GNN={state['gnn_result'].get('gnn_label','-')}")
            state["attack_type"] = "anomaly"
        else:
            state["attack_type"] = "normal"
    except Exception as e:
        print(f"[TOOL 2 - ml_model] ERROR: {e}")
        state["ml_result"]  = {"result": "Unknown"}
        state["attack_type"] = "normal"
    return state

# ─────────────────────────────────────────────
# TOOL 4 – LLM MODEL
# ─────────────────────────────────────────────
def llm_model(state: AgentState) -> AgentState:
    rec = state["raw_input"]
    prompt = f"Decide mitigation for telemetry: {json.dumps(rec)}. Reply in JSON: {{'threat': bool, 'action': 'captcha|temp_block|ip_blocker|allow'}}"
    try:
        response = _groq.chat.completions.create(model=GROQ_MODEL, messages=[{"role":"user","content":prompt}], response_format={"type":"json_object"})
        parsed = json.loads(response.choices[0].message.content)
        state["llm_action"] = parsed.get("action", "temp_block")
    except:
        state["llm_action"] = "temp_block"
    return state

# ─────────────────────────────────────────────
# MITIGATION
# ─────────────────────────────────────────────
def _write_blocked_ip(ip: str):
    import json, os
    base_dir = os.path.dirname(os.path.abspath(__file__))
    blocked_file = os.path.join(base_dir, "blocked_ips.json")
    blocked = []
    if os.path.exists(blocked_file):
        try:
            with open(blocked_file, "r", encoding="utf-8") as f: blocked = json.load(f)
        except: pass
    if ip not in blocked:
        blocked.append(ip)
        print(f"[BLOCK] Adding {ip} to manifest...")
    else:
        print(f"[BLOCK] {ip} is already blocked.")
    with open(blocked_file, "w", encoding="utf-8") as f:
        json.dump(blocked, f)
        f.flush()
        os.fsync(f.fileno())

def captcha_giver(state: AgentState) -> AgentState:
    ip = state["raw_input"].get("source_ip", "unknown")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    CAPTCHA_FILE = os.path.join(base_dir, "captcha_required_ips.json")
    try:
        ips = []
        if os.path.exists(CAPTCHA_FILE):
            with open(CAPTCHA_FILE, 'r') as f: ips = json.load(f)
        if ip not in ips: ips.append(ip)
        with open(CAPTCHA_FILE, 'w') as f: json.dump(ips, f)
    except: pass
    print(f"[TOOL 4 - captcha] CAPTCHA issued -> {ip}")
    state["captcha_issued"] = True
    return state

def login_remover(state: AgentState) -> AgentState:
    ip = state["raw_input"].get("source_ip", "unknown")
    print(f"[TOOL 5 - login_remover] Session revoked -> {ip}")
    state["login_removed"] = True
    return state

def temp_block(state: AgentState) -> AgentState:
    ip = state["raw_input"].get("source_ip", "unknown")
    _write_blocked_ip(ip)
    print(f"[TOOL 6 - temp_block] {ip} blocked temporarily")
    state["temp_blocked"] = True
    return state

def ip_blocker(state: AgentState) -> AgentState:
    ip = state["raw_input"].get("source_ip", "unknown")
    _write_blocked_ip(ip)
    print(f"[TOOL 7 - ip_blocker] {ip} PERMANENTLY BLOCKED")
    state["ip_blocked"] = True
    state["final_verdict"] = "Abnormal"
    state["final_action"] = "ip_blocked"
    state["explanation"] = f"IP {ip} blocked after {state['attack_type']} detection."
    return state

def status_check(state: AgentState) -> AgentState:
    rec = state["raw_input"]
    rpm = float(rec.get("requests_per_minute", 0))
    fails = float(rec.get("failed_logins", 0))
    still_attacking = (fails > 20 or rpm > 50)
    state["status_normal"] = not still_attacking
    print(f"[TOOL 8 - status_check] still_attacking={still_attacking}")
    return state

def respond(state: AgentState) -> AgentState:
    if not state.get("final_verdict"):
        if state["attack_type"] == "normal":
            state["final_verdict"], state["final_action"], state["explanation"] = "Normal", "allow", "Traffic is normal."
        else:
            state["final_verdict"], state["final_action"] = "Abnormal", "mitigated"
            state["explanation"] = f"Threat mitigated: {state['attack_type']}."
    if state["final_verdict"] == "Abnormal":
        print("\n************************************************************")
        print(f"** !! PROJECT DEFEND - AI MITIGATION !! {' ':<19} **")
        print(f"** TYPE: {state['attack_type'].upper():<35} ACTION: BLOCKED **")
        print("************************************************************\n")
    return state

# ─────────────────────────────────────────────
# ROUTING
# ─────────────────────────────────────────────
def route_after_classify(state: AgentState) -> str:
    t = state["attack_type"]
    if t == "unknown": return "ml_model"
    if t in ("xss_attack", "nosql_injection", "sql_injection", "dos"): return "ip_blocker"
    if t == "brute_force": return "temp_block"
    if t == "unauth_access": return "login_remover"
    return "respond"

def route_after_ml(state: AgentState) -> str:
    if state["attack_type"] == "normal": return "respond"
    return "llm_model"

def route_after_status(state: AgentState) -> str:
    if state["status_normal"]: return "respond"
    return "ip_blocker"

# ─────────────────────────────────────────────
# GRAPH
# ─────────────────────────────────────────────
def build_agent():
    g = StateGraph(AgentState)
    for n, f in [("log_getter", log_getter), ("ml_model", ml_model), ("classify_attack", classify_attack), ("llm_model", llm_model), ("captcha_giver", captcha_giver), ("login_remover", login_remover), ("temp_block", temp_block), ("ip_blocker", ip_blocker), ("status_check", status_check), ("respond", respond)]: g.add_node(n, f)
    g.set_entry_point("log_getter")
    g.add_edge("log_getter", "classify_attack")
    g.add_conditional_edges("classify_attack", route_after_classify, {
        "ml_model": "ml_model", "ip_blocker": "ip_blocker", "temp_block": "temp_block", 
        "login_remover": "login_remover", "respond": "respond"
    })
    g.add_edge("login_remover", "temp_block")
    g.add_conditional_edges("ml_model", route_after_ml, {"respond": "respond", "llm_model": "llm_model"})
    g.add_conditional_edges("llm_model", lambda s: s["llm_action"], {"captcha": "captcha_giver", "temp_block": "temp_block", "ip_blocker": "ip_blocker", "allow": "respond"})
    g.add_edge("temp_block", "status_check")
    g.add_edge("captcha_giver", "status_check")
    g.add_conditional_edges("status_check", route_after_status, {"respond": "respond", "ip_blocker": "ip_blocker"})
    g.add_edge("ip_blocker", "respond")
    g.add_edge("respond", END)
    return g.compile()

agent = build_agent()

def run_agent(server_json: dict) -> dict:
    initial: AgentState = { "raw_input": server_json, "ml_result": {}, "gnn_result": {}, "attack_type": "", "llm_action": "", "llm_reasoning": "", "captcha_issued": False, "login_removed": False, "temp_blocked": False, "ip_blocked": False, "status_normal": False, "escalation_step": 0, "final_verdict": "", "final_action": "", "explanation": "" }
    final = agent.invoke(initial)
    return { "verdict": final["final_verdict"], "action": final["final_action"], "attack_type": final["attack_type"], "explanation": final["explanation"], "ip_blocked": final["ip_blocked"], "temp_blocked": final["temp_blocked"] }

if __name__ == "__main__":
    cases = [{"label": "XSS Signature", "data": {"source_ip": "1.1.1.1", "request_payload": "<script>alert(1)</script>", "requests_per_minute": 5}}, {"label": "Normal session", "data": {"source_ip": "127.0.0.1", "requests_per_minute": 5, "cpu_usage_percent": 4}}, {"label": "DoS flood", "data": {"source_ip": "5.6.7.8", "requests_per_minute": 1500, "cpu_usage_percent": 98}}]
    for c in cases:
        print(f"\n>>> TEST: {c['label']}")
        run_agent(c["data"])
