import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Voice from "./Voice";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/voice" element={<Voice />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
