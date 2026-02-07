
import requests
import json
import sys

BASE_URL = "http://localhost:5000/api"

def run_test():
    print("Starting Learning Path Feature Verification...")
    
    # 1. Register/Login User
    email = "learning_test@example.com"
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
            "name": "Learning Tester",
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
    
    # 2. Test Get Skills
    print("2. Testing GET /recommend/learning-path/skills...")
    resp = requests.get(f"{BASE_URL}/recommend/learning-path/skills", headers=headers)
    if resp.status_code == 200:
        skills = resp.json()
        print(f"   -> Success! Found {len(skills)} skills.")
        if "Python" in skills:
            print("   -> Python found in skills.")
        else:
            print("   -> Python MISSING!")
    else:
        print(f"   -> Failed: {resp.status_code} - {resp.text}")
        
    # 3. Test Generate Path (Python)
    print("3. Testing POST /recommend/learning-path (Python)...")
    resp = requests.post(f"{BASE_URL}/recommend/learning-path", json={"skill": "Python"}, headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        print("   -> Success!")
        print(f"      Title: {data.get('title')}")
        print(f"      Modules: {len(data.get('modules', []))}")
        if data.get('modules'):
            print(f"      Week 1 Topic: {data['modules'][0]['topic']}")
    else:
        print(f"   -> Failed: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"Test Failed: {e}")
