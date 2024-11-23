import React from "react";
import Speech from "./utils/Speech";

const App = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <Speech toSay={"hi darling"} />
        </div>
    );
};

export default App;
