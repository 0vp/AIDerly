import React, { useState, useEffect, useRef } from 'react';
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
        // SpeechRecognition.startListening({ continuous: true });
        SpeechRecognition.startListening();
    }

    const stopListening = () => {
        SpeechRecognition.stopListening();
    }

    const handlePause = () => {
        // call response on transcript, then reset transcript, then unpause
        if (transcript.includes('picture of')) {
            console.log('Taking picture... of', transcript.split('picture of')[1]);
        }
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    useEffect(() => {
        if (!listening) {
            // process commands, and or call response
            console.log('Listening stopped, processing!');
            handlePause();
            startListening();
        }
    }, [listening]);

    useEffect(() => {
        startListening();
    }, []);

    return (
        <div>
            {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
            {/* <button onClick={startListening}>Start</button>
            <button onClick={stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button> */}
            <p>{transcript}</p>
        </div>
    );
};

export default Listen;