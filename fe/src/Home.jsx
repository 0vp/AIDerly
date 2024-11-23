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
            <div className="w-[99vw] overflow-x-hidden h-screen bg-[#F8F8F8]">
                <Spline scene="https://prod.spline.design/SUSlutr2kTx8zUia/scene.splinecode" />
                <div className="absolute bottom-0 right-0 w-screen h-[100px] bg-[#F8F8F8]"></div>
            </div>

            <Speech toSay={"hi darling"} setDecibel={setDecibel} />
            <div>
                {decibel.toFixed(2)} dB
            </div>
            <div className="absolute top-12 left-24">
                <Popup className="" trigger={<button>Trigger</button>} position="bottom left">
                    <Schedule></Schedule>
                </Popup>
            </div>
            <Listen />
        </>
    );
}