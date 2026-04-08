import requests
import multiprocessing
import time
import argparse

TARGET_URL = "http://127.0.0.1:8081"

def burn_cpu_loop(stop_event):
    """Burn CPU continuously until the stop signal is set."""
    while not stop_event.is_set():
        _ = 123456789 * 987654321
        _ = 2 ** 1000

def attack_worker(url, duration_seconds, stop_event, worker_id):
    """Each process hammers the server until blocked or time runs out."""
    end_time = time.time() + duration_seconds
    reqs = 0
    session = requests.Session()

    while time.time() < end_time and not stop_event.is_set():
        try:
            r = session.get(f"{url}/", timeout=1)
            if r.status_code == 403:
                # Signal ALL other workers to stop immediately
                if not stop_event.is_set():
                    stop_event.set()
                    print(f"\n    🛑 ════════════════════════════════════════")
                    print(f"    🛑  AI DEFENSE AGENT BLOCKED THE ATTACK!")
                    print(f"    🛑  All Worker Processes Terminated!")
                    print(f"    🛑 ════════════════════════════════════════\n")
                return
            else:
                reqs += 1
                if reqs % 10 == 0:
                    print(f"    💥 [ATTACKING] Worker-{worker_id} hammering server... ({reqs} hits)")
                    # Burn CPU to simulate load
                    _ = [x**2 for x in range(1000000)]
        except Exception:
            pass


def simulate_dos(url, duration_seconds=600):
    process_count = multiprocessing.cpu_count()
    
    print(f"[*] 🌪️  INITIATING HIGH-INTENSITY ATTACK against {url}")
    print(f"    Workers: {process_count} | Duration: {duration_seconds}s | CPU Burn: ON")
    print(f"    ▶ Attack will STOP AUTOMATICALLY when the AI blocks the IP\n")

    # Shared stop signal — any worker can set this to halt all workers
    stop_event = multiprocessing.Event()

    # CPU burner processes for maximum spike
    cpu_burners = []
    for _ in range(max(1, process_count // 2)):
        p = multiprocessing.Process(target=burn_cpu_loop, args=(stop_event,))
        p.start()
        cpu_burners.append(p)

    # Attack worker processes
    workers = []
    for i in range(process_count):
        p = multiprocessing.Process(target=attack_worker, args=(url, duration_seconds, stop_event, i+1))
        p.start()
        workers.append(p)

    for p in workers:
        p.join()

    # Stop all CPU burners once attack ends
    stop_event.set()
    for p in cpu_burners:
        p.terminate()

    if stop_event.is_set():
        print("[+] ✅  Attack STOPPED. Server defended by AI Agent!")
    else:
        print("[+] ✔️  Attack simulation complete (time limit reached).")


def simulate_brute_force(url, attempts=35, delay=0.1):
    login_url = f"{url}/users/login"
    print(f"[*] 🕵️  Starting Brute Force simulation against {login_url}")
    for i in range(attempts):
        try:
            r = requests.post(login_url, json={"email": "admin@arivu.com", "password": f"wrong_{i}"}, timeout=2)
            print(f"    [Attempt {i+1}] Status: {r.status_code}")
        except:
            pass
        time.sleep(delay)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dos", action="store_true")
    parser.add_argument("--bf", action="store_true")
    parser.add_argument("--target", default=TARGET_URL)
    args = parser.parse_args()

    if args.dos:
        simulate_dos(args.target)
    elif args.bf:
        simulate_brute_force(args.target)
    else:
        print("Usage: python simulate_attacks.py --dos")

