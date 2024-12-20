import React from "react";

const NotesApp = ({ clothing_note }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-t from-[#cfb8cf]/80 via-[#cfb8cf]/80 to-[#cfb8cf]/90 -2 rounded-2xl p-6">
      <div className="relative bg-white/70 p-6 rounded-lg shadow-xl w-[90%] max-w-4xl opacity-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">CLOTHING NOTES</h1>
          <p className="text-gray-500">{clothing_note.length} ITEMS</p>
        </div>

        {/* Clothing Notes */}
        <div className="relative flex flex-wrap justify-center gap-x-8 gap-y-4">
          {clothing_note.map((item, index) => (
            <div
              key={index}
              className={`relative bg-white p-4 w-48 h-32 rounded-lg shadow-lg text-gray-800 text-center transform ${
                index % 2 === 0 ? "-rotate-2" : "rotate-2"
              }`}
            >
              {/* Pin Icon */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 rounded-full shadow-inner"></div>

              {/* Note Content */}
              <div className="flex flex-col h-full justify-between">
                <p className="text-lg font-semibold">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;