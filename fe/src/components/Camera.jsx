import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "../models/hand_landmarker.task";
import * as Actions from "../utils/Actions";
const Camera = ({boardRef}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const pointerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [handPresence, setHandPresence] = useState(null);
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
    const updateCursorPos = (landmarks) => {
        if (landmarks && landmarks.length > 0) {
            const indexFingerTip = landmarks[0][8]; // Index finger tip landmark
            const canvas = canvasRef.current;
            cursorPos = {
                x: -(indexFingerTip.x * canvas.width)*2,
                y: (indexFingerTip.y * canvas.height)*2
            };
            pointerRef.current.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
            setMousePosition({ x: cursorPos.x, y: cursorPos.y });
            if (cursorPos.x <= -660 && cursorPos.x >= -690 && cursorPos.y >= 0 && cursorPos.y <= 400) {
                Actions.handleBounce();
            }
        }
    };
    let cursorPos = { x: null, y: null }

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                handLandmarker = await HandLandmarker.createFromOptions(
                    vision, {
                        baseOptions: { modelAssetPath: hand_landmarker_task },
                        numHands: 1,
                        runningMode: "video"
                    }
                );
                detectHands();
            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };

        const drawLandmarks = (landmarksArray) => {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.setTransform(-1,0,0,1,canvas.width,0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';

            landmarksArray.forEach(landmarks => {
                landmarks.forEach(landmark => {
                    const x = landmark.x * canvas.width;
                    const y = landmark.y * canvas.height;

                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, 2 * Math.PI); // Draw a circle for each landmark
                    ctx.fill();
                });
            });
        };


        const detectHands = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
                setHandPresence(detections.handednesses.length > 0);

                // Assuming detections.landmarks is an array of landmark objects
                if (detections.landmarks) {
                    drawLandmarks(detections.landmarks);
                    updateCursorPos(detections.landmarks);
                }
            }
            requestAnimationFrame(detectHands);
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                videoRef.current.style.transform = "scaleX(-1)";
                await initializeHandDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-transparent">
            <div></div>
            <div className="flex relative items-center justify-center w-full h-64">
                <video className="absolute invisible w-full h-full top-0 left-0" ref={videoRef} autoPlay playsInline></video>
                <canvas className="absolute w-full h-full top-0 left-0 bg-transparent z-20" ref={canvasRef}></canvas>
                <div className="absolute bg-black w-4 h-4 rounded-full" ref={pointerRef}></div>
            </div>
        </div>
    );   
};

export default Camera;