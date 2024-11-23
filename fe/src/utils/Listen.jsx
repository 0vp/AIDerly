import React from 'react';
import "regenerator-runtime/runtime.js";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Listen = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true });
    }

    const stopListening = () => {
        SpeechRecognition.stopListening();
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={startListening}>Start</button>
            <button onClick={stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
    );
};

export default Listen;