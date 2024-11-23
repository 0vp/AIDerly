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

    return (
        <>
            <Spline scene="https://prod.spline.design/DvEjptebRZFHNICp/scene.splinecode" />
            <Speech toSay={"hi darling"} setDecibel={setDecibel} />
            <div>
                {decibel.toFixed(2)} dB
            </div>
            <div className="absolute top-50">
                <Popup className="" trigger={<button>Trigger</button>} position="top bottom">
                    <Schedule></Schedule>
                </Popup>
            </div>
            <Listen />
        </>
    );
}