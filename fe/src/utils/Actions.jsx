export const handleCalendar = () => {
    setIsPopupOpen(isPopupOpen);
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

export const handleImage = () => {
    simulateKeyPress('p');
};
export const handleMedicine = () => {
};

export const handleNews = () => {
};

