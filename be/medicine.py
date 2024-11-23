# medicine.py

from openai import OpenAI
from datetime import datetime
import json
import os
from dotenv import load_dotenv
from schedule import Calendaradvisor

class MedicineAdvisor:
    def __init__(self, calendar_storage="calendar_storage"):
        # Load environment variables
        load_dotenv()
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.calendar = Calendaradvisor(storage_path=calendar_storage)

        self.SYSTEM_PROMPT = """You are a medication advisor for elderly adults. Your job is to:
    1. Analyze the medications mentioned in the query
    2. Provide clear, simple explanations about medication safety
    3. Recommend appropriate medication schedules
    4. Return a structured JSON response

    Response format:
    {
        "medications": [
            {
                "name": "medication name",
                "purpose": "brief description of what it's for",
                "timing": "when to take it"
            }
        ],
        "recommended_schedule": {
            "time": "HH:MM",
            "frequency": "daily/weekly/etc",
            "special_instructions": "e.g., take with food"
        }
    }

    Important rules:
    1. Always err on the side of caution
    2. Use simple, clear language
    3. Include specific timing recommendations
    4. Include reminders about water and food if needed"""

    def check_medications(self, query):
        """
        Analyze medication interactions and provide advice
        """
        
        prompt = f"""
        User question about medications: {query}
        Return the analysis in the specified JSON format.
        """

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        advice = json.loads(response.choices[0].message.content)
        return advice

      
    def schedule_medication(self, user_id, med_advice):
        """
        Add medication schedule to calendar
        """
        try:
            schedule = med_advice['recommended_schedule']
            medications = med_advice['medications']
            
            med_list = ", ".join([med['name'] for med in medications])
            
            time = schedule['time']
            frequency = schedule['frequency']
            instructions = schedule['special_instructions']
            
            calendar_query = f"Add medication reminder at {time} {frequency}: Take {med_list}. Note: {instructions}"
            
            calendar_result = self.calendar.process_calendar_query(
                query=calendar_query,
                user_id=user_id
            )

            return {
                'medication_advice': med_advice,
                'calendar_update': calendar_result
            }

        except Exception as e:
            return {
                'error': 'Failed to schedule medication',
                'details': str(e)
            }

def test_medicine_advisor():
    """Test function to demonstrate usage"""
    advisor = MedicineAdvisor()
    
    test_query = "I will take aspirin"
    
    print("\nTest 1 - Medication Interaction Check:")
    med_advice = advisor.check_medications(test_query)
    print(json.dumps(med_advice, indent=2))
    
    if 'error' not in med_advice:
        print("\nTest 2 - Scheduling Medications:")
        schedule_result = advisor.schedule_medication("michael", med_advice)
        print(json.dumps(schedule_result, indent=2))

if __name__ == "__main__":
    test_medicine_advisor()