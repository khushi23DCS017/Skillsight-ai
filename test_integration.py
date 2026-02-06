import requests
import time
import sys

BASE_URL = "http://localhost:5000"

def test_health():
    try:
        resp = requests.get(f"{BASE_URL}/health")
        if resp.status_code == 200:
            print("âœ… Health Check Passed:", resp.json())
            return True
        else:
            print("âŒ Health Check Failed Status:", resp.status_code)
            return False
    except Exception as e:
        print("â³ Waiting for server...")
        return False

def test_prediction():
    payload = {
        'Branch': 'CSE', 
        'CGPA': 8.5, 
        '10th_Marks': 90, 
        '12th_Marks': 90,
        'Skills': 'Python|React', 
        'Internships': 1, 
        'Projects': 2
    }
    try:
        resp = requests.post(f"{BASE_URL}/api/predict/placement", json=payload)
        if resp.status_code == 200:
            print("âœ… Prediction Test Passed:", resp.json())
            return True
        else:
            print("âŒ Prediction Test Failed:", resp.text)
            return False
    except Exception as e:
        print("âŒ Prediction Connection Error:", e)
        return False

if __name__ == "__main__":
    print("Starting Integration Tests...")
    server_up = False
    for i in range(10): # Try for 20 seconds
        if test_health():
            server_up = True
            break
        time.sleep(2)
    
    if not server_up:
        print("âŒ Server failed to start in time.")
        sys.exit(1)
        
    if test_prediction():
        print("âœ¨ All System Tests Passed!")
        sys.exit(0)
    else:
        sys.exit(1)
