
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_registration(email, password, role, expected_status, description):
    print(f"Testing: {description} ({email}, {role})...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": password,
            "role": role
        })
        
        if response.status_code == expected_status:
            print(f"✅ PASS: Got {response.status_code}")
            if response.status_code == 201:
                print(f"   User created: {response.json()['user']['id']}")
        else:
            print(f"❌ FAIL: Expected {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ FAIL: Exception {e}")

def run_tests():
    # 1. Invalid Student Email
    test_registration("bad_student@gmail.com", "pass123", "student", 400, "Invalid Student Domain")
    
    # 2. Valid Student Email
    test_registration("valid_student@college.edu.in", "pass123", "student", 201, "Valid Student Domain")
    
    # 3. Invalid Faculty Email
    test_registration("bad_faculty@gmail.com", "pass123", "faculty", 400, "Invalid Faculty Domain")
    
    # 4. Valid TPO Email
    test_registration("tpo_officer@college.ac.in", "pass123", "tpo", 201, "Valid TPO Domain")
    
    # 5. Valid Admin Email
    test_registration("sys_admin@college.ac.in", "pass123", "admin", 201, "Valid Admin Domain")

if __name__ == "__main__":
    run_tests()
