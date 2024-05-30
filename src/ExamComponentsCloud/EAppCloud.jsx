import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Quiz from "./Quiz";

// import WebCam from "./WebCam";
// import Mic from "./Mic";

import './EStyle.css'

function App() {
  return (
    <div className="main">
      <Header />
      <Quiz />
      <Footer />
      {/* <WebCam /> */}
    </div>
  );
}

export default App;
