
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_prs_flow():
    # 1. Login to get token
    print("Logging in...")
    login_payload = {
        "email": "prs_test_user@example.com",
        "password": "password123"
    }
    # Create user if not exists first? Assume exists from previous runs or create
    register_payload = {
        "email": "prs_test_user@example.com",
        "password": "password123",
        "confirmPassword": "password123",
        "name": "PRS Tester"
    }
    try:
        requests.post(f"{BASE_URL}/auth/register", json=register_payload)
    except:
        pass

    res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if res.status_code != 200:
        print(f"Login failed: {res.text}")
        return
    
    token = res.json().get('access_token')
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Update Profile to ensure data exists
    profile_payload = {
        "name": "PRS Tester",
        "branch": "CSE",
        "cgpa": 8.5,
        "tenth_marks": 90,
        "twelfth_marks": 90,
        "internships": 1,
        "projects": 2,
        "skills": ["python", "java", "react"],
        "profile_data": json.dumps({"languages": ["python", "java"]})
    }
    # PUT
    requests.put(f"{BASE_URL}/students/me", json=profile_payload, headers=headers)

    # 3. Fetch PRS Score
    print("Fetching PRS Score...")
    res = requests.get(f"{BASE_URL}/analytics/prs", headers=headers)
    
    if res.status_code == 200:
        data = res.json()
        print("\n--- PRS RESULT ---")
        print(json.dumps(data, indent=2))
        if 'score' in data:
            print("\nSUCCESS: Score returned.")
    else:
        print(f"\nFAILURE: PRS API returned {res.status_code}: {res.text}")

if __name__ == "__main__":
    test_prs_flow()
