from openai import OpenAI
import json
import os
from dotenv import load_dotenv
from schedule import Calendaradvisor
from medicine import MedicineAdvisor
from weather import WeatherAdvisor
from typing import List, Dict
from datetime import datetime
import requests as req
import os
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
weather_api_key=os.getenv("WEATHER_API_KEY")
def weather(location):
    attempt = req.get(f'http://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={location}&aqi=no')
    return attempt.json()

class ElderlyChatbot:
    def __init__(self):
        self.calendar = Calendaradvisor(storage_path="calendar_storage")
        self.medicine = MedicineAdvisor()
        self.weather = WeatherAdvisor()
        self.conversation_history: List[Dict[str, str]] = []
        self.max_history = 3
        self.SYSTEM_PROMPT = """
        DO NOT OUTPUT any emoji!
        Conversation history: {self.conversation_history}
        Your name is "Darling", As an experienced caretaker well-versed in traditional ways, you are speaking to a child.
        Make the conversation friendly and informal, keep it short!
        Had the conversation history, and remind the person what the previous conversation was when the user asked.
        1. Analyze user queries and determine the appropriate action
        2. Identify if the query requires:
        - Calendar management (e.g., scheduling activities, modifying activities for a specific date, clean the calendar)
        if the user is asking only to get the current calendar, then the function_call is 'get_current_calendar';
        - Medication advice
        - Weather information
        - General conversation/advice
        3. Return a structured response that indicates the type of query and required action.
        Reply friendly and informal, like a old friend to the user. TALK like a child, do not use any close words!

    Response format for routing queries:
    {
        "query_type": "calendar|medicine|weather|general",
        "action_needed": true/false,
        "function_call": "name_of_function_to_call",
        "parameters": {
            "param1": "value1",
            ...
        },
        "response_text": "friendly response to user"
    }"""
    

    def analyze_query(self, query):
        """
        Analyze user query to determine required action
        """
        try:
            if len(self.conversation_history) > self.max_history * 2:  # *2 for user + assistant pairs
                self.conversation_history = self.conversation_history[-self.max_history * 2:]
            prompt = f"""
            User query: {query}
            Conversation history: {json.dumps(self.conversation_history, indent=2)}
            Please analyze this query and determine:
            1. What type of request this is
            2. What action (if any) needs to be taken
            3. What parameters are needed

            Return the analysis in the specified JSON format.
            """

            response = client.chat.completions.create(model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7)
            # Store user query in history
            self.conversation_history.append({
                "role": "user",
                "content": query,
                "timestamp": datetime.now().strftime("%I:%M %p")
            })
            # Get the response content and parse it
            response_content = response.choices[0].message.content
            analysis = json.loads(response_content)

            # Store assistant response in history
            self.conversation_history.append({
                "role": "darling",
                "content": analysis['response_text'],
                "timestamp": datetime.now().strftime("%I:%M %p")
            })

            return analysis

        except Exception as e:
            return {
                'error': 'Failed to analyze query',
                'details': str(e)
            }

    def get_conversation_history(self):
        """
        Format conversation history for display
        """
        if not self.conversation_history:
            return "No previous conversations yet."

        formatted_history = []
        for msg in self.conversation_history:
            time = msg.get('timestamp', 'unknown time')
            if msg['role'] == 'user':
                formatted_history.append(f"At {time}, you said: {msg['content']}")
            else:
                formatted_history.append(f"I responded: {msg['content']}")

        return "\n".join(formatted_history)
    
    def process_query(self, query, user_id="default_user"):
        """
        Process user query and return appropriate response
        """
        try:
            # Analyze the query
            analysis = self.analyze_query(query)
            if 'error' in analysis:
                return f"I'm sorry, I had trouble understanding that. Could you please rephrase your question?"

            # Handle different query types
            if analysis['query_type'] == 'calendar':
                if analysis['action_needed']:
                    if analysis['function_call'] == 'get_current_calendar':
                        calendar = self.calendar.get_calendar(user_id)
                        prompt = f"""
                        query is {query}
                        current calendar is {calendar}
                        please tell the user the current calendar and specify the day and time of the activity
                        """

                        response = client.chat.completions.create(model="gpt-4o-mini",
                        messages=[
                            {"role": "system", "content": self.SYSTEM_PROMPT},
                            {"role": "user", "content": prompt}
                        ],
                        temperature=0.7)
                        advice_content = response.choices[0].message.content
                        advice_dict = json.loads(advice_content)
                        return advice_dict["response_text"]
                    else:
                        result = self.calendar.process_calendar_query(query, user_id)
                        return f"{analysis['response_text']} {self._format_calendar_response(result)}"
                
                
            elif analysis['query_type'] == 'weather':
                if analysis['action_needed']:
                    # weather_result = self.weather.get_weather_data()
                    weather_result = weather("Montreal")
                    prompt = f"""
                    weather result is {weather_result}
                    return two sentence about the current weather and tips for elderly adults 
                    """
                    response = client.chat.completions.create(model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": self.SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7)
                    advice_content = response.choices[0].message.content
                    advice_dict = json.loads(advice_content)
                    return advice_dict["response_text"]
                
            return analysis['response_text']

        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}. Could you please try again?"

    def _format_calendar_response(self, result):
        """Format calendar response for user"""
        if 'error' in result:
            return "I had trouble updating your calendar. Please try again."
        
        return "I've updated your calendar successfully."

    def _format_medicine_response(self, result):
        """Format medicine advice for user"""
        if 'error' in result:
            return "I couldn't process your medication query. Please consult your doctor."
        
        response = []
        if result.get('can_take_together') is False:
            response.append("Please note: These medications should not be taken together.")
        if result.get('safety_advice'):
            response.extend(result['safety_advice'])
        
        return " ".join(response)




if __name__ == "__main__":
    """Test function to demonstrate usage"""
    bot = ElderlyChatbot()
    
    # Test calendar query
    response1 = bot.process_query(
        "can you give me current weather",
        user_id="michael"
    )
    print(response1)



