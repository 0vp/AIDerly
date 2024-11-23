import React, { useState, useEffect, useRef } from 'react';
import "regenerator-runtime/runtime.js";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getImageUrl } from '../components/ImagePopup';
import * as Actions from './Actions';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getReply } from './Response';
import { useSpeech } from './Speech';

const Listen = () => {
    const [speaking, setSpeaking] = useState(false);
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
        if (transcript.length >= 5) {


            if (transcript.includes('picture of')) {
                let img = transcript.split('picture of')[1];
                Actions.handleImage();
                console.log('Taking picture... of', img);
                let imageUrl = await getImageUrl(img);
                console.log('Image URL:', imageUrl['image']);
                setImageUrl(imageUrl['image']);
            } else if (transcript.includes('image')){
                let img = transcript.split('picture of')[1];
                Actions.handleImage();
                console.log('Showing Image...', img);
                let imageUrl = await getImageUrl(img);
                console.log('Image URL:', imageUrl['image']);
                setImageUrl(imageUrl['image']);
            }else if (transcript.includes("calendar")){
                Actions.handleCalendar
                reply = "Here is your calendar";
            } else if (transcript.includes("medicine")) {
                Actions.handleMedicine();
                reply = "Here is your medicine information";
            } else if (transcript.includes("news")) {
                Actions.handleNews();
                reply = "Here are the latest news updates";
            } else if (transcript.includes("flip")) {
                Actions.handleFlip();
                reply = "HAYAAAA!";
            }
            else if (transcript.includes('close')) {
                Actions.handleImage();
                console.log('Closing popup...');
                setPopupOpen(false);
            }else if (transcript.includes('weather')) {
                reply = await getReply({transcript});
                if (reply.includes('rainy')) {
                    Actions.handleRainy();
                    reply = "It is raining outside";
                } else if (reply.includes('sunny')) {
                    Actions.handleSunny();
                    reply = "It is sunny outside";
                } else if (reply.includes('cloudy')) {
                    Actions.handleCloudy();
                    reply = "It is cloudy outside";
                } else if (reply.includes('snowy')) {
                    Actions.handleSnowy();
                    reply = "It is snowing outside";
                } else if (reply.includes('windy')) {
                    Actions.handleWindy();
                    reply = "It is windy outside";
                }
            }
             else {
                reply = await getReply(transcript);
            }
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