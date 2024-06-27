import React, { useEffect, useRef, useState } from 'react';
import vision from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3';
import swal from 'sweetalert';
import './Posestyle.css';
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

const FaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(true); // Start with webcamRunning as true
  const videoWidth = 480;
  const [results, setResults] = useState(undefined);
  const [lookCount, setLookCount] = useState(0);
  const [showLeftToast, setShowLeftToast] = useState(false);
  const [showRightToast, setShowRightToast] = useState(false);

  useEffect(() => {
    async function createFaceLandmarker() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      );
      const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: 'GPU',
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 1,
      });
      setFaceLandmarker(faceLandmarker);
    }

    createFaceLandmarker();

    // Start webcam and face detection when component mounts
    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => setWebcamRunning(true));
      }
    });

    return () => {
      // Clean up code if component unmounts
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  useEffect(() => {
    if (webcamRunning && faceLandmarker) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');

      let lastVideoTime = -1;
      const drawingUtils = new DrawingUtils(canvasCtx);

      const predictWebcam = async () => {
        if (video && canvas) {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            // Wait for the video to be fully loaded
            requestAnimationFrame(predictWebcam);
            return;
          }

          const ratio = video.videoHeight / video.videoWidth;
          video.style.width = `${videoWidth}px`;
          video.style.height = `${videoWidth * ratio}px`;
          canvas.style.width = `${videoWidth}px`;
          canvas.style.height = `${videoWidth * ratio}px`;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          let startTimeMs = performance.now();
          if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            try {
              const results = await faceLandmarker.detectForVideo(video, startTimeMs);
              setResults(results);
              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

              if (results.faceLandmarks) {
                for (const landmarks of results.faceLandmarks) {
                  // drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#FF3030' });
                }
              }
              handleLookError(results.faceBlendshapes);

            } catch (error) {
              console.error('Error during face detection:', error);
            }
          }

          if (webcamRunning) {
            requestAnimationFrame(predictWebcam);
          }
        }
      };

      predictWebcam();
    }
  }, [webcamRunning, faceLandmarker]);

  const handleLookError = (blendShapes) => {
    if (blendShapes[0].categories[13].score >= 0.9) {
        swal({
            title: "WARNING!!",
            text: "You are looking left",
            icon: "warning",
            button: "OK",
            timer: 5000,
        });
    }

    if (blendShapes[0].categories[14].score >= 0.9) {
        swal({
            title: "WARNING!!",
            text: "You are looking right",
            icon: "warning",
            button: "OK",
            timer: 5000,
        });
    }
};


  return (
    <div className='harshthebob'>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} />
      <ul id="blend-shapes"></ul>
    </div>
  );
};

export default FaceDetection;