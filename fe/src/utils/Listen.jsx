import React, { useState, useEffect, useRef } from 'react';
import "regenerator-runtime/runtime.js";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getImageUrl } from '../components/ImagePopup';
import * as Actions from './Actions';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getReply } from './Response';
import { useSpeech } from './Speech';
import Schedule from '../components/schedule';

const Listen = ({ setDecibel, setTranscript, setSubtitles, handleSlidePopup1, handleSlidePopup2, handleSlidePopup3, closeAllPopups, muted }) => {
    const [speaking, setSpeaking] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [openCalendar, setOpenCalendar] = useState(false);
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
        if (loading || muted) return;

        let reply = "";
        if (transcript.length >= 5) {
            if (transcript.includes('picture of') || transcript.includes('image of')) {
                let img = transcript.split('picture of')[1] ? transcript.split('picture of')[1] : transcript.split('image of')[1];
                Actions.handleImage();
                let imageUrl = await getImageUrl(img);
                setImageUrl(imageUrl['image']);
                reply = "Here is the image you requested";
            }else if (transcript.includes("calendar")){
                setOpenCalendar(!openCalendar);
                Actions.handleCalendar();
                reply = "Here is your calendar";

            } else if (transcript.includes('close')){
                closeAllPopups();
                setOpenCalendar(false);
                if (popupOpen) {
                    Actions.handleImage();
                    console.log('Closing popup...');
                    setPopupOpen(false);
                    setImageUrl('');
                }
                if(openCalendar){
                    Actions.handleCalendar();
                    setOpenCalendar(false);
                }
            } else if (transcript.includes('bounce')){
                Actions.handleBounce();
                reply = "BOUNCING BOING!";
            }else if (transcript.includes("medicine")) {
                setMedicine(!medicine);
                Actions.handleMedicine();
                reply = "Here is your medicine information";
            }else if (transcript.includes("safety tip")) {
                handleSlidePopup3();
                reply = "Here are the safety tips";

            }else if (transcript.includes("clothing")) {
                handleSlidePopup1();
                reply = "Here is the clothing note";

            }else if (transcript.includes("activities")) {
                handleSlidePopup2();
                reply = "Here are the recommended activities";

            } else if (transcript.includes("news")) {
                Actions.handleNews();
                reply = "Here are the latest news updates";
            } else if (transcript.includes("flip")) {
                Actions.handleFlip();
                reply = "HAYAAAA!";
            } else if (transcript.includes("dance")) {
                Actions.handleDance();
                reply = "WOOHOO DANCE PARTY!";
            } else if (transcript.includes("spin")) {
                Actions.handleSpin();
                reply = "SPINNING AROUND AND AROUUUDADADADADAAAAAAA I'M GETTING DIZZY!";
            }
            else if (transcript.includes('close')) {
                // pass
            }else if (transcript.includes('weather')) {
                reply = await getReply(transcript);
                console.log(reply);
                if (reply.includes('rainy')) {
                    Actions.handleRainy();
                } else if (reply.includes('sunny')) {
                    Actions.handleSunny();
                } else if (reply.includes('cloudy')) {
                    console.log("brrr");
                    Actions.handleCloudy();
                } else if (reply.includes('snowy')) {
                    Actions.handleSnowy();
                } else if (reply.includes('wind')) {
                    Actions.handleWindy();
                }
            }
             else {
                reply = await getReply(transcript);
            }
            
            setSubtitles(reply);
            speak(reply, setSubtitles);
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
        setDecibel(decibel);
    }, [decibel]);

    useEffect(() => {
        if (loading || muted) return;

        setTranscript(transcript);
    }, [transcript]);

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
        <div>
            {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
            {/* <button onClick={startListening}>Start</button>
            <button onClick={stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button> */}
            {/* <p>{transcript}</p> */}
            <Popup open={popupOpen} onClose={() => {setImageUrl('')}} position="right center">
                <div className='flex w-full items-center justify-center'>
                    <img className='w-full' src={imageUrl} alt="Generated" />
                </div>
            </Popup>
            <Popup open={openCalendar} position="right center" contentStyle={{ background: 'transparent', border: 'none' }}>
                <Schedule></Schedule>
            </Popup>
        </div>
    );
};

export default Listen;