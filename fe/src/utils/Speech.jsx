import React, { useState } from "react";

function Speech({ toSay, voiceId = "iP95p4xoKVk53GoZ742B", stability = 0, similarityBoost = 0 }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [text, setText] = useState(toSay);

    const startStreaming = async () => {
        setLoading(true);
        setError("");

        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_22050_32`;
        const headers = {
            "Content-Type": "application/json",
            "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY,
        };

        const body = JSON.stringify({
            text,
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
                audio.play();
            } else {
                const errorText = await response.text();
                setError(`Error: Unable to stream audio. Details: ${errorText}`);
                console.error("Error Response:", errorText);
            }
        } catch (err) {
            setError("Error: Unable to stream audio.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-lg font-semibold text-gray-800 mb-4">ElevenLabs Speech Streaming</h1>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                placeholder="Enter text to synthesize..."
                rows={3}
            />

            <button
                onClick={startStreaming}
                disabled={loading}
                className={`px-6 py-2 font-medium text-white rounded-lg ${
                    loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
                {loading ? "Generating..." : "Start Streaming"}
            </button>

            {error && (
                <p className="mt-4 text-red-500 text-sm">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Speech;