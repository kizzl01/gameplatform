import React, { useState } from "react";
import Game from "../Games/Snake/snake.js";
import GameTicTacToe from "../Games/TicTacToe/GameTicTacToe";
import BasicTabs from "./Navigation/BasicTabs";
import "./UIMain.css";

const content = () => {
  const c = [<GameTicTacToe />, <Game />];
  return c;
};

function Main() {
  const [contentItem, setContentItem] = useState(0);

  const handleClick = (i) => {
    setContentItem(i);
  };

  return (
    <div className="main-wrapper">
      <div className="navigation-container">
        <BasicTabs onClick={(i) => handleClick(i)} />
      </div>
      <div className="content-container">
        {content()[contentItem] && (
          <div className="game-wrapper">
            <div className="game-container">{content()[contentItem]}</div>
          </div>
        )}
      </div>
      <div className="info-container"></div>
    </div>
  );
}

export default Main;
