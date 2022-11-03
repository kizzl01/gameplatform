import React, { useState, useEffect } from "react";
import Snake from "../Games/Snake/snake.js";
import GameTicTacToe from "../Games/TicTacToe/GameTicTacToe";
import ScoreBoard from "./Information/ScoreBoard.jsx";
import BasicTabs from "./Navigation/BasicTabs";
import "./UIMain.css";

function Main() {
  const [user, setUser] = useState("Lukas");
  const [contentItem, setContentItem] = useState(0);
  const [HighScores, setHighScores] = useState(null);

  // Kommunikation Server -> Client
  // methode zum daten anfragen per httpget methode. spricht den endpunkt der API an der in der fetch methode angegeben ist

  const getScoreBoard = () => {
    fetch("https://localhost:44384/api/SnakeScoreBoard", {
      crossDomain: true,
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((e) => e.json())
      .then((e) => {
        setHighScores(e);
      });
    return null;
  };

  // Kommunikation Client -> Server
  // methode zum posten per httppost. spricht den Endpunkt der API an der in der fetch methode angegeben ist

  const postScoreBoard = (data) => {
    const requestOptions = {
      crossDomain: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("https://localhost:44384/api/SnakeScoreBoard", requestOptions);
  };

  // useEffect ist eine Methode von React (oben imported), die wenn man als zweites Argument der ArrowFunction ein leeres Array angibt
  // sich verhält wie ein Konstruktor, sprich zu beginn wird sie genau einmal ausgeführt
  // ist nötig, da die UIMain komponente function based ist und somit keinen konstruktor hat

  useEffect(() => {
    getScoreBoard();
  }, []);

  const handleClick = (i) => {
    setContentItem(i);
  };

  // Die Methode gibt als Rückgabewert ein Array von Komponenten zurück. Hier werden die einzelnen Spiele später eingefügt!

  const contents = () => {
    const c = [
      <GameTicTacToe />,
      <Snake newScore={(s) => WriteNewHighScores(user, s)} />,
    ];
    return c;
  };

  const WriteNewHighScores = (n, s) => {
    const copy = HighScores.slice();
    console.log("old: ", HighScores);
    if (copy[copy.findIndex((x) => x.name === n)].score < s) {
      copy[copy.findIndex((x) => x.name === n)].score = s;
      setHighScores(copy);
      postScoreBoard(copy);
    }
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
