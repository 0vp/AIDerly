from flask import Flask, request, jsonify
from functools import wraps
import datetime
import requests as req
from schedule import schedule_bp
from gpt import gpt_bp
from schedule import schedule_bp, schedules
from gpt import gpt_bp
from test_schedule import create_test_schedule_blueprint

app = Flask(__name__)

# Register the schedule blueprint
app.register_blueprint(schedule_bp)
app.register_blueprint(gpt_bp)
test_schedule_bp = create_test_schedule_blueprint(schedules)
app.register_blueprint(test_schedule_bp)

@app.route('/')
def home():
    """
    Home route.
    """
    today = datetime.date.today()
    year = today.strftime("%Y")

    return 'AIDerly © Houtong Cats ' + year


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