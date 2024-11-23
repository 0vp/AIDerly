import Spline from '@splinetool/react-spline';
import './App.css';

function App() {
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

    const handleButtonClick = () => {
        simulateKeyPress('9');
    };

    return (
        <>
            <button onClick={handleButtonClick}>Press 9</button>
            <Spline scene="https://prod.spline.design/DvEjptebRZFHNICp/scene.splinecode" />
        </>
    );
}

export default App;
