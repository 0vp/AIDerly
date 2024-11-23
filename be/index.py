# index.py

from flask import Flask, request, jsonify
from functools import wraps
import datetime
import requests as req
from schedule import schedule_bp
from gpt import gpt_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(schedule_bp)
app.register_blueprint(gpt_bp)

@app.route('/')
def home():
    """
    Home route.
    """
    today = datetime.date.today()
    year = today.strftime("%Y")
    return 'AIDerly © Houtong Cats ' + year

@app.route('/test/gpt')
def test_gpt_route():
    """
    Test the GPT service from browser
    """
    test_client = app.test_client()
    
    # Test with a simple prompt
    response = test_client.post('/gpt/chat',
                              json={'prompt': 'Suggest a gentle morning exercise for seniors'},
                              content_type='application/json')
    
    return jsonify({
        'test_name': 'GPT Service Test',
        'result': response.get_json()
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

if __name__ == "__main__":
    app.run(debug=True)