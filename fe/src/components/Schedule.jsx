import React from "react";

const Schedule = () => {
    const data = 
      {
            "user_id": "test_user",
            "schedule": [
              {
                "day": "Monday",
                "events": [
                  {
                    "time": "08:00",
                    "title": "Morning Walk",
                    "duration": "30",
                    "type": "exercise",
                    "notes": "Remember to wear comfortable shoes"
                  }
                ]
              },
              {
                "day": "Tuesday",
                "events": []
              },
              {
                "day": "Wednesday",
                "events": [
                  {
                    "time": "08:00",
                    "title": "Morning Walk",
                    "duration": "30",
                    "type": "exercise",
                    "notes": "Remember to wear comfortable shoes"
                  }
                ]
              },
              {
                "day": "Thursday",
                "events": []
              },
              {
                "day": "Friday",
                "events": [
                  {
                    "time": "10:00",
                    "title": "Yoga Class",
                    "duration": "60",
                    "type": "exercise",
                    "notes": "Remember to bring your yoga mat and water bottle"
                  },
                  {
                    "time": "14:00",
                    "title": "Book Club",
                    "duration": "60",
                    "type": "social",
                    "notes": "Check the book of the week"
                  }
                ]
              },
              {
                "day": "Saturday",
                "events": []
              },
              {
                "day": "Sunday",
                "events": []
              },
              {
                "day": "Monday",
                "events": [
                  {
                    "time": "08:00",
                    "title": "Morning Walk",
                    "duration": "30",
                    "type": "exercise",
                    "notes": "Remember to wear comfortable shoes"
                  }
                ]
              }
            ],
            "last_updated": "2024-11-22T23:14:43.163465",
            "action_taken": "deleted yoga class at 09:00 on Tuesday"
          }

    return (
        <div className="">  
            <div className="grid grid-cols-5">
                
                {data.schedule.map((daySchedule, index) => (
                    <div 
                        className={ `border-2 ${index === 0 ? 'rounded-tl-lg' : ''} ${index === 4 ? 'rounded-tr-lg' : ''}`} 
                        key={index}
                    >
                        <h3 className={`p-3 text-center font-semibold font-sans bg-blue-500 text-white ${index === 0 ? 'rounded-tl-lg' :''} ${index === 4 ? 'rounded-tr-lg': ''}`}>{daySchedule.day}</h3>
                        <hr />
                        {daySchedule.events.length > 0 ? (
                            daySchedule.events.map((event, eventIndex) => (
                                <div className="text-[#2b2b2b] p-5 font-[24px]" key={eventIndex}>
                                    <p className="font-bold">{event.title}</p>
                                    <p className="font-medium opacity-[80%]">{event.type}</p>
                                    <p>{event.notes}</p>
                                    <p className="font-medium opacity-[80%]">{event.time} - {new Date(new Date(`1970-01-01T${event.time}:00`).getTime() + event.duration * 60000).toTimeString().slice(0, 5)}</p>         

                                </div>
                            ))
                        ) : (
                            <div className="opacity-[60%] p-5">
                                <p></p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Schedule;