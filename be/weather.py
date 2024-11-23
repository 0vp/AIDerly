
import requests
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
class WeatherAdvisor:
    def __init__(self):
        
        self.TOMORROW_API_KEY = os.getenv("TOMORROW_API_KEY")
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

        self.MONTREAL_LAT = "45.5017"
        self.MONTREAL_LONG = "-73.5673"

        # Base URL for Tomorrow.io API
        self.TOMORROW_BASE_URL = "https://api.tomorrow.io/v4/weather/realtime"

    def get_weather_data(self):
        """Fetch current weather data for Montreal"""
        try:
            params = {
                "location": f"{self.MONTREAL_LAT},{self.MONTREAL_LONG}",
                "apikey": self.TOMORROW_API_KEY,
                "units": "metric"
            }

            response = requests.get(self.TOMORROW_BASE_URL, params=params)
            response.raise_for_status()

            weather_data = response.json()
            return {
                "temperature": weather_data["data"]["values"]["temperature"],
                "humidity": weather_data["data"]["values"]["humidity"],
                "windSpeed": weather_data["data"]["values"]["windSpeed"],
                "precipitation": weather_data["data"]["values"]["precipitationProbability"],
                "weatherCode": weather_data["data"]["values"]["weatherCode"],
                "feelsLike": weather_data["data"]["values"]["temperatureApparent"]
            }
        except Exception as e:
            return {
                "error": f"Failed to fetch weather data: {str(e)}"
            }

    def get_weather_advice(self):
        """Get personalized weather advice for elderly adults"""
        try:
            # Get current weather
            weather = self.get_weather_data()
            if "error" in weather:
                return weather

            # Create prompt for GPT
            prompt = f"""
                Current weather in Montreal:
                - Temperature: {weather['temperature']}°C (Feels like: {weather['feelsLike']}°C)
                - Humidity: {weather['humidity']}%
                - Wind Speed: {weather['windSpeed']} km/h
                - Precipitation Probability: {weather['precipitation']}%

                As a caring advisor for elderly adults, provide:
                1. current weather - categorized only for "sunny", "cloudy", "rainy", "snowy"
                2. Specific clothing recommendations
                3. Safety precautions based on current conditions
                4. Suggested activities that are appropriate for today's weather
                5. Any health-related advice considering the weather


                Format the response as a JSON with the following structure:
                {{
                    "current weather": "weather",
                    "clothing_advice": ["item1", "item2", ...],
                    "safety_tips": ["tip1", "tip2", ...],
                    "recommended_activities": ["activity1", "activity2", ...],
                    "health_advice": ["advice1", "advice2", ...],
                    "timestamp": "current_time"
                }}
                """

            response = client.chat.completions.create(model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a weather advisor for elderly adults in Montreal, focusing on their safety and comfort."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7)

            # Parse GPT response and add weather data
            advice = response.choices[0].message.content
            result = {
                "current_weather": weather,
                "advice": eval(advice),  # Convert string to dict
                "location": "Montreal"
            }

            return result

        except Exception as e:
            return {
                "error": f"Failed to generate weather advice: {str(e)}"
            }

def test_weather_advisor():
    advisor = WeatherAdvisor()

    print("\nFetching weather data:")
    weather_data = advisor.get_weather_data()
    print(weather_data)

    print("\nGetting weather advice:")
    advice = advisor.get_weather_advice()
    print(advice)

if __name__ == "__main__":
    test_weather_advisor()