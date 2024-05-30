import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
//import { useHistory } from "react-router-dom";
import questions from "./QuestionData.js";
import { Radio } from "@material-ui/core";

function Quiz() {
  const [option, setOption] = useState("");
  const handleOption = (e) => {
    setOption(e.target.value);
  };
  function deSelect() {
    var ele = document.getElementsByClassName("option");
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type === "radio") ele[i].checked = false;
    }
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div>
      <div className="question-box">
        <div className="questionchange">
          <h1>Question. {currentQuestion + 1}</h1>
          <br />
          <hr />{" "}
          <p className="questiontext">
            {questions[currentQuestion].questionText}
            <sup>2</sup>
          </p>
          <br />
          {questions[currentQuestion].answerOptions.map((answerOption) => (
            <div>
              <input
                type="radio"
                className="option"
                color="primary"
                value="option1"
              />
              <span> {answerOption.answerText}</span>
            </div>
          ))}
        </div>
        <br />
        <div className="buttons">
          <button onClick={handleAnswerOptionClick} className="button button1">
            SAVE & NEXT
          </button>
          <button onClick={deSelect} className="button button2">
            CLEAR RESPONSE
          </button>
          <button onClick={handleAnswerOptionClick} className="button button3">
            MARK FOR REVIEW
          </button>
          <button onClick={handleAnswerOptionClick} className="button button4">
            SAVE & MARK FOR REVIEW&NEXT
          </button>
          <button className="button button5">SUBMIT&CLOSE</button>
        </div>
      </div>
      <div className="buttons-box">
        <button className="nv" name="Not Visited">
          {" "}
          5{" "}
        </button>
        <p className="gray">Not Visited</p>
        <button className="na" name="Not Answered">
          {" "}
          6{" "}
        </button>
        <p className="red">Not Answered</p>
        <button className="amr" name="Answered & Marked for Review">
          {" "}
          0{" "}
        </button>
        <p className="yellow">Answered & Marked for Review</p>
        <button className="a" name="Answered">
          {" "}
          0{" "}
        </button>
        <p className="green">Answered</p>
        <button className="mr" name="Marked for Review">
          {" "}
          0{" "}
        </button>
        <p className="blue">Marked for Review</p>
      </div>
      <div className="mark-box">
        <button className="mark-button">1</button>
      </div>
      <div className="card mb-3">
        <div
          className="card-body"
          style={{
            display: "flex",
            padding: 10,
            flexWrap: "wrap"
          }}
        >
          {questions.map((item, index) => (
            <div
              key={index}
              className="border border-primary font-weight-bold"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                width: 40,
                marginRight: 5,
                marginBottom: 5,
                borderRadius: 5,
                cursor: "pointer",
                backgroundColor:
                  index === currentQuestion
                    ? "greenyellow "
                    : item?.selected
                    ? "grey"
                    : "transparent"
              }}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
