
import requests
import json
import sys

BASE_URL = "http://localhost:5000/api"

def run_test():
    print("Starting Roadmap API Verification...")
    
    # 1. Register/Login User
    email = "roadmap_test@example.com"
    password = "password123"
    
    print(f"1. Authenticating as {email}...")
    auth_response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    
    token = None
    if auth_response.status_code == 200:
        token = auth_response.json()['access_token']
        print("   -> Login successful.")
    else:
        print("   -> Login failed, attempting registration...")
        reg_response = requests.post(f"{BASE_URL}/auth/register", json={
            "name": "Roadmap Tester",
            "email": email,
            "password": password,
            "role": "student"
        })
        if reg_response.status_code == 201:
            print("   -> Registration successful.")
            auth_response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": email,
                "password": password
            })
            token = auth_response.json()['access_token']
        else:
            print(f"   -> Registration failed: {reg_response.text}")
            sys.exit(1)
            
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Ensure Profile
    print("2. Ensuring Profile...")
    requests.put(f"{BASE_URL}/students/me", json={
        "name": "Roadmap Tester",
        "cgpa": 8.0,
        "skills": ["Python", "Java"]
    }, headers=headers)
    
    # 3. Test Get Companies
    print("3. Testing GET /roadmap/companies...")
    resp = requests.get(f"{BASE_URL}/analytics/roadmap/companies", headers=headers)
    if resp.status_code == 200:
        companies = resp.json()
        print(f"   -> Success! Found {len(companies)} companies.")
        if "Amazon" in companies and "TCS" in companies:
            print("   -> Key companies present.")
        else:
            print("   -> Missing key companies!")
    else:
        print(f"   -> Failed: {resp.status_code} - {resp.text}")
        
    # 4. Test Generate Roadmap (Amazon)
    print("4. Testing POST /roadmap (Amazon)...")
    resp = requests.post(f"{BASE_URL}/analytics/roadmap", json={"company": "Amazon"}, headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        print("   -> Success!")
        print(f"      Company: {data.get('company')}")
        print(f"      Tier: {data.get('tier')}")
        print(f"      Phases: {len(data.get('timeline', []))}")
    else:
        print(f"   -> Failed: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"Test Failed: {e}")
