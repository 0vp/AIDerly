from flask import Blueprint, jsonify
from datetime import datetime, timedelta
import random

def create_test_schedule_blueprint(schedules):
    test_schedule_bp = Blueprint('test_schedule', __name__)
    
    @test_schedule_bp.route('/schedule/test/create', methods=['GET'])
    def test_create_schedule():
        """Test endpoint to create a sample schedule"""
        try:
            # Sample user ID for testing
            test_user_id = "test_user_123"
            
            # Sample activities suitable for elderly people
            activities = [
                ("Morning Walk", "30 minutes"),
                ("Breakfast", "45 minutes"),
                ("Reading", "1 hour"),
                ("Light Exercise", "30 minutes"),
                ("Lunch", "1 hour"),
                ("Garden Time", "45 minutes"),
                ("Social Activity", "1 hour"),
                ("Dinner", "45 minutes"),
                ("Evening Relaxation", "1 hour")
            ]
            
            # Create a week's worth of events
            events = []
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            
            for day in days:
                # Add 2-3 activities per day
                num_activities = random.randint(2, 3)
                day_activities = random.sample(activities, num_activities)
                
                current_hour = 9  # Start at 9 AM
                
                for activity, duration in day_activities:
                    time = f"{current_hour:02d}:00"
                    events.append({
                        "day": day,
                        "time": time,
                        "activity": activity,
                        "duration": duration
                    })
                    current_hour += 3  # Space activities 3 hours apart
            
            # Store in database
            week_start = datetime.now() - timedelta(days=datetime.now().weekday())
            schedule_data = {
                "user_id": test_user_id,
                "week_start": week_start,
                "events": events,
                "last_updated": datetime.now()
            }
            
            # Update or create schedule
            schedules.update_one(
                {"user_id": test_user_id},
                {"$set": schedule_data},
                upsert=True
            )
            
            return jsonify({
                "message": "Test schedule created successfully",
                "user_id": test_user_id,
                "schedule": events
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @test_schedule_bp.route('/schedule/test/all', methods=['GET'])
    def test_get_all_schedules():
        """Test endpoint to retrieve all schedules"""
        try:
            all_schedules = list(schedules.find())
            
            # Convert MongoDB objects to JSON-serializable format
            for schedule in all_schedules:
                schedule['_id'] = str(schedule['_id'])
                schedule['week_start'] = schedule['week_start'].isoformat()
                schedule['last_updated'] = schedule['last_updated'].isoformat()
            
            return jsonify({
                "message": "Retrieved all schedules",
                "schedules": all_schedules
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @test_schedule_bp.route('/schedule/test/status', methods=['GET'])
    def test_status():
        """Test endpoint to check if the schedule service is working"""
        try:
            schedule_count = schedules.count_documents({})
            return jsonify({
                "status": "online",
                "database_connected": True,
                "total_schedules": schedule_count,
                "test_endpoints": {
                    "create_test_schedule": "/schedule/test/create",
                    "get_all_schedules": "/schedule/test/all",
                    "status": "/schedule/test/status"
                }
            })
        except Exception as e:
            return jsonify({
                "status": "error",
                "database_connected": False,
                "error": str(e)
            }), 500
    
    return test_schedule_bp