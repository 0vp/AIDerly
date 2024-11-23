import React, { useState } from "react";
import Speech from "./utils/Speech";

const App = () => {
    const [decibel, setDecibel] = useState(0);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <Speech toSay={"hi darling"} setDecibel={setDecibel} />
            <div>
                {decibel.toFixed(2)} dB
            </div>
        </div>
    );
};

export default App;
