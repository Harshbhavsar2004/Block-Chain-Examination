// // // run this code properly without hampering libraries or models in memory on it 
// // // why below code isn't working when we use face-api.js librery before running this code:
// // modify or rewrite the below code as per it is compatible with face-api.js library:
// can you merge code1 and code2 in one code without changing its functionality or working:

// modiy the below code as per it display the counts of warning seperately for cell phone, book, laptop, more than 1 person and with no persons:
import React from "react";
import swal from 'sweetalert';
//import count from './Login';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./Detections.css";

/**
 * This is the object detection class which uses webcam input 
 * feed and runs coco-ssd model for object detection
 */
export default class Detection extends React.Component {
  // Create video and canvas reference
  videoRef = React.createRef();
  canvasRef = React.createRef();

  constructor(props) {
    super(props);
    // count in state stores no of frames passed since face is not visible
    this.state = {count: 0};
  }

  /**
   * ComponentDidMount Runs when the component is first loaded
   * Setting up webcam input, loading model and calling DetectFrame which is
   * a recursive function so that it keeps detecting throughout the test
   */
  componentDidMount() {
    // setting up webcam input
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: 200,
            height: 200
          }
        })
        .then(stream => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });
      // load model and call the detectFrame function
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
        .then(values => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  /**
   * Use the model to detect objects in the frame, pass the predictions
   * to renderPredictions function then call detectFrame again
   * @param {videoRef} video 
   * @param {ModelPromise} model 
   */
  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {

      // if (this.canvasRef.current) {
      if (this.canvasRef.current && this.canvasRef.current.getContext("2d")) {

        this.renderPredictions(predictions);
        requestAnimationFrame(() => {
          this.detectFrame(video, model);
        });
      } else {
        return false;
      }
    });
  };

  renderPredictions = predictions => {

    // setting up the canvas for drawing rectangles and printing 
    // prediction text
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "top";

    // looping on predictions and drawing the bounding box for each object
    // and the text label background
    predictions.forEach(prediction => {

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt("16px sans-serif", 10); // base 10
      ctx.fillRect(x, y, textWidth + 8, textHeight + 8);

    });

    // Looping over all predictions and drawing text (prediction class)
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];

      ctx.fillStyle = "#000000";

      // Draw the text last to ensure it's on top.
      if (prediction.class === "person" || prediction.class === "cell phone" || prediction.class === "book" || prediction.class === "laptop") {
        ctx.fillText(prediction.class, x, y);
      }
    });

    var faces = 0;
      // if face is not visible till 50 consecutive frames, student is
      // not in front of the computer, throw an error
      if (predictions.length === 0 && this.state.count <50){
        this.setState.count++;
      }
      else if (predictions.length === 0) {
        this.setState.count=0;
        swal("Examinee is Not Detected", "Action has been Recorded", "error");
        // this.props.FaceNotVisible();
      }

      // loop over all predictions and check if mobile phone, book, laptop or multiple
      // people are there in the frame 
      for (let i = 0; i < predictions.length; i++) {

        if (predictions[i].class === "cell phone") {
          // this.props.MobilePhone();
          swal("Cell Phone Detected", "Action has been Recorded", "warning");

        }

        else if (predictions[i].class === "book" || predictions[i].class === "laptop") {
          // this.props.ProhibitedObject();
          swal("Prohibited Object Detected", "Action has been Recorded", "warning");
          // this.props.ProhibitedObject();
        }

        else if (predictions[i].class === "person") {
          faces += 1;
          this.setState.count=0;
        }

      }
      if(faces > 1){
        // this.props.MultipleFacesVisible();
        swal(faces.toString()+" people detected", "Action has been recorded", "error");
      }

  };

  render() {
    return (
      <div>
        <video
          className="size"
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          width= "200"
          height= "200"
        />
        <canvas
          className="size"
          ref={this.canvasRef}
          width="200"
          height="200"
        />
      </div>
    );
  }
}

// 2222222222222222222222222 perfectly running merged code with object, pose & voice as well as warnings as expect 2222222222222222222222222222222222222222222222222222222222222222222222222222
// 

// import React, { useRef, useEffect, useState } from "react";
// import swal from "sweetalert";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam";
// import "@tensorflow/tfjs";
// import "./Detections.css";

// function Detection() {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const webcamRef = useRef();
//   const [count, setCount] = useState(0);
//   const [alert, setAlert] = useState();
//   const [initialPersonDetected, setInitialPersonDetected] = useState(false);
//   const [warningCounts, setWarningCounts] = useState({
//     cellPhone: 0,
//     book: 0,
//     laptop: 0,
//     multiplePersons: 0,
//     noPersons: 0,
//     lookLeft: 0,
//     lookRight: 0,
//     voice: 0,
//   });

//   const detectFrame = async (video, model) => {
//     model.detect(video).then((predictions) => {
//       if (canvasRef.current && canvasRef.current.getContext("2d")) {
//         renderPredictions(predictions);
//         requestAnimationFrame(() => {
//           detectFrame(video, model);
//         });
//       } else {
//         return false;
//       }
//     });
//   };

//   const renderPredictions = predictions => {
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.font = "16px sans-serif";
//     ctx.textBaseline = "top";

//     let faces = 0;
//     let cellPhoneCount = 0;
//     let bookCount = 0;
//     let laptopCount = 0;
//     let noPersonsCount = 0;

//     predictions.forEach(prediction => {
//       const x = prediction.bbox[0];
//       const y = prediction.bbox[1];
//       const width = prediction.bbox[2];
//       const height = prediction.bbox[3];

//       ctx.strokeStyle = "#00FFFF";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(x, y, width, height);

//       ctx.fillStyle = "#00FFFF";
//       const textWidth = ctx.measureText(prediction.class).width;
//       const textHeight = parseInt("16px sans-serif", 10);
//       ctx.fillRect(x, y, textWidth + 8, textHeight + 8);

//       ctx.fillStyle = "#000000";
//       if (prediction.class === "person" || prediction.class === "cell phone" || prediction.class === "book" || prediction.class === "laptop") {
//         ctx.fillText(prediction.class, x, y);
//       }

//       if (prediction.class === "person") {
//         faces += 1;
//         setCount(0);

//         if (!initialPersonDetected) {
//           setInitialPersonDetected(true);
//         }
//       }

//       if (prediction.class === "cell phone") {
//         cellPhoneCount += 1;
//       } else if (prediction.class === "book") {
//         bookCount += 1;
//       } else if (prediction.class === "laptop") {
//         laptopCount += 1;
//       }
//     });

//     if (predictions.length === 0 && count < 50) {
//       setCount(prevCount => prevCount + 1);
//     } else if (predictions.length === 0) {
//       setCount(0);
//       noPersonsCount += 1;
//     }

//     if (cellPhoneCount > 0) {
//       swal({
//         title: "Cell Phone Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           cellPhone: prevCounts.cellPhone + cellPhoneCount
//         }));
//       });
//     }

//     if (bookCount > 0 || laptopCount > 0) {
//       swal({
//         title: "Prohibited Object Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           book: prevCounts.book + bookCount,
//           laptop: prevCounts.laptop + laptopCount
//         }));
//       });
//     }

//     if (initialPersonDetected && faces > 1) {
//       swal({
//         title: `${faces} people detected`,
//         text: "Action has been recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           multiplePersons: prevCounts.multiplePersons + 1
//         }));
//       });
//     }

//     if (noPersonsCount > 0) {
//       swal({
//         title: "Examinee is Not Detected",
//         text: "Action has been Recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           noPersons: prevCounts.noPersons + noPersonsCount
//         }));
//       });
//     }
//   };

//   const runPosenet = async () => {
//     const net = await posenet.load({
//       architecture: "ResNet50",
//       quantBytes: 2,
//       inputResolution: { width: 100, height: 100 },
//       scale: 0.6,
//     });
//     setInterval(() => {
//       detect(net);
//     }, 1500);
//   };

//   const detect = async (net) => {
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const pose = await net.estimateSinglePose(video);
//       EarsDetect(pose["keypoints"], 0.8);
//     }
//   };

//   const EarsDetect = (keypoints, minConfidence) => {

//     const keypointEarR = keypoints[3];
//     const keypointEarL = keypoints[4];

//     if (keypointEarL.score < minConfidence) {
//       swal({
//         title: "You looked away from the Screen (To the Right)",
//         closeOnClickOutside: false,
//       }).then((value) => {
//         if (value === true) {
//           setWarningCounts(prevCounts => ({
//             ...prevCounts,
//             lookRight: prevCounts.lookRight + 1
//           }));
//         }
//       });
//     }

//     if (keypointEarR.score < minConfidence) {
//       swal({
//         title: "You looked away from the Screen (To the Left)",
//         closeOnClickOutside: false,
//       }).then((value) => {
//         if (value === true) {
//           setWarningCounts(prevCounts => ({
//             ...prevCounts,
//             lookLeft: prevCounts.lookLeft + 1
//           }));
//         }
//       });
//     }

//   };

//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const webCamPromise = navigator.mediaDevices
//         .getUserMedia({
//           audio: false,
//           video: {
//             facingMode: "user",
//             width: 200,
//             height: 200,
//           },
//         })
//         .then((stream) => {
//           window.stream = stream;
//           videoRef.current.srcObject = stream;
//           return new Promise((resolve, reject) => {
//             videoRef.current.onloadedmetadata = () => {
//               resolve();
//             };
//           });
//         });
//       const modelPromise = cocoSsd.load();
//       Promise.all([modelPromise, webCamPromise])
//         .then((values) => {
//           detectFrame(videoRef.current, values[0]);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//     runPosenet();
//   }, []);

//   useEffect(() => {
//     const audioContext = new AudioContext();
//     const analyzer = audioContext.createAnalyser();
//     analyzer.fftSize = 256;
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(analyzer);
//         const bufferLength = analyzer.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);
//         const checkAudio = () => {
//           analyzer.getByteFrequencyData(dataArray);

//           const avg =
//             dataArray.reduce((acc, val) => acc + val) / bufferLength;

//           if (avg > 80) {
//             swal({
//               title: "Voice is Detected",
//               text: "Action has been Recorded",
//               icon: "error",
//               closeOnClickOutside: false,
//             }).then((value) => {
//               if (value === true) {
//                 setWarningCounts(prevCounts => ({
//                   ...prevCounts,
//                   voice: prevCounts.voice + 1
//                 }));
//               }
//             });
//             setAlert(true);
//           } else {
//             setAlert(false);
//           }
//           requestAnimationFrame(checkAudio);
//         };
//         checkAudio();
//       });
//   }, []);

//   return (
//     <div>
//       <Webcam
//         ref={webcamRef}
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         width="100"
//         height="100"
//       />
//       <video
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         ref={videoRef}
//         width="200"
//         height="200"
//       />
//       <canvas className="size" ref={canvasRef} width="200" height="200" />
//       {alert ? <p></p> : null}
//       {/* <div className="warnings">
//         <h3>Warning Counts</h3>
//         <nav>
//           <div>
//             <p>Cell Phone: {warningCounts.cellPhone}</p>
//             <p>Book: {warningCounts.book}</p>
//           </div>
//           <div>
//             <p>Multiple Persons: {warningCounts.multiplePersons}</p>
//             <p>Laptop: {warningCounts.laptop}</p>
//           </div>
//           <div>
//             <p>Look Right: {warningCounts.lookRight}</p>
//             <p>Look Left: {warningCounts.lookLeft}</p>
//           </div>
//           <br />
//           <div>
//             <p>No Persons: {warningCounts.noPersons}</p>
//             <p>Voice: {warningCounts.voice}</p>
//           </div>
//         </nav>
//       </div> */}
//     </div>
//   );
// }

// export default Detection;


// 3333333333333333333333333333333333333333333 updated warning code 3333333333333333333333333333333333333333333333333333333333333333333
// modify below code as per it displays more than one person detected warning at the begening of window but there is only one person so stop displaying warning when there is only o9ne person display warning when there is more than one person:
// import React from "react";
// import swal from 'sweetalert';
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import "@tensorflow/tfjs";
// import "./Detections.css";

// export default class Detection extends React.Component {
//   videoRef = React.createRef();
//   canvasRef = React.createRef();

//   constructor(props) {
//     super(props);
//     this.state = {
//       count: 0,
//       warningCounts: {
//         cellPhone: 0,
//         book: 0,
//         laptop: 0,
//         multiplePersons: 0,
//         noPersons: 0
//       },
//       initialPersonDetected: false
//     };
//   }

//   componentDidMount() {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const webCamPromise = navigator.mediaDevices
//         .getUserMedia({
//           audio: false,
//           video: {
//             facingMode: "user",
//             width: 200,
//             height: 200
//           }
//         })
//         .then(stream => {
//           window.stream = stream;
//           this.videoRef.current.srcObject = stream;
//           return new Promise((resolve, reject) => {
//             this.videoRef.current.onloadedmetadata = () => {
//               resolve();
//             };
//           });
//         });

//       const modelPromise = cocoSsd.load();
//       Promise.all([modelPromise, webCamPromise])
//         .then(values => {
//           this.detectFrame(this.videoRef.current, values[0]);
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }
//   }

//   detectFrame = (video, model) => {
//     model.detect(video).then(predictions => {
//       if (this.canvasRef.current && this.canvasRef.current.getContext("2d")) {
//         this.renderPredictions(predictions);
//         requestAnimationFrame(() => {
//           this.detectFrame(video, model);
//         });
//       } else {
//         return false;
//       }
//     });
//   };

//   renderPredictions = predictions => {
//     const ctx = this.canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.font = "16px sans-serif";
//     ctx.textBaseline = "top";

//     predictions.forEach(prediction => {
//       const x = prediction.bbox[0];
//       const y = prediction.bbox[1];
//       const width = prediction.bbox[2];
//       const height = prediction.bbox[3];

//       ctx.strokeStyle = "#00FFFF";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(x, y, width, height);

//       ctx.fillStyle = "#00FFFF";
//       const textWidth = ctx.measureText(prediction.class).width;
//       const textHeight = parseInt("16px sans-serif", 10);
//       ctx.fillRect(x, y, textWidth + 8, textHeight + 8);
//     });

//     let faces = 0;
//     let cellPhoneCount = 0;
//     let bookCount = 0;
//     let laptopCount = 0;
//     let noPersonsCount = 0;

//     predictions.forEach(prediction => {
//       const x = prediction.bbox[0];
//       const y = prediction.bbox[1];
//       ctx.fillStyle = "#000000";

//       if (prediction.class === "person" || prediction.class === "cell phone" || prediction.class === "book" || prediction.class === "laptop") {
//         ctx.fillText(prediction.class, x, y);
//       }

//       if (prediction.class === "person") {
//         faces += 1;
//         this.setState({ count: 0 });

//         // Set initialPersonDetected to true if at least one person is detected
//         if (!this.state.initialPersonDetected) {
//           this.setState({ initialPersonDetected: true });
//         }
//       }

//       if (prediction.class === "cell phone") {
//         cellPhoneCount += 1;
//       } else if (prediction.class === "book") {
//         bookCount += 1;
//       } else if (prediction.class === "laptop") {
//         laptopCount += 1;
//       }
//     });

//     if (predictions.length === 0 && this.state.count < 50) {
//       this.setState(prevState => ({ count: prevState.count + 1 }));
//     } else if (predictions.length === 0) {
//       this.setState({ count: 0 });
//       noPersonsCount += 1;
//     }

//     if (cellPhoneCount > 0) {
//       swal({
//         title: "Cell Phone Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         this.setState(prevState => ({
//           warningCounts: {
//             ...prevState.warningCounts,
//             cellPhone: prevState.warningCounts.cellPhone + cellPhoneCount
//           }
//         }));
//       });
//     }

//     if (bookCount > 0 || laptopCount > 0) {
//       swal({
//         title: "Prohibited Object Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         this.setState(prevState => ({
//           warningCounts: {
//             ...prevState.warningCounts,
//             book: prevState.warningCounts.book + bookCount,
//             laptop: prevState.warningCounts.laptop + laptopCount
//           }
//         }));
//       });
//     }

//     // Display the "Multiple Persons" warning only if initialPersonDetected is true and there are more than one person detected
//     if (this.state.initialPersonDetected && faces > 1) {
//       swal({
//         title: `${faces} people detected`,
//         text: "Action has been recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         this.setState(prevState => ({
//           warningCounts: {
//             ...prevState.warningCounts,
//             multiplePersons: prevState.warningCounts.multiplePersons + 1
//           }
//         }));
//       });
//     }

//     if (noPersonsCount > 0) {
//       swal({
//         title: "Examinee is Not Detected",
//         text: "Action has been Recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         this.setState(prevState => ({
//           warningCounts: {
//             ...prevState.warningCounts,
//             noPersons: prevState.warningCounts.noPersons + noPersonsCount
//           }
//         }));
//       });
//     }
//   };

//   render() {
//     const { warningCounts } = this.state;

//     return (
//       <div>
//         <video
//           className="size"
//           autoPlay
//           playsInline
//           muted
//           ref={this.videoRef}
//           width="200"
//           height="200"
//         />
//         <canvas
//           className="size"
//           ref={this.canvasRef}
//           width="200"
//           height="200"
//         />
//         <div className="warnings">
//           <div>
//             Cell Phone Warnings: {warningCounts.cellPhone}
//           </div>
//           <div>
//             Book Warnings: {warningCounts.book}
//           </div>
//           <div>
//             Laptop Warnings: {warningCounts.laptop}
//           </div>
//           <div>
//             Multiple Persons Warnings: {warningCounts.multiplePersons}
//           </div>
//           <div>
//             No Persons Warnings: {warningCounts.noPersons}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }


// 1111111111111111111111111111111111111111 []  1111111111111111111111111111111111111111111111111111111111111111111111111111111


// *********************************** merged code with mic object & pose *******************************************
// modify below code as per it displays more than one person detected warning at the begening of window but there is only one person so stop displaying warning when there is only o9ne person display warning when there is more than one person:
// modiy the below code as per it display the counts of warning seperately for cell phone, book, laptop, more than 1 person, with no persons, looking right & left and vioice as well as count 1 warning only when users click okay button of swal meaasge:
// import React, { useRef, useEffect, useState } from "react";
// import swal from "sweetalert";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam";
// import "@tensorflow/tfjs";
// import "./Detections.css";

// function Detection() {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const webcamRef = useRef();
//   const [count, setCount] = useState(0);
//   const [alert, setAlert] = useState(false);

//   const detectFrame = async (video, model) => {
//     model.detect(video).then((predictions) => {
//       if (canvasRef.current && canvasRef.current.getContext("2d")) {
//         renderPredictions(predictions);
//         requestAnimationFrame(() => {
//           detectFrame(video, model);
//         });
//       } else {
//         return false;
//       }
//     });
//   };

//   const renderPredictions = (predictions) => {
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.font = "16px sans-serif";
//     ctx.textBaseline = "top";
//     predictions.forEach((prediction) => {
//       const x = prediction.bbox[0];
//       const y = prediction.bbox[1];
//       const width = prediction.bbox[2];
//       const height = prediction.bbox[3];
//       ctx.strokeStyle = "#00FFFF";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(x, y, width, height);
//       ctx.fillStyle = "#00FFFF";
//       const textWidth = ctx.measureText(prediction.class).width;
//       const textHeight = parseInt("16px sans-serif", 10);
//       ctx.fillRect(x, y, textWidth + 8, textHeight + 8);
//     });

//     predictions.forEach((prediction) => {
//       const x = prediction.bbox[0];
//       const y = prediction.bbox[1];
//       ctx.fillStyle = "#000000";
//       if (
//         prediction.class === "person" ||
//         prediction.class === "cell phone" ||
//         prediction.class === "book" ||
//         prediction.class === "laptop"
//       ) {
//         ctx.fillText(prediction.class, x, y);
//       }
//     });

//     let faces = 0;
//     if (predictions.length === 0 && count < 50) {
//       setCount((prevCount) => prevCount + 1);
//     } else if (predictions.length === 0) {
//       setCount(0);
//       swal("Examinee is Not Detected", "Action has been Recorded", "error");
//     }

//     for (let i = 0; i < predictions.length; i++) {
//       if (predictions[i].class === "cell phone") {
//         swal("Cell Phone Detected", "Action has been Recorded", "warning");
//       } else if (
//         predictions[i].class === "book" ||
//         predictions[i].class === "laptop"
//       ) {
//         swal(
//           "Prohibited Object Detected",
//           "Action has been Recorded",
//           "warning"
//         );
//       } else if (predictions[i].class === "person") {
//         faces += 1;
//         setCount(0);
//       }
//     }

//     if (faces > 1) {
//       swal(faces.toString() + " people detected", "Action has been recorded", "error");
//     }
//   };

//   const runPosenet = async () => {
//     const net = await posenet.load({
//       architecture: "ResNet50",
//       quantBytes: 2,
//       inputResolution: { width: 100, height: 100 },
//       scale: 0.6,
//     });
//     setInterval(() => {
//       detect(net);
//     }, 1500);
//   };

//   const detect = async (net) => {
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const pose = await net.estimateSinglePose(video);
//       EarsDetect(pose["keypoints"], 0.8);
//     }
//   };

//   const EarsDetect = (keypoints, minConfidence) => {
//     const keypointEarR = keypoints[3];
//     const keypointEarL = keypoints[4];
//     if (keypointEarL.score < minConfidence) {
//       swal("You looked away from the Screen (To the Right)");
//     }
//     if (keypointEarR.score < minConfidence) {
//       swal("You looked away from the Screen (To the Left)");
//     }
//   };

//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const webCamPromise = navigator.mediaDevices
//         .getUserMedia({
//           audio: false,
//           video: {
//             facingMode: "user",
//             width: 200,
//             height: 200,
//           },
//         })
//         .then((stream) => {
//           window.stream = stream;
//           videoRef.current.srcObject = stream;
//           return new Promise((resolve, reject) => {
//             videoRef.current.onloadedmetadata = () => {
//               resolve();
//             };
//           });
//         });
//       const modelPromise = cocoSsd.load();
//       Promise.all([modelPromise, webCamPromise])
//         .then((values) => {
//           detectFrame(videoRef.current, values[0]);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }

//     runPosenet();
//   }, []);

//   useEffect(() => {
//     const audioContext = new AudioContext();
//     const analyzer = audioContext.createAnalyser();
//     analyzer.fftSize = 256;
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(analyzer);
//         const bufferLength = analyzer.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);
//         const checkAudio = () => {
//           analyzer.getByteFrequencyData(dataArray);
//           const avg =
//             dataArray.reduce((acc, val) => acc + val) / bufferLength;
//           if (avg > 60) {
//             swal("Voice is Detected", "Action has been Recorded", "error");
//             setAlert(true);
//           } else {
//             setAlert(false);
//           }
//           requestAnimationFrame(checkAudio);
//         };
//         checkAudio();
//       });
//   }, []);

//   return (
//     <div>
//       <Webcam
//         ref={webcamRef}
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         width="100"
//         height="100"
//       />
//       <video
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         ref={videoRef}
//         width="200"
//         height="200"
//       />
//       <canvas className="size" ref={canvasRef} width="200" height="200" />
//       {alert ? <p></p> : null}
//     </div>
//   );
// }

// export default Detection;

// *********************************** merged code with mic object & pose and warnings *******************************************
// modify below code as per it display warning counts on screen:
//  the function of below code is it count warning only when users click okay button of swal meaasge but it continuously count the warnings so fix this issue:
// modify below code as per if total count of all warnings is greater than 20 then terminate the examination automatically:

// import React, { useRef, useEffect, useState } from "react";
// import swal from "sweetalert";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam";
// import "@tensorflow/tfjs";
// import "./Detections.css";

// function Detection() {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const webcamRef = useRef();
//   const [count, setCount] = useState(0);
//   const [alert, setAlert] = useState();
//   const [initialPersonDetected, setInitialPersonDetected] = useState(false);
//   const [warningCounts, setWarningCounts] = useState({
//     cellPhone: 0,
//     book: 0,
//     laptop: 0,
//     multiplePersons: 0,
//     noPersons: 0,
//     lookLeft: 0,
//     lookRight: 0,
//     voice: 0,
//   });

//   const detectFrame = async (video, model) => {
//     model.detect(video).then((predictions) => {
//       if (canvasRef.current && canvasRef.current.getContext("2d")) {
//         renderPredictions(predictions);
//         requestAnimationFrame(() => {
//           detectFrame(video, model);
//         });
//       } else {
//         return false;
//       }
//     });
//   };

//   const renderPredictions = predictions => {
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.font = "16px sans-serif";
//     ctx.textBaseline = "top";

//     let faces = 0;
//     let cellPhoneCount = 0;
//     let bookCount = 0;
//     let laptopCount = 0;
//     let noPersonsCount = 0;

//     predictions.forEach(prediction => {
//       const x = prediction.bbox[0];
//       const y = prediction.bbox[1];
//       const width = prediction.bbox[2];
//       const height = prediction.bbox[3];

//       ctx.strokeStyle = "#00FFFF";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(x, y, width, height);

//       ctx.fillStyle = "#00FFFF";
//       const textWidth = ctx.measureText(prediction.class).width;
//       const textHeight = parseInt("16px sans-serif", 10);
//       ctx.fillRect(x, y, textWidth + 8, textHeight + 8);

//       ctx.fillStyle = "#000000";
//       if (prediction.class === "person" || prediction.class === "cell phone" || prediction.class === "book" || prediction.class === "laptop") {
//         ctx.fillText(prediction.class, x, y);
//       }

//       if (prediction.class === "person") {
//         faces += 1;
//         setCount(0);

//         if (!initialPersonDetected) {
//           setInitialPersonDetected(true);
//         }
//       }

//       if (prediction.class === "cell phone") {
//         cellPhoneCount += 1;
//       } else if (prediction.class === "book") {
//         bookCount += 1;
//       } else if (prediction.class === "laptop") {
//         laptopCount += 1;
//       }
//     });

//     if (predictions.length === 0 && count < 50) {
//       setCount(prevCount => prevCount + 1);
//     } else if (predictions.length === 0) {
//       setCount(0);
//       noPersonsCount += 1;
//     }

//     if (cellPhoneCount > 0) {
//       swal({
//         title: "Cell Phone Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           cellPhone: prevCounts.cellPhone + cellPhoneCount
//         }));
//       });
//     }

//     if (bookCount > 0 || laptopCount > 0) {
//       swal({
//         title: "Prohibited Object Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           book: prevCounts.book + bookCount,
//           laptop: prevCounts.laptop + laptopCount
//         }));
//       });
//     }

//     if (initialPersonDetected && faces > 1) {
//       swal({
//         title: `${faces} people detected`,
//         text: "Action has been recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           multiplePersons: prevCounts.multiplePersons + 1
//         }));
//       });
//     }

//     if (noPersonsCount > 0) {
//       swal({
//         title: "Examinee is Not Detected",
//         text: "Action has been Recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts(prevCounts => ({
//           ...prevCounts,
//           noPersons: prevCounts.noPersons + noPersonsCount
//         }));
//       });
//     }
//   };

//   const runPosenet = async () => {
//     const net = await posenet.load({
//       architecture: "ResNet50",
//       quantBytes: 2,
//       inputResolution: { width: 100, height: 100 },
//       scale: 0.6,
//     });
//     setInterval(() => {
//       detect(net);
//     }, 1500);
//   };

//   const detect = async (net) => {
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const pose = await net.estimateSinglePose(video);
//       EarsDetect(pose["keypoints"], 0.8);
//     }
//   };

//   const EarsDetect = (keypoints, minConfidence) => {

//     const keypointEarR = keypoints[3];
//     const keypointEarL = keypoints[4];

//     if (keypointEarL.score < minConfidence) {
//       swal({
//         title: "You looked away from the Screen (To the Right)",
//         closeOnClickOutside: false,
//       }).then((value) => {
//         if (value === true) {
//           setWarningCounts(prevCounts => ({
//             ...prevCounts,
//             lookRight: prevCounts.lookRight + 1
//           }));
//         }
//       });
//     }

//     if (keypointEarR.score < minConfidence) {
//       swal({
//         title: "You looked away from the Screen (To the Left)",
//         closeOnClickOutside: false,
//       }).then((value) => {
//         if (value === true) {
//           setWarningCounts(prevCounts => ({
//             ...prevCounts,
//             lookLeft: prevCounts.lookLeft + 1
//           }));
//         }
//       });
//     }

//   };

//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const webCamPromise = navigator.mediaDevices
//         .getUserMedia({
//           audio: false,
//           video: {
//             facingMode: "user",
//             width: 200,
//             height: 200,
//           },
//         })
//         .then((stream) => {
//           window.stream = stream;
//           videoRef.current.srcObject = stream;
//           return new Promise((resolve, reject) => {
//             videoRef.current.onloadedmetadata = () => {
//               resolve();
//             };
//           });
//         });
//       const modelPromise = cocoSsd.load();
//       Promise.all([modelPromise, webCamPromise])
//         .then((values) => {
//           detectFrame(videoRef.current, values[0]);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//     runPosenet();
//   }, []);

//   useEffect(() => {
//     const audioContext = new AudioContext();
//     const analyzer = audioContext.createAnalyser();
//     analyzer.fftSize = 256;
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(analyzer);
//         const bufferLength = analyzer.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);
//         const checkAudio = () => {
//           analyzer.getByteFrequencyData(dataArray);

//           const avg =
//             dataArray.reduce((acc, val) => acc + val) / bufferLength;

//           if (avg > 80) {
//             swal({
//               title: "Voice is Detected",
//               text: "Action has been Recorded",
//               icon: "error",
//               closeOnClickOutside: false,
//             }).then((value) => {
//               if (value === true) {
//                 setWarningCounts(prevCounts => ({
//                   ...prevCounts,
//                   voice: prevCounts.voice + 1
//                 }));
//               }
//             });
//             setAlert(true);
//           } else {
//             setAlert(false);
//           }
//           requestAnimationFrame(checkAudio);
//         };
//         checkAudio();
//       });
//   }, []);

//   return (
//     <div>
//       <Webcam
//         ref={webcamRef}
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         width="100"
//         height="100"
//       />
//       <video
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         ref={videoRef}
//         width="200"
//         height="200"
//       />
//       <canvas className="size" ref={canvasRef} width="200" height="200" />
//       {alert ? <p></p> : null}
//       <div className="warnings">
//         <h3>Warning Counts</h3>
//         <nav>
//           <div>
//             <p>Cell Phone: {warningCounts.cellPhone}</p>
//             <p>Book: {warningCounts.book}</p>
//           </div>
//           <div>
//             <p>Multiple Persons: {warningCounts.multiplePersons}</p>
//             <p>Laptop: {warningCounts.laptop}</p>
//           </div>
//           <div>
//             <p>Look Right: {warningCounts.lookRight}</p>
//             <p>Look Left: {warningCounts.lookLeft}</p>
//           </div>
//           <br/>
//           <div>
//             <p>No Persons: {warningCounts.noPersons}</p>
//             <p>Voice: {warningCounts.voice}</p>
//           </div>
//         </nav>
//       </div>
//     </div>
//   );
// }

// export default Detection;


// 555555555555555555555555555 updated code with termination logic 5555555555555555555555555555555555555555555555555555
//  modify & correct below code because it can not show terminate exam message if still count of warnings are exceeds:
// import React, { useRef, useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import swal from "sweetalert";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam";
// import "@tensorflow/tfjs";
// import "./Detections.css";

// function Detection() {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const webcamRef = useRef();
//   const [count, setCount] = useState(0);
//   const [warningCounts, setWarningCounts] = useState({
//     cellPhone: 0,
//     book: 0,
//     laptop: 0,
//     multiplePersons: 0,
//     noPersons: 0,
//     lookLeft: 0,
//     lookRight: 0,
//     voice: 0,
//   });

//   const terminateExamination = () => {
//     const totalWarnings = Object.values(warningCounts).reduce(
//       (total, count) => total + count,
//       0
//     );

//     if (totalWarnings >= 20) {
//       swal({
//         title: "Examination Terminated",
//         text: "Total count of warnings exceeded or reached the limit",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         // Perform any necessary actions after terminating the examination
//         <Link to="./po1"></Link>
//       });
//     }
//   };

//   const detectFrame = async (video, model) => {
//     model.detect(video).then((predictions) => {
//       if (canvasRef.current && canvasRef.current.getContext("2d")) {
//         renderPredictions(predictions);
//         requestAnimationFrame(() => {
//           detectFrame(video, model);
//         });
//       } else {
//         return false;
//       }
//     });
//   };

//   const renderPredictions = (predictions) => {
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     ctx.font = "16px sans-serif";
//     ctx.textBaseline = "top";

//     let faces = 0;
//     let cellPhoneCount = 0;
//     let bookCount = 0;
//     let laptopCount = 0;
//     let noPersonsCount = 0;

//     predictions.forEach((prediction) => {
//       const x = prediction.bbox[0];
//       const y = prediction.bbox[1];
//       const width = prediction.bbox[2];
//       const height = prediction.bbox[3];

//       ctx.strokeStyle = "#00FFFF";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(x, y, width, height);

//       ctx.fillStyle = "#00FFFF";
//       const textWidth = ctx.measureText(prediction.class).width;
//       const textHeight = parseInt("16px sans-serif", 10);
//       ctx.fillRect(x, y, textWidth + 8, textHeight + 8);

//       ctx.fillStyle = "#000000";
//       if (
//         prediction.class === "person" ||
//         prediction.class === "cell phone" ||
//         prediction.class === "book" ||
//         prediction.class === "laptop"
//       ) {
//         ctx.fillText(prediction.class, x, y);
//       }

//       if (prediction.class === "person") {
//         faces += 1;
//         setCount(0);
//       }

//       if (prediction.class === "cell phone") {
//         cellPhoneCount += 1;
//       } else if (prediction.class === "book") {
//         bookCount += 1;
//       } else if (prediction.class === "laptop") {
//         laptopCount += 1;
//       }
//     });

//     if (predictions.length === 0 && count < 50) {
//       setCount((prevCount) => prevCount + 1);
//     } else if (predictions.length === 0) {
//       setCount(0);
//       noPersonsCount += 1;
//     }

//     if (cellPhoneCount > 0) {
//       swal({
//         title: "Cell Phone Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts((prevCounts) => ({
//           ...prevCounts,
//           cellPhone: prevCounts.cellPhone + cellPhoneCount,
//         }));
//         terminateExamination();
//       });
//     }

//     if (bookCount > 0 || laptopCount > 0) {
//       swal({
//         title: "Prohibited Object Detected",
//         text: "Action has been Recorded",
//         icon: "warning",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts((prevCounts) => ({
//           ...prevCounts,
//           book: prevCounts.book + bookCount,
//           laptop: prevCounts.laptop + laptopCount,
//         }));
//         terminateExamination();
//       });
//     }

//     if (faces > 1) {
//       swal({
//         title: `${faces} people detected`,
//         text: "Action has been recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts((prevCounts) => ({
//           ...prevCounts,
//           multiplePersons: prevCounts.multiplePersons + 1,
//         }));
//         terminateExamination();
//       });
//     }

//     if (noPersonsCount > 0) {
//       swal({
//         title: "Examinee is Not Detected",
//         text: "Action has been Recorded",
//         icon: "error",
//         closeOnClickOutside: false,
//       }).then(() => {
//         setWarningCounts((prevCounts) => ({
//           ...prevCounts,
//           noPersons: prevCounts.noPersons + noPersonsCount,
//         }));
//         terminateExamination();
//       });
//     }
//   };

//   const runPosenet = async () => {
//     const net = await posenet.load({
//       architecture: "ResNet50",
//       quantBytes: 2,
//       inputResolution: { width: 100, height: 100 },
//       scale: 0.6,
//     });
//     setInterval(() => {
//       detect(net);
//     }, 1500);
//   };

//   const detect = async (net) => {
//     if (
//       typeof webcamRef.current !== "undefined" &&
//       webcamRef.current !== null &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const pose = await net.estimateSinglePose(video);
//       EarsDetect(pose["keypoints"], 0.8);
//     }
//   };

//   const EarsDetect = (keypoints, minConfidence) => {
//     const keypointEarR = keypoints[3];
//     const keypointEarL = keypoints[4];

//     if (keypointEarL.score < minConfidence) {
//       swal({
//         title: "You looked away from the Screen (To the Right)",
//         closeOnClickOutside: false,
//       }).then((value) => {
//         if (value === true) {
//           setWarningCounts((prevCounts) => ({
//             ...prevCounts,
//             lookRight: prevCounts.lookRight + 1,
//           }));
//           terminateExamination();
//         }
//       });
//     }

//     if (keypointEarR.score < minConfidence) {
//       swal({
//         title: "You looked away from the Screen (To the Left)",
//         closeOnClickOutside: false,
//       }).then((value) => {
//         if (value === true) {
//           setWarningCounts((prevCounts) => ({
//             ...prevCounts,
//             lookLeft: prevCounts.lookLeft + 1,
//           }));
//           terminateExamination();
//         }
//       });
//     }
//   };

//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const webCamPromise = navigator.mediaDevices
//         .getUserMedia({
//           audio: false,
//           video: {
//             facingMode: "user",
//             width: 200,
//             height: 200,
//           },
//         })
//         .then((stream) => {
//           window.stream = stream;
//           videoRef.current.srcObject = stream;
//           return new Promise((resolve, reject) => {
//             videoRef.current.onloadedmetadata = () => {
//               resolve();
//             };
//           });
//         });
//       const modelPromise = cocoSsd.load();
//       Promise.all([modelPromise, webCamPromise])
//         .then((values) => {
//           detectFrame(videoRef.current, values[0]);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//     runPosenet();
//   }, []);

//   useEffect(() => {
//     const audioContext = new AudioContext();
//     const analyzer = audioContext.createAnalyser();
//     analyzer.fftSize = 256;
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(analyzer);
//         const bufferLength = analyzer.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);
//         const checkAudio = () => {
//           analyzer.getByteFrequencyData(dataArray);

//           const avg =
//             dataArray.reduce((acc, val) => acc + val) / bufferLength;

//           if (avg > 80) {
//             swal({
//               title: "Voice is Detected",
//               text: "Action has been Recorded",
//               icon: "error",
//               closeOnClickOutside: false,
//             }).then((value) => {
//               if (value === true) {
//                 setWarningCounts((prevCounts) => ({
//                   ...prevCounts,
//                   voice: prevCounts.voice + 1,
//                 }));
//                 terminateExamination();
//               }
//             });
//           }

//           requestAnimationFrame(checkAudio);
//         };
//         checkAudio();
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);

//   return (
//     <div>
//       <Webcam
//         ref={webcamRef}
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         width="100"
//         height="100"
//       />
//       <video
//         className="size"
//         autoPlay
//         playsInline
//         muted
//         ref={videoRef}
//         width="200"
//         height="200"
//       />
//       <canvas className="size" ref={canvasRef} width="200" height="200" />
//       {alert ? <p></p> : null}
//       <div className="warnings">
//         <h3>Warning Counts:</h3>
//         <p>Cell Phone: {warningCounts.cellPhone}</p>
//         <p>Book: {warningCounts.book}</p>
//         <p>Laptop: {warningCounts.laptop}</p>
//         <p>Multiple Persons: {warningCounts.multiplePersons}</p>
//         <p>No Persons: {warningCounts.noPersons}</p>
//         <p>Look Left: {warningCounts.lookLeft}</p>
//         <p>Look Right: {warningCounts.lookRight}</p>
//         <p>Voice: {warningCounts.voice}</p>
//       </div>
//     </div>
//   );
// }

// export default Detection;




