import { useState, useRef } from "react";
import { sharedLock } from "./SpeechLock";

export const useSpeech = () => {
    const [decibel, setDecibel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const audioRef = useRef(null);
    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);

    const setupAudioAnalysis = (audio) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        analyser.fftSize = 256;

        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyzeDecibels(analyser);
    };

    const analyzeDecibels = (analyser) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const calculateVolume = () => {
            analyser.getByteFrequencyData(dataArray);

            const sum = dataArray.reduce((a, b) => a + b, 0);
            const average = sum / dataArray.length;
            const db = 20 * Math.log10(average || 1);
            setDecibel(Math.max(db, 0));

            requestAnimationFrame(calculateVolume);
        };

        calculateVolume();
    };

    const speak = async (text, voiceId = "cgSgspJ2msm6clMCkdW9", stability = 0.5, similarityBoost = 0) => {
        if (loading) return;

        setLoading(true);
        setError("");

        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`;
        const headers = {
            "Content-Type": "application/json",
            "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY,
        };

        const body = JSON.stringify({
            text,
            model: "eleven_turbo_v2_5",
            voice_settings: {
                stability: stability,
                similarity_boost: similarityBoost,
            },
        });

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body,
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audio = new Audio(URL.createObjectURL(audioBlob));
                audioRef.current = audio;

                setupAudioAnalysis(audio);
                audio.play();
                audio.onended = () => {
                    setLoading(false);
                };
            } else {
                const errorText = await response.text();
                setError(`Error: Unable to stream audio. Details: ${errorText}`);
                console.error("Error Response:", errorText);
            }
        } catch (err) {
            setError("Error: Unable to stream audio.");
            console.error(err);
        }
    };

    return { speak, decibel, loading, error };
};