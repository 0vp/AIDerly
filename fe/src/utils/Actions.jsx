import React, { useContext } from 'react';
import { PopupContext } from '../PopupContext';

export const handleCalendar = () => {
    setIsPopupOpen(isPopupOpen);
    console.log("hi");
};

export const handleSunny = () => {
    simulateKeyPress('=');
    setInterval(() => {
        simulateKeyPress('=');
    }, 5000);
};

export const handleRainy = () => {
    simulateKeyPress(']');
    setInterval(() => {
        simulateKeyPress(']');
    }, 3000);
};

export const handleSnowy = () => {
    simulateKeyPress('-');
    setInterval(() => {
        simulateKeyPress('-');
    }, 3000);
};

export const handleCloudy = () => {
    simulateKeyPress('[');
    setInterval(() => {
        simulateKeyPress('[');
    }, 3000);
};

export const handleWindy = () => {
    simulateKeyPress('/');
    setInterval(() => {
        simulateKeyPress('/');
    }, 3000);
};

export const handleImagae = () => {
    simulateKeyPress('p');
    setInterval(() => {
        simulateKeyPress('p');
    }, 3000);
};
export const handleMedicine = () => {
};

export const handleNews = () => {
};


const Actions = () => {
    const { isPopupOpen, setIsPopupOpen } = useContext(PopupContext);

    

    return (
        <div>
            <button onClick={handleCalendar}>Toggle Calendar Popup</button>
        </div>
    );
};

export default Actions;