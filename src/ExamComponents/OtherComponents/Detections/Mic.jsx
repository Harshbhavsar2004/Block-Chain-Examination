
import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';

function AudioDetector() {
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        const audioContext = new AudioContext();
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyzer);
                const bufferLength = analyzer.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                const checkAudio = () => {
                    analyzer.getByteFrequencyData(dataArray);
                    const avg = dataArray.reduce((acc, val) => acc + val) / bufferLength;
                    if (avg > 80) { // adjust this threshold to suit your needs
                        // setAlert(true);
                        swal("Voice is Detected", "Action has been Recorded", "error");
                        
                    } else {
                        setAlert(false);
                    }
                    requestAnimationFrame(checkAudio);
                };
                checkAudio();
            });
    }, []);

    return (
        <div>
            {alert ? <p></p> : null}
        </div>
    );
}

export default AudioDetector;