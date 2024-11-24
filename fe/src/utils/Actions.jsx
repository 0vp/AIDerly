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
export const handleCalendar = (isCalendarOpen) => {
    return !isCalendarOpen;
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

export const handleWink = () => {
    simulateKeyPress('w');
};

export const handleBounce = () => {
    simulateKeyPress('b');
};

export const handleImage = () => {
    simulateKeyPress('p');
};

export const handleFlip = () => {
    simulateKeyPress('f');
};

export const handleDance = () => {
    simulateKeyPress('d');
};

export const handleSpin = () => {
    simulateKeyPress('s');
};
export const handleMedicine = () => {
};

export const handleNews = () => {
};

