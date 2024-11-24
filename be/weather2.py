import os
import requests as req
from dotenv import load_dotenv

load_dotenv()
weather_api_key=os.getenv("WEATHER_API_KEY")
print(weather_api_key)

def weather(location):
    attempt = req.get(f'http://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={location}&aqi=no')

    return attempt.json()