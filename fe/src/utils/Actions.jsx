import React, { useContext } from 'react';
import { PopupContext } from '../PopupContext';

const Actions = () => {
    const { isPopupOpen, setIsPopupOpen } = useContext(PopupContext);

    const handleCalendar = () => {
        setIsPopupOpen(isPopupOpen);
        console.log("hi")
    };

    const handleSunny = () => {
        return "=";
    };

    const handleRainy = () => {
        return "]";
    };

    const handleSnowy = () => {
        return "-";
    };

    const handleCloudy = () => {
        return "[";
    };

    const handleWindy = () => {
        return "/";
    };

    const handleMedicine = () => {
    };

    const handleNews = () => {
    };

    return (
        <div>
            <button onClick={handleCalendar}>Toggle Calendar Popup</button>
        </div>
    );
};

export default Actions;