import {useState, useEffect} from "react";
import Spline from '@splinetool/react-spline';
import NotesApp from "./components/NoteApp";
import Advice from "./components/Advice";
import SafetyTips from "./components/Tips";
// import Listen from "./utils/Listen";
// import {Speech} from "./utils/Speech";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Schedule from './components/schedule';
import Listen from "./utils/Listen";

export default function Home() {
    const [decibel, setDecibel] = useState(0);
    const [i, setI] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false); // State for animation
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup
    const [isSlideVisible1, setIsSlideVisible1] = useState(false); // State for first slide popup visibility
    const [isSlideVisible2, setIsSlideVisible2] = useState(false); // State for second slide popup visibility
    const [isSlideVisible3, setIsSlideVisible3] = useState(false); // State for third slide popup visibility
    const [list, setList] = useState({
        clothing_note: ["Wear a warm coat", "Don't forget your scarf"],
        safety_tips: ["Drive carefully on icy roads", "Stay indoors during a storm"],
        recommended_activities: ["Go for a walk", "Read a book"],
        health_advice: ["Stay hydrated", "Take your vitamins"],
        weather_summary: ["It's sunny today", "Expect rain in the evening"]
    });
    const fetchData = async () => {
        try {
            console.log('Waiting for response...');
            const response = await fetch('http://127.0.0.1:5000/weather/advice');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data);
            setList({
                clothing_note: data.advice.clothing_advice,
                safety_tips: data.advice.safety_tips,
                recommended_activities: data.advice.recommended_activities,
                health_advice: data.advice.health_advice,
                weather_summary: data.weather_summary // Correct access here
            });
            console.log('Data fetched successfully:', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const simulateKeyPress = (key) => {
        const keyDownEvent = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(keyDownEvent);

        // console.log('Key down:', key);

        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', { key });
            document.dispatchEvent(keyUpEvent);
            // console.log('Key up:', key);
        }, 1);
    };

    const handleDecibleLevel = (decibel) => {
        if (decibel >= 25) {
            simulateKeyPress('1');
            simulateKeyPress('4');
        } else{
            simulateKeyPress('1');
            simulateKeyPress('0');
        }
    };

    useEffect(() => {
        const interval = 10;
        if (i % interval === 0) {
            handleDecibleLevel(decibel);
        }
        setI(i + 1);
    }, [decibel]);
    
    // const handleButtonClick = () => {
    //     simulateKeyPress('1');
    // };

    const handleButtonClick = () => {
        setIsPopupOpen(!isPopupOpen);
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
        }, 300); // Match the animation duration
    };

    const handleSlidePopup1 = () => {
        setIsSlideVisible1(!isSlideVisible1);
    };

    const handleSlidePopup2 = () => {
        setIsSlideVisible2(!isSlideVisible2);
    };

    const handleSlidePopup3 = () => {
        setIsSlideVisible3(!isSlideVisible3);
    };

    return (
        <>

            <style>{`
                .pop-up {
                    transition: transform 0.3s ease;
                }
                .pop-up.animate {
                    animation: popUpAnimation 0.3s forwards;
                }
                @keyframes popUpAnimation {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
            <div className="w-[99vw] overflow-x-hidden h-screen bg-[#F8F8F8]">
                <Spline scene="https://prod.spline.design/SUSlutr2kTx8zUia/scene.splinecode" />
                <div className="absolute bottom-0 right-0 w-screen h-[100px] bg-[#F8F8F8]"></div>
            </div>

            {/* <Speech toSay={"hi darling"} setDecibel={setDecibel} />
            <div>
                {decibel.toFixed(2)} dB
            </div> */}
            <div className="absolute top-12 left-24">
                
                <button onClick={handleButtonClick}>
                    Show Pop-Up
                </button>


                {isPopupOpen && (
                <div className={`pop-up ${isAnimating ? "animate" : ""}`}>
                        <Schedule></Schedule>
                    </div>
                )}
                {/* <Popup className="" trigger={<button>Trigger</button>} position="bottom left">
                    <Schedule></Schedule>
                </Popup> */}

                <button
                    onClick={handleSlidePopup1}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                    Toggle Slide Pop-Up 1
                </button>
                <button
                    onClick={handleSlidePopup2}
                    className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                        >
                    Toggle Slide Pop-Up 2
                </button>
                <button
                    onClick={handleSlidePopup3}
                    className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                    Toggle Slide Pop-Up 3
                </button>
                <div
                    className={`absolute flex w-[700px] items-center justify-center transition-transform duration-500 ease-in-out ${
                            isSlideVisible1 ? "translate-x-0" : "-translate-x-[750px]"
                            }`}
                        >
                    <NotesApp clothing_note={list.clothing_note} />
                </div>

                <div
                    className={`absolute top-32 flex w-[700px] items-center justify-center transition-transform duration-500 ease-in-out ${
                            isSlideVisible2 ? "translate-x-0" : "-translate-x-[750px]"
                            }`}
                        >
                    <Advice recommended_activities={list.recommended_activities} />
                </div>

                <div
                    className={`absolute top-48 flex w-[700px] items-center justify-center transition-transform duration-500 ease-in-out ${
                            isSlideVisible3 ? "translate-x-0" : "-translate-x-[750px]"
                            }`}
                        >
                    <SafetyTips safety_tips={list.safety_tips} />
                </div>
            </div>
            <Listen />
        </>
    );
}