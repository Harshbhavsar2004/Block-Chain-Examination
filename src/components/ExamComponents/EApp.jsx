import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Quiz from "./Quiz";

// import WebCam from "./WebCam";
// import Mic from "./Mic";

import './EStyle.css'
import FaceDetection from "./Pose_Detection";

function App() {
  return (
    <div>
      <Header />
      <Quiz />
      <Footer />
      <FaceDetection/>
    
      {/* <WebCam /> */}
    </div>
  );
}

export default App;
