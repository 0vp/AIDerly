import React, { useEffect, useState } from "react";

const Schedule = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://127.0.0.1:5000/calendar");
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
    <div className=" w-[90vw] bg-[#fbf1e5]">  
      <div className="grid grid-cols-5">
        {data.schedule && data.schedule.map((daySchedule, index) => (
          <div 
            className={ `border-2 border-[#cfb8cf] ${index === 0 ? 'rounded-tl-lg' : ''} ${index === 4 ? 'rounded-tr-lg' : ''}`} 
            key={index}
          >
            <h3 className={`p-3 text-center font-semibold font-sans bg-[#cfb8cf] text-[#603f20] ${index === 0 ? 'rounded-tl-lg' :''} ${index === 4 ? 'rounded-tr-lg': ''}`}>{daySchedule.day}</h3>
            <hr />
            {daySchedule.events.length > 0 ? (
              daySchedule.events.map((event, eventIndex) => (
                <div className="text-[#603f20] p-5 font-[24px]" key={eventIndex}>
                  <p className="font-bold text-[#603f20]">{event.title}</p>
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