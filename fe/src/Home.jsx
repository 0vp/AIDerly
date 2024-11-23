import {useState, useEffect} from "react";
import Spline from '@splinetool/react-spline';
// import Listen from "./utils/Listen";
import Speech from "./utils/Speech";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Schedule from './components/schedule';
import Listen from "./utils/Listen";
export default function Home() {
    const [decibel, setDecibel] = useState(0);
    const [i, setI] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false); // State for animation
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup

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
            <Spline scene="https://prod.spline.design/DvEjptebRZFHNICp/scene.splinecode" />
            <Speech toSay={"hi darling"} setDecibel={setDecibel} />
            <div>
                {decibel.toFixed(2)} dB
            </div>
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
            </div>
            <Listen />
        </>
    );
}