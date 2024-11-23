from flask import Flask, request, jsonify

from functools import wraps

import datetime
import requests as req

app = Flask(__name__)

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

    return response

if __name__ == "__main__":
    app.run()