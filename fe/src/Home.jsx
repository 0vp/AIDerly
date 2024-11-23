import Spline from '@splinetool/react-spline';
import Speech from "./utils/Speech";
import Schedule from './components/Schedule';
import {useState, useEffect} from "react";
export default function Home() {
    const [decibel, setDecibel] = useState(0);

    const simulateKeyPress = (key) => {
        const keyDownEvent = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(keyDownEvent);

        console.log('Key down:', key);

        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', { key });
            document.dispatchEvent(keyUpEvent);
            console.log('Key up:', key);
        }, 1);
    };

    const handleDecibleLevel = (decibel) => {
        if (decibel >= 25) {
            simulateKeyPress('1');
            simulateKeyPress('4');
        }
        else{
            simulateKeyPress('1');
            simulateKeyPress('0');
        }
    };

    useEffect(() => {
        handleDecibleLevel(decibel);
    }, [decibel]);
    
    const handleButtonClick = () => {
        simulateKeyPress('1');
    };

    return (
        <>
            <Spline scene="https://prod.spline.design/DvEjptebRZFHNICp/scene.splinecode" />
            <Speech toSay={"hi darling"} setDecibel={setDecibel} />
            <div>
                {decibel.toFixed(2)} dB
            </div>
            <Schedule/>
        </>
    );
}