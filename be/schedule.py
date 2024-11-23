from flask import Blueprint, request, jsonify
import openai
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Create Blueprint
schedule_bp = Blueprint('schedule', __name__)

openai.api_key = os.getenv("OPENAI_API_KEY")
client = MongoClient(os.getenv("MONGODB_URI"))
db = client.scheduler_db
schedules = db.schedules

def format_current_schedule(schedule):
    if not schedule or not schedule.get('events'):
        return "No current schedule exists."
    
    formatted = "Current Schedule:\n"
    for event in schedule['events']:
        formatted += f"{event['day']} at {event['time']}: {event['activity']} ({event['duration']})\n"
    return formatted

def parse_gpt_response(response):
    try:
        events = []
        for line in response.strip().split('\n'):
            if line and 'at' in line and ':' in line:
                day_part, rest = line.split(" at ")
                time_part, activity_part = rest.split(": ")
                activity, duration = activity_part.rsplit(" (", 1)
                duration = duration.rstrip(")")
                
                events.append({
                    "day": day_part.strip(),
                    "time": time_part.strip(),
                    "activity": activity.strip(),
                    "duration": duration.strip()
                })
        return events
    except Exception as e:
        return None

def generate_schedule_with_gpt(current_schedule, query):
    try:
        prompt = f"""
        You are a scheduling assistant for elderly people. Please update or create a weekly schedule based on the following:

        {current_schedule}

        User's request: {query}

        Please provide the updated schedule in the following format for each event:
        DAY at TIME: ACTIVITY (DURATION)

        Rules:
        1. Use 24-hour time format (e.g., 14:00)
        2. Keep existing events unless they conflict with new requests
        3. Specify duration for each activity
        4. If events conflict, prioritize the new request
        5. Keep the schedule realistic and allow for travel time
        6. Make sure activities are suitable for elderly people
        """

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a precise scheduling assistant for elderly care."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message['content']
        
    except Exception as e:
        return None

@schedule_bp.route('/schedule/update', methods=['POST'])
def update_schedule():
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data or 'query' not in data:
            return jsonify({'error': 'Missing user_id or query'}), 400
        
        current_schedule = schedules.find_one({"user_id": data['user_id']})
        current_schedule_text = format_current_schedule(current_schedule) if current_schedule else "No existing schedule."
        
        gpt_response = generate_schedule_with_gpt(current_schedule_text, data['query'])
        if not gpt_response:
            return jsonify({'error': 'Failed to generate schedule'}), 500
            
        new_events = parse_gpt_response(gpt_response)
        if not new_events:
            return jsonify({'error': 'Failed to parse schedule'}), 500
        
        week_start = datetime.now() - timedelta(days=datetime.now().weekday())
        update_data = {
            "user_id": data['user_id'],
            "week_start": week_start,
            "events": new_events,
            "last_updated": datetime.now()
        }
        
        schedules.update_one(
            {"user_id": data['user_id']},
            {"$set": update_data},
            upsert=True
        )
        
        return jsonify({
            "message": "Schedule updated successfully",
            "schedule": new_events
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@schedule_bp.route('/schedule/<user_id>', methods=['GET'])
def get_schedule(user_id):
    """Get current schedule for a user"""
    try:
        schedule = schedules.find_one({"user_id": user_id})
        if not schedule:
            return jsonify({'error': 'No schedule found for this user'}), 404
        
        # Convert MongoDB ObjectId and dates to strings for JSON serialization
        schedule['_id'] = str(schedule['_id'])
        schedule['week_start'] = schedule['week_start'].isoformat()
        schedule['last_updated'] = schedule['last_updated'].isoformat()
        
        return jsonify(schedule)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@schedule_bp.route('/schedule/<user_id>', methods=['DELETE'])
def clear_schedule(user_id):
    """Clear a user's schedule"""
    try:
        result = schedules.delete_one({"user_id": user_id})
        if result.deleted_count == 0:
            return jsonify({'error': 'No schedule found for this user'}), 404
        
        return jsonify({"message": "Schedule cleared successfully"})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500