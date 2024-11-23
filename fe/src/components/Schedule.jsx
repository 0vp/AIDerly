import React, { useEffect, useState } from "react";

const Schedule = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/calendar");
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

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