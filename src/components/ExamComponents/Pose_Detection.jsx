import React, { useEffect, useRef, useState } from 'react';
import vision from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3';

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

const FaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const videoWidth = 480;
  const [results, setResults] = useState(undefined);

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
            const results = await faceLandmarker.detectForVideo(video, startTimeMs);
            setResults(results);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            if (results.faceLandmarks) {
              for (const landmarks of results.faceLandmarks) {
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#FF3030' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: '#FF3030' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#30FF30' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: '#30FF30' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: '#E0E0E0' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: '#E0E0E0' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: '#FF3030' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: '#30FF30' });
              }
            }

            drawBlendShapes(results.faceBlendshapes);
          }

          if (webcamRunning) {
            requestAnimationFrame(predictWebcam);
          }
        }
      };

      predictWebcam();
    }
  }, [webcamRunning, faceLandmarker]);

  const drawBlendShapes = (blendShapes) => {
    const blendShapesContainer = document.getElementById('blend-shapes');
    if (!blendShapes.length || !blendShapesContainer) return;

    let htmlMaker = '';
    blendShapes[0].categories.forEach((shape) => {
      htmlMaker += `
        <li class="blend-shapes-item">
          <span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
          <span class="blend-shapes-value" style="width: calc(${shape.score * 100}% - 120px)">${shape.score.toFixed(4)}</span>
        </li>
      `;
    });

    blendShapesContainer.innerHTML = htmlMaker;
  };

  const enableCam = () => {
    if (!faceLandmarker) {
      console.log('Wait! faceLandmarker not loaded yet.');
      return;
    }

    setWebcamRunning((prevState) => !prevState);

    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => setWebcamRunning(true));
      }
    });
  };

  return (
    <div>
      <button onClick={enableCam}>
        {webcamRunning ? 'DISABLE PREDICTIONS' : 'ENABLE PREDICTIONS'}
      </button>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{
        width:"500px",
        height:"500px",
      }}/>
      <ul id="blend-shapes"></ul>
    </div>
  );
};

export default FaceDetection;
