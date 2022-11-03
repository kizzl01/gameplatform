import React, { useState, useEffect } from "react";
import Snake from "../Games/Snake/snake.js";
import GameTicTacToe from "../Games/TicTacToe/GameTicTacToe";
import ScoreBoard from "./Information/ScoreBoard.jsx";
import BasicTabs from "./Navigation/BasicTabs";
import "./UIMain.css";

function Main() {
  const [contentItem, setContentItem] = useState(0);
  const [HighScores, setHighScores] = useState(null);

  const getScoreBoard = () => {
    fetch("https://localhost:44384/api/SnakeScoreBoard", {
      crossDomain: true,
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((e) => e.json())
      .then((e) => {
        setHighScores(e.scoreBoard);
        console.log("set new Scorebaord to", e.scoreBoard);
      });
    return null;
  };

  const postScoreBoard = () => {
    const { data } = this.state;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("https://localhost:44384/api/SnakeScoreBoard", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  useEffect(() => {
    getScoreBoard();
  }, []);

  const handleClick = (i) => {
    setContentItem(i);
  };

  const contents = () => {
    const c = [
      <GameTicTacToe />,
      <Snake newScore={(s) => WriteNewHighScores("Lukas", s)} />,
    ];
    return c;
  };

  const WriteNewHighScores = (n = "Lukas", s) => {
    const copy = this.HighScores.slice();
    // copy[copy.findIndex(x=>x)]
    console.log("score picked up ", s);
  };

  const content = contents()[contentItem];
  return (
    <div className="main-wrapper">
      <div className="navigation-container">
        <BasicTabs onClick={(i) => handleClick(i)} />
      </div>
      {content !== null && (
        <div className="content-container">
          <div className="game-wrapper">
            <div className="game-container">{content}</div>
          </div>
        </div>
      )}
      <div className="info-container">
        {content && content.type.name === "Snake" && (
          <ScoreBoard data={HighScores} getData={getScoreBoard} />
        )}
      </div>
    </div>
  );
}

export default Main;
