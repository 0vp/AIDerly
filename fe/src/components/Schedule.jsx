import React, { useEffect, useState } from "react";
import "../font.css";
const Schedule = () => {
  const [data, setData] = useState({
    schedule: [
      {
        day: "Monday",
        events: [
          {
            time: "09:00",
            title: "Morning Walk",
            duration: 30,
            type: "exercise",
            notes: "Remember to wear comfortable shoes"
          }
        ]
      },
      {
        day: "Tuesday",
        events: [
          {
            time: "10:00",
            title: "Doctor Appointment",
            duration: 60,
            type: "medical",
            notes: "Bring medical records"
          }
        ]
      },
      {
        day: "Wednesday",
        events: []
      },
      {
        day: "Thursday",
        events: [
          {
            time: "12:00",
            title: "Lunch with Sarah",
            duration: 90,
            type: "social",
            notes: "At the new cafe"
          }
        ]
      },
      {
        day: "Friday",
        events: [
          {
            time: "15:00",
            title: "Art Class",
            duration: 120,
            type: "hobby",
            notes: "Bring painting supplies"
          }
        ]
      },
      {
        day: "Saturday",
        events: [
          {
            time: "15:00",
            title: "Art Class",
            duration: 120,
            type: "hobby",
            notes: "Bring painting supplies"
          }
        ]
      },
      {
        day: "Sunday",
        events: []
      }
    ]
  });

  return (
    <div className="w-[90vw] p-4 bg-[#fbf1e5]/80 rounded-3xl text-[#564a1f]">  
      <div className="grid grid-cols-7 rounded-t-3xl">
        {data.schedule && data.schedule.map((daySchedule, index) => (
          <div 
            className={`border-2 border-[#cfb8cf] ${index === 0 ? 'rounded-tl-3xl rounded-bl-3xl' : ''} ${index === 6 ? 'rounded-tr-3xl rounded-br-3xl' : ''}`} 
            key={index}
          >
            <h3 className={`p-3 text-center font-semibold indie-flower-regular bg-[#cfb8cf] ${index === 0 ? 'rounded-tl-3xl' :''} ${index === 6 ? 'rounded-tr-3xl': ''}`}>{daySchedule.day}</h3>
            <hr />
            {daySchedule.events.length > 0 ? (
              daySchedule.events.map((event, eventIndex) => (
                <div className="p-5 font-[24px] indie-flower-regular h-[400px]" key={eventIndex}>
                  <div className="flex flex-col text-left gap-2 bg-white/30 border-[#564a1f] rounded-2xl p-2 ">
                  <p className="font-bold bg-white/30 px-2 py-1 border-[#564a1f] rounded-2xl text-center">{event.title}</p>
                  <p className="pl-4 font-medium opacity-[80%]">{event.type}</p>
                  <p className="pl-4">{event.notes}</p>
                  <p className="pl-4 font-medium opacity-[80%]">{event.time} - {new Date(new Date(`1970-01-01T${event.time}:00`).getTime() + event.duration * 60000).toTimeString().slice(0, 5)}</p>         
                  </div>
                </div>
              ))
            ) : (
              <div className="opacity-[60%] indie-flower-regular p-5">
                <p>No events scheduled</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;