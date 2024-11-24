from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from functools import wraps
import datetime
import requests as req
from schedule import Calendaradvisor
from gpt import gpt_bp
from image import get_image
from gpt import gpt_bp
from weather import WeatherAdvisor
from medicine import MedicineAdvisor
from chatbot import ElderlyChatbot
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


calendar_advisor = Calendaradvisor(storage_path="calendar_storage")
weather_advisor = WeatherAdvisor()
medicine_advisor = MedicineAdvisor()
chatbot = ElderlyChatbot()


@app.route('/')
def home():
    """
    Home route.
    """
    today = datetime.date.today()
    year = today.strftime("%Y")

    return 'AIDerly © Houtong Cats ' + year

@app.route('/weather/advice', methods=['GET'])
def get_weather_advice():
    """
    Get weather advice for elderly in Montreal
    """
    response = weather_advisor.get_weather_advice()
    return jsonify(response)
    
@app.route('/weather/current', methods=['GET'])
def get_current_weather():
    """
    Get only current weather data without advice
    """
    response = weather_advisor.get_weather_data()
    return jsonify({
            'location': 'Montreal',
            'weather': response,
            'timestamp': datetime.datetime.now().isoformat()
        })


@app.route('/calendar/update', methods=['POST'])
def update_calendar():
    """
    Update calendar
    """
    data = request.get_json()
        
    if not data or 'query' not in data:
        return jsonify({
            'error': 'Missing required field: query'
        }), 400

    user_id = data.get('user_id', 'default_user')
    query = data.get('query')

    result = calendar_advisor.process_calendar_query(
        query=query,
        user_id=user_id
    )

    return jsonify(result)

@app.route('/calendar/<user_id>', methods=['GET'])
def get_calendar(user_id):
    """
    Get current calendar for a user
    """
    calendar = calendar_advisor.get_calendar(user_id)
    return jsonify(calendar)

@app.route('/test/calendar')
def test_calendar():
    """
    Test endpoint with various calendar operations
    """
    # Test user ID
    test_user = "abc"
    
    # Test Case 1: Add new event
    add_result = calendar_advisor.process_calendar_query(
        "Add yoga class every Tuesday at 9 AM",
        user_id=test_user
    )
    
    # Test Case 2: Modify event
    modify_result = calendar_advisor.process_calendar_query(
        "Change yoga class to 10 AM on Tuesday",
        user_id=test_user
    )

    return jsonify({
        'test_results': {
            'add_event': add_result,
            'modify_event': modify_result
        },
        'available_endpoints': {
            'update_calendar': 'POST /calendar/update',
            'get_calendar': 'GET /calendar/<user_id>'
        }
    })


@app.route('/image/<imageName>', methods=['GET', 'OPTIONS'])
def search_image(imageName):
    """
    Get an image from Yahoo search.
    """
    # if request.method == 'OPTIONS':
    #     response = make_response()

    #     response.headers.add("Access-Control-Allow-Origin", "*")
    #     response.headers.add("Access-Control-Allow-Methods", "GET")
    #     response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    #     return response, 204

    url = get_image(imageName)
    print(url)

    return jsonify({
        'image': url
    })

@app.after_request
def handle_options(response):
    """
    Allow cross-origin requests.
    """
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"

    return response
CALENDAR_FILE_PATH = r'./calendar_storage/default_user_calendar.json'
@app.route('/calendar', methods=['GET'])
def load_calendar(user_id='default_user'):
    with open(CALENDAR_FILE_PATH, 'r') as file:
        calendar_data = json.load(file)
    return jsonify(calendar_data)

@app.route('/chatbot/<query>', methods=['GET'])
def get_chatbot_response(query, user_id='default_user'):
    """
    Get chatbot response
    """
    response = chatbot.process_query(query=query, user_id=user_id)
    return jsonify(response)

if __name__ == "__main__":
    app.run()