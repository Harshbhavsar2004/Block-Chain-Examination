import React from "react";
import Timer from "./Timer";
import "./Header.css";
import FaceDetection from "./PoseDetection/Pose_Detection";
import WebcamClassifier from "./ObjectDetection/Objectdetection";
// import Webcam from "react-webcam";

function Header() {
  return (
    <header>
      <FaceDetection/>
      <h1>Blockhain Examination</h1>
      <Timer />
    </header>
  );
}

export default Header;
