import React, { useState, useEffect } from 'react';

const WebcamClassifier = () => {
  const [model, setModel] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [predictions, setPredictions] = useState([]);
  
  useEffect(() => {
    async function loadModel() {
      const tf = require('@tensorflow/tfjs');
      const cocoSsd = require('@tensorflow-models/coco-ssd');
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    }
    
    loadModel();
  }, []);

  const enableWebcam = async () => {
    if (!model) {
      console.log('Wait! Model not loaded yet.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      const videoElement = document.getElementById('webcam');
      videoElement.srcObject = stream;
      videoElement.addEventListener('loadeddata', predictWebcam);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const predictWebcam = async () => {
    if (!model || !videoStream) {
      return;
    }

    model.detect(videoElement).then((predictions) => {
      setPredictions(predictions);
      window.requestAnimationFrame(predictWebcam);
    });
  };

  useEffect(() => {
    if (model && videoStream) {
      predictWebcam();
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [model, videoStream]);

  return (
    <div>
      <h1>Webcam Image Classification</h1>
      <button onClick={enableWebcam}>Enable Webcam</button>
      <div id="liveView" style={{ position: 'relative', width: '640px', height: '480px', border: '2px solid black', overflow: 'hidden' }}>
        <video id="webcam" autoPlay style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        {predictions.map((prediction, index) => (
          prediction.score > 0.66 && (
            <div key={index} className="highlighter" style={{ position: 'absolute', left: prediction.bbox[0], top: prediction.bbox[1], width: prediction.bbox[2], height: prediction.bbox[3], border: '2px solid red', pointerEvents: 'none' }} />
          )
        ))}
      </div>
    </div>
  );
};

export default WebcamClassifier;
