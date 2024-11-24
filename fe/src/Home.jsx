import {useState, useEffect} from "react";
import Spline from '@splinetool/react-spline';
import NotesApp from "./components/NoteApp";
import Advice from "./components/Advice";
import SafetyTips from "./components/Tips";
// import Listen from "./utils/Listen";
// import {Speech} from "./utils/Speech";
import 'reactjs-popup/dist/index.css';
import Listen from "./utils/Listen";
import Camera from "./components/Camera";
import "./font.css";

function Logo() {
    return (
        <div className="flex absolute justify-center items-center">
            <img className="w-2/3" src="/logo.svg" alt="logo" />
        </div>
    );
}

export default function Home() {
    const [muted, setMuted] = useState(false);
    const [decibel, setDecibel] = useState(0);
    const [i, setI] = useState(0);
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
    const [interactive, setInteractive] = useState(false); // State for interactive mode
    // subtitles
    const [transcript, setTranscript] = useState("");
    const [subtitles, setSubtitles] = useState("");
    const handleInteractive = () => {
        setInteractive(!interactive);
    };
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
                health_advice: data.health_advice,
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

    const muteMicrophone = () => {
        setMuted(!muted);
    };

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
        if (decibel >= 20 && decibel < 25) {
            simulateKeyPress('1');
            simulateKeyPress('3');
        }else if (decibel >= 25) {
            simulateKeyPress('1');
            simulateKeyPress('4');

        }else if (decibel >= 10 && decibel < 20) {
            simulateKeyPress('1');
            simulateKeyPress('0');
        }
        else{
            simulateKeyPress('1');
            simulateKeyPress('2');
        }
    };

    useEffect(() => {
        const interval = 10;
        if (i % interval === 0) {
            handleDecibleLevel(decibel);
        }
        setI(i + 1);
    }, [decibel]);
    const closeAllPopups = () => {
        setIsSlideVisible1(false);
        setIsSlideVisible2(false);
        setIsSlideVisible3(false);
    }
    const handleButtonClick = () => {
        simulateKeyPress('1');
    };
    const handleSlidePopup1 = () => {
        setIsSlideVisible1(!isSlideVisible1);
    }

    const handleSlidePopup2 = () => {
        setIsSlideVisible2(!isSlideVisible2);
    }

    const handleSlidePopup3 = () => {
        setIsSlideVisible3(!isSlideVisible3);
    }

    // idle movement
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = ['z', 'u', 'x']
            simulateKeyPress(actions[Math.floor(Math.random() * actions.length)]);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="flex overflow-x-hidden h-screen bg-[#fbf1e5] p-5 justify-center">
                <Logo />
                <Spline 
                    className="rounded-2xl"
                    scene="https://prod.spline.design/SUSlutr2kTx8zUia/scene.splinecode" 
                />
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
                </style>

                <div className="flex absolute bottom-0 right-0 w-screen h-[100px] px-24 bg-[#fbf1e5] gap-4 items-center justify-center text-md text-[#603f20] indie-flower-regular">
                    <div className="flex items-center justify-start gap-4 w-1/2 ">
                        <div className="flex flex-col items-center gap-1">
                            <div className="rounded-full bg-[#cfb8cf] w-8 h-8 flex justify-center items-center">
                                <div className="bg-white w-4 h-4 rounded-full border-2 border-black"></div>
                            </div>
                            <p className="font-bold text-[#cfb8cf] text-sm">Darling</p>
                        </div>
                        {subtitles && (
                            <div className="bg-white text-black px-4 text-sm py-2 rounded-full border-2 border-black shadow-md overflow-hidden">
                                <div className="whitespace-nowrap text-ellipsis">{subtitles}</div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-4 w-1/2">
                        {transcript && (
                            <div className="bg-[#cfb8cf] text-white px-4 text-sm py-2 rounded-full border-2 border-white shadow-md text-right overflow-hidden">
                                <div className="whitespace-nowrap text-ellipsis">{transcript}</div>
                            </div>
                        )}
                        <div className="flex flex-col items-center gap-1">
                            <div className="rounded-full bg-[#cfb8cf] w-8 h-8 flex justify-center items-center">
                                <div className="bg-white w-4 h-4 rounded-full border-2 border-black"></div>
                            </div>
                            <p className="font-bold text-[#cfb8cf] text-sm">You</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Speech toSay={"hi darling"} setDecibel={setDecibel} />
            <div>
                {decibel.toFixed(2)} dB
            </div> */}
            <div className="absolute top-12 left-24">

                {/* <button
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
                </button> */}
                <div
                    className={`absolute flex w-[700px] items-center justify-center transition-transform duration-500 ease-in-out ${
                            isSlideVisible1 ? "translate-x-0" : "-translate-x-[850px]"
                            }`}
                        >
                    <NotesApp clothing_note={list.clothing_note} />
                </div>

                <div
                    className={`absolute top-32 flex w-[700px] items-center justify-center transition-transform duration-500 ease-in-out ${
                            isSlideVisible2 ? "translate-x-0" : "-translate-x-[850px]"
                            }`}
                        >
                    <Advice recommended_activities={list.recommended_activities} />
                </div>

                <div
                    className={`absolute top-48 flex w-[700px] items-center justify-center transition-transform duration-500 ease-in-out ${
                            isSlideVisible3 ? "translate-x-0" : "-translate-x-[850px]"
                            }`}
                        >
                    <SafetyTips safety_tips={list.safety_tips} />
                </div>
            </div>

            <Listen setDecibel={setDecibel} setTranscript={setTranscript} setSubtitles={setSubtitles} handleSlidePopup1={handleSlidePopup1} handleSlidePopup2={handleSlidePopup2} handleSlidePopup3={handleSlidePopup3 } closeAllPopups={closeAllPopups} muted={muted} />
            <button
                onClick={handleInteractive}
                style={{ backgroundColor: interactive ? '#add8e6' : '#cfb8cf' }}
                className="text-white hover:opacity-80 rounded-2xl  indie-flower-regular p-2 absolute right-6 bottom-24 mb-2"
            >
                Interactive
            </button>
            <button
                onClick={muteMicrophone}
                style={{ backgroundColor: muted ? '#add8e6' : '#cfb8cf' }}
                className="text-white hover:opacity-80 rounded-2xl  indie-flower-regular p-2 absolute left-6 bottom-24 mb-2"
            >
                {muted ? 'Unmute' : 'Mute'}
            </button>
            {interactive && <div className='w-1/4 h-fit absolute top-9 right-5'>
                <Camera />
            </div>
            }
        </>
    );
}