
import requests
import json
import sys

BASE_URL = "http://localhost:5000/api"

def run_test():
    print("Starting Skill Gap Analysis Verification...")
    
    # 1. Register/Login User
    email = "skillgap_test@example.com"
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
            "name": "Skill Gap Tester",
            "email": email,
            "password": password,
            "role": "student"
        })
        if reg_response.status_code == 201:
            print("   -> Registration successful.")
            # Login again
            auth_response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": email,
                "password": password
            })
            token = auth_response.json()['access_token']
        else:
            print(f"   -> Registration failed: {reg_response.text}")
            sys.exit(1)
            
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Ensure Profile Exists
    print("2. Ensuring Student Profile...")
    profile_data = {
        "name": "Skill Gap Tester",
        "branch": "Computer Science",
        "cgpa": 8.5,
        "tenth_marks": 90,
        "twelfth_marks": 92,
        "internships": 1,
        "projects": 2,
        "backlogs": 0,
        "skills": ["Python", "Java", "SQL"], # Key skills
        "placed": False
    }
    
    requests.put(f"{BASE_URL}/students/me", json=profile_data, headers=headers)
    print("   -> Profile updated.")
    
    # 3. Test Role-Based Gap Analysis
    print("3. Testing Role-Based Gap Analysis (target: Software Engineer)...")
    role_payload = {
        "mode": "role",
        "target_role": "Software Engineer"
    }
    role_resp = requests.post(f"{BASE_URL}/analytics/skill-gap", json=role_payload, headers=headers)
    
    if role_resp.status_code == 200:
        data = role_resp.json()
        print("   -> Success!")
        print(f"      Match Percentage: {data.get('match_percentage')}%")
        print(f"      Missing Skills: {data.get('missing_skills')}")
        if data.get('match_percentage') is not None and isinstance(data.get('missing_skills'), list):
            print("   -> Structure Validated.")
        else:
            print("   -> Structure INVALID.")
            print(data)
    else:
        print(f"   -> Failed: {role_resp.status_code} - {role_resp.text}")
        
    # 4. Test Peer Comparison Analysis
    print("4. Testing Peer Comparison Analysis...")
    peer_payload = {
        "mode": "peer"
    }
    peer_resp = requests.post(f"{BASE_URL}/analytics/skill-gap", json=peer_payload, headers=headers)
    
    if peer_resp.status_code == 200:
        data = peer_resp.json()
        print("   -> Success!")
        print(f"      Metrics: {json.dumps(data.get('metrics'), indent=2)}")
        if data.get('metrics') and data.get('metrics').get('cgpa'):
            print("   -> Structure Validated.")
        else:
            print("   -> Structure INVALID.")
    else:
        print(f"   -> Failed: {peer_resp.status_code} - {peer_resp.text}")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"Test Failed with Exception: {e}")
