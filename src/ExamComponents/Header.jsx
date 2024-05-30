import React from "react";
import Timer from "./Timer";
import ObjectDetection from "./ObjectDetection";
import Pose_Detection from "./Pose_Detection";
import "./Header.css";
// import Webcam from "react-webcam";

function Header() {
  return (
    <header>
      <h1>Blockhain Examination</h1>
      <Pose_Detection />
      <ObjectDetection />
      <Timer />
    </header>
  );
}

export default Header;
