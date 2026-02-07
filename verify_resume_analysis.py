
import requests
import json
import sys
import os
try:
    from reportlab.pdfgen import canvas
except ImportError:
    print("ReportLab not installed, installing...")
    os.system("pip install reportlab")
    from reportlab.pdfgen import canvas

BASE_URL = "http://localhost:5000/api"

def create_dummy_resume(filename="test_resume.pdf"):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "John Doe")
    c.drawString(100, 730, "Education: B.Tech in Computer Science")
    c.drawString(100, 710, "Skills: Python, Java, SQL, React")
    c.drawString(100, 690, "Projects: Built a web app using Flask and React.")
    c.drawString(100, 670, "Experience: Intern at Tech Corp.")
    c.save()
    print(f"Created dummy resume: {filename}")
    return filename

def run_test():
    print("Starting Resume Intelligence Verification...")
    
    # 1. Register/Login User
    email = "resume_test@example.com"
    password = "password123"
    
    # Auth logic (reuse or simplify)
    auth_response = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    token = None
    if auth_response.status_code == 200:
        token = auth_response.json()['access_token']
    else:
        # Register if needed
        requests.post(f"{BASE_URL}/auth/register", json={"name": "Resume Tester", "email": email, "password": password, "role": "student"})
        auth_response = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        token = auth_response.json().get('access_token')

    if not token:
        print("Auth failed.")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create and Upload Resume
    filename = create_dummy_resume()
    
    print("Uploading resume for analysis...")
    with open(filename, 'rb') as f:
        files = {'file': (filename, f, 'application/pdf')}
        resp = requests.post(f"{BASE_URL}/analyze/resume", files=files, headers=headers)
        
    if resp.status_code == 200:
        data = resp.json()
        print("Analysis Success!")
        print(f"Score: {data.get('resume_score')}")
        print(f"Found Skills: {data.get('found_skills')}")
        print(f"Missing (Sample): {data.get('missing_skills')}")
        
        # Verify specific skills were found
        if "python" in [s.lower() for s in data.get('found_skills', [])]:
            print("Verified: Python detected.")
        else:
            print("Failed: Python NOT detected.")
    else:
        print(f"Analysis Failed: {resp.status_code} - {resp.text}")
        
    # Cleanup
    if os.path.exists(filename):
        os.remove(filename)

if __name__ == "__main__":
    run_test()
