import React, { useEffect, useState } from "react";

const Schedule = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/test/calendar");
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   setData(
  //     {
  // "user_id": "test_user",
  // "schedule": [
  //   {
  //     "day": "Monday",
  //     "events": [
  //       {
  //         "time": "08:00",
  //         "title": "Morning Medication - Aspirin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Warfarin."
  //       },
  //       {
  //         "time": "22:00",
  //         "title": "Evening Medication - Warfarin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Aspirin."
  //       }
  //     ]
  //   },
  //   {
  //     "day": "Tuesday",
  //     "events": [
  //       {
  //         "time": "08:00",
  //         "title": "Morning Medication - Aspirin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Warfarin."
  //       },
  //       {
  //         "time": "22:00",
  //         "title": "Evening Medication - Warfarin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Aspirin."
  //       }
  //     ]
  //   },
  //   {
  //     "day": "Wednesday",
  //     "events": [
  //       {
  //         "time": "08:00",
  //         "title": "Morning Medication - Aspirin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Warfarin."
  //       },
  //       {
  //         "time": "22:00",
  //         "title": "Evening Medication - Warfarin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Aspirin."
  //       }
  //     ]
  //   },
  //   {
  //     "day": "Thursday",
  //     "events": [
  //       {
  //         "time": "08:00",
  //         "title": "Morning Medication - Aspirin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Warfarin."
  //       },
  //       {
  //         "time": "22:00",
  //         "title": "Evening Medication - Warfarin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Aspirin."
  //       }
  //     ]
  //   },
  //   {
  //     "day": "Friday",
  //     "events": [
  //       {
  //         "time": "08:00",
  //         "title": "Morning Medication - Aspirin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Warfarin."
  //       },
  //       {
  //         "time": "22:00",
  //         "title": "Evening Medication - Warfarin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Aspirin."
  //       }
  //     ]
  //   },
  //   {
  //     "day": "Saturday",
  //     "events": [
  //       {
  //         "time": "08:00",
  //         "title": "Morning Medication - Aspirin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Warfarin."
  //       },
  //       {
  //         "time": "22:00",
  //         "title": "Evening Medication - Warfarin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Aspirin."
  //       }
  //     ]
  //   },
  //   {
  //     "day": "Sunday",
  //     "events": [
  //       {
  //         "time": "08:00",
  //         "title": "Morning Medication - Aspirin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Warfarin."
  //       },
  //       {
  //         "time": "22:00",
  //         "title": "Evening Medication - Warfarin",
  //         "duration": "5",
  //         "type": "medical",
  //         "notes": "Take with a full glass of water. Do not take with Aspirin."
  //       }
  //     ]
  //   }
  // ],
  // "last_updated": "2024-11-23T11:56:14.400765",
  // "action_taken": "scheduled yoga class every Tuesday at 09:00"
  //   }
  //   );
  // }, []);
  
  return (
    <div className=" w-[90vw] bg-white">  
      <div className="grid grid-cols-5">
        {data.schedule && data.schedule.map((daySchedule, index) => (
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