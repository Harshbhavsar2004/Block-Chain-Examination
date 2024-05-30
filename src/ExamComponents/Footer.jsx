import React from "react";
// import WebCam from "./WebCam";
import Mic from "./Mic";
import QuizFullScreenExit from "./QuizFullScreenExit";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    // <WebCam />
    <footer>
      <Mic />
      <QuizFullScreenExit />
    {/* //   <p>Copyright ⓒ {currentYear}</p> */}
    </footer>
  );
}

export default Footer;
