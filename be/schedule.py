from openai import OpenAI

from datetime import datetime
import json
import os
from dotenv import load_dotenv
import pathlib
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
class Calendaradvisor:
    def __init__(self, storage_path="calendar_storage"):
        self.storage_path = storage_path
        self._init_storage()

        self.SYSTEM_PROMPT = """You are a calendar management assistant for elderly adults. Your job is to:
            1. Understand natural language requests about calendar management
            2. Analyze the current calendar if provided
            3. Make appropriate modifications (add/change/delete events)
            4. Return a structured JSON calendar
            5. if the query is clean the calendar, then clear all events, return an empty calendar

            Example calendar format:
            {
                "user_id": "user123",
                "schedule": [
                    {
                        "day": "Monday",
                        "events": [
                            {
                                "time": "09:00",
                                "title": "Morning Walk",
                                "duration": "30",
                                "type": "exercise",
                                "notes": "Remember to wear comfortable shoes"
                            }
                        ]
                    }
                ],
                "last_updated": "2024-11-22T10:00:00",
                "action_taken": "added morning walk"
            }

            Rules:
            1. Keep times in 24-hour format (HH:MM)
            2. Include helpful notes for elderly users
            3. Specify duration in minutes
            4. Use activity types: exercise, medical, social, meal, hobby
            5. Maintain any non-conflicting existing events
            6. Return complete weekly schedule even if only one day changes
            7. Always include all days of the week in schedule
            8. Sort events by time within each day"""

    def _init_storage(self):
        """Initialize storage directory"""
        pathlib.Path(self.storage_path).mkdir(parents=True, exist_ok=True)

    def _get_calendar_path(self, user_id):
        """Get path for user's calendar file"""
        return os.path.join(self.storage_path, f"{user_id}_calendar.json")

    def _load_calendar(self, user_id):
        """Load calendar from file"""
        try:
            calendar_path = self._get_calendar_path(user_id)
            if os.path.exists(calendar_path):
                with open(calendar_path, 'r') as file:
                    return json.load(file)
            return None
        except Exception as e:
            print(f"Error loading calendar: {e}")
            return None

    def _save_calendar(self, user_id, calendar_data):
        """Save calendar to file"""
        try:
            calendar_path = self._get_calendar_path(user_id)
            with open(calendar_path, 'w') as file:
                json.dump(calendar_data, file, indent=2)
            return True
        except Exception as e:
            print(f"Error saving calendar: {e}")
            return False

    def process_calendar_query(self, query, user_id="default_user"):
        """
        Process a calendar query, load existing calendar, update it, and save changes
        
        Args:
            query (str): Natural language query about calendar modification
            user_id (str): User identifier
            
        Returns:
            dict: Updated calendar in JSON format
        """
        try:
            # Load existing calendar
            current_calendar = self._load_calendar(user_id)

            # Format current calendar context
            calendar_context = (f"Current calendar:\n{json.dumps(current_calendar, indent=2)}"
                              if current_calendar else "No existing calendar.")

            prompt = f"""
            User request: {query}

            {calendar_context}

            Based on this request and the current calendar, provide an updated complete weekly calendar in the exact JSON format specified.
            Include 'action_taken' describing what changed.
            """

            response = client.chat.completions.create(model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7)

            try:
                calendar_data = json.loads(response.choices[0].message.content)
                calendar_data['user_id'] = user_id
                calendar_data['last_updated'] = datetime.now().isoformat()

                if self._save_calendar(user_id, calendar_data):
                    return calendar_data
                else:
                    return {
                        'error': 'Failed to save calendar',
                        'calendar_data': calendar_data
                    }

            except json.JSONDecodeError as e:
                return {
                    'error': 'Failed to parse GPT response',
                    'details': str(e)
                }

        except Exception as e:
            return {
                'error': 'Failed to process calendar query',
                'details': str(e)
            }

    def get_calendar(self, user_id):
        """Get current calendar for user"""
        calendar = self._load_calendar(user_id)
        return calendar if calendar else {"message": "No calendar found", "user_id": user_id}
    
    # def clear_all_events(self, user_id):
    #     """Clear all events from calendar"""
    #     empty_calendar = {
    #         "user_id": user_id,
    #         "schedule": [
    #             {
    #                 "day": day,
    #                 "events": []
    #             } for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    #         ],
    #         "last_updated": datetime.now().isoformat(),
    #         "action_taken": "cleared all events"
    #     }
    #     self._save_calendar(user_id, empty_calendar)
    #     return empty_calendar
        

def test_calendar_gpt():
    """Test function to demonstrate usage"""
    calendar = Calendaradvisor(storage_path="calendar_storage")

    print("\nTest 1 - delete an event:")
    test1 = calendar.process_calendar_query(
        "delete yoga class Tuesday at 9 AM",
        user_id="test_user"
    )
    print(json.dumps(test1, indent=2))

if __name__ == "__main__":
    calendar = Calendaradvisor(storage_path="calendar_storage")
    calendar.process_calendar_query("set me a friday morning yoga class at 10am", user_id="michael")