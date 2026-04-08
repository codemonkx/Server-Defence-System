import requests
import time
import sys

# Target Configuration
TARGET_URL = "http://127.0.0.1:8081/users/login"
TARGET_EMAIL = "admin@learnhub.com"
CORRECT_PASSWORD = "admin@1234" # UPDATE THIS if your admin password is different

# Common Passwords for simulation
# We place the correct password at the 25th position.
# This gives the AI Defense Agent enough time to detect the failed attempts (Threshold is 20).
PASSWORDS = [
    "123456", "password", "12345678", "admin123", "qwerty",
    "login123", "arivu2024", "password123", "welcome", "letmein",
    "security", "hackme", "root", "toor", "superman",
    "batman", "wonderwoman", "ironman", "spiderman", "avengers",
    "cyber", "defense", "agent", "mistral", "google",
    "deepmind", "antigravity", "srmist", "chennai", "india",
    CORRECT_PASSWORD # Correct password is now at index 31
]

def print_banner():
    print("\n" + "="*60)
    print(" 🛡️  PROJECT DEFEND ATTACK SIMULATOR - DEMO MODE")
    print("="*60)
    print(f" Target Endpoint : {TARGET_URL}")
    print(f" Target Account  : {TARGET_EMAIL}")
    print(f" Max Attempts    : {len(PASSWORDS)}")
    print(f" Correct Pass Pos: {PASSWORDS.index(CORRECT_PASSWORD) + 1}")
    print("="*60 + "\n")

def simulate_brute_force():
    session = requests.Session()
    print(f"[*] Starting brute force sequence...")
    print(f"[*] NOTE: AI Defense Agent threshold is 10 failed logins.")
    print(f"[*] If the agent is OFF, attempt 31 will SUCCESS.")
    print(f"[*] If the agent is ON, it will BLOCK before attempt 31.\n")
    
    for i, password in enumerate(PASSWORDS):
        sys.stdout.write(f"\r[Attempt {i+1:2d}] Testing: {password:<15}")
        sys.stdout.flush()
        
        try:
            response = session.post(
                TARGET_URL, 
                json={"email": TARGET_EMAIL, "password": password},
                timeout=5
            )
            
            if response.status_code == 202:
                print(f"\n\n🔓 [HACK SUCCESS] Correct password found: {password}")
                print(f"🔓 The hacker has gained access to the system!")
                return
            elif response.status_code == 403:
                print(f"\n\n🛑 [ATTACK BLOCKED] HTTP 403 Forbidden received!")
                print("🛑 AI DEFENSE AGENT DETECTED THE THREAT AND BLOCKED THE IP!")
                print("🛑 The hacker was stopped before they could find the password.")
                return
            elif response.status_code == 401:
                # Expected for wrong password
                pass
            else:
                print(f"\n[!] Unexpected Status Code: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("\n\n❌ [ERROR] Connection lost. The server might have blocked the IP at the firewall level.")
            return
        except Exception as e:
            print(f"\n\n❌ [ERROR] {str(e)}")
            return
            
        time.sleep(0.4) # Slightly slower delay for synchronized demo

    print("\n\n[-] Brute force simulation complete. No valid password found (as expected).")
    print("[-] Check the Defense Agent dashboard to see the detected threat.")

if __name__ == "__main__":
    print_banner()
    try:
        simulate_brute_force()
    except KeyboardInterrupt:
        print("\n\n[!] Simulation interrupted by user.")
    print("\n" + "="*60)
