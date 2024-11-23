# test_schedule.py

import requests
import json

def test_schedule():
    # Base URL
    base_url = 'http://localhost:5000'
    
    # Test 1: Create a schedule
    create_data = {
        "user_id": "test_user",
        "text": "Schedule a yoga class every Monday at 9 AM for 1 hour"
    }
    
    print("Creating schedule...")
    response = requests.post(f'{base_url}/chat/schedule', json=create_data)
    print(json.dumps(response.json(), indent=2))
    
    # Test 2: View the schedule
    print("\nViewing schedule...")
    response = requests.get(f'{base_url}/chat/view/test_user')
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    test_schedule()