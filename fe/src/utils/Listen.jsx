import React, { useState, useEffect, useRef } from 'react';
import "regenerator-runtime/runtime.js";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getImageUrl } from '../components/ImagePopup';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getReply } from './Response';
import { useSpeech } from './Speech';

const Listen = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);
    const { speak, decibel, loading, error } = useSpeech();

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

    const handlePause = async () => {
        // call response on transcript, then reset transcript, then unpause
        let reply = "";
        if (transcript.includes('picture of')) {
            let img = transcript.split('picture of')[1];
            console.log('Taking picture... of', img);
            let imageUrl = await getImageUrl(img);
            console.log('Image URL:', imageUrl['image']);
            setImageUrl(imageUrl['image']);
        } else if (transcript.includes('close')) {
            console.log('Closing popup...');
            setPopupOpen(false);
        } else {
            reply = getReply(transcript);
        }

        if (transcript.length >= 5) {
            speak(reply);
            console.log({transcript, reply});
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
        console.log('Transcript:', transcript);
        if (imageUrl) {
            console.log('Image URL:', imageUrl);
            setPopupOpen(true);
        }
        console.log('Popup Open:', popupOpen);
    }, [imageUrl]);

    useEffect(() => {
        startListening();
    }, []);

    return (
        <div className='w-full h-screen'>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            {/* <button onClick={startListening}>Start</button>
            <button onClick={stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button> */}
            <p>{transcript}</p>
            <Popup open={popupOpen} onClose={() => {setImageUrl('')}} position="right center">
                <div>
                    <img src={imageUrl} alt="Generated" />
                </div>
            </Popup>
        </div>
    );
};

export default Listen;