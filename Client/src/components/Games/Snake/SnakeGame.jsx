/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import LiveScoreboard from "../../UI/LiveScoreboard/LiveScoreboard";
import ScoreBoard from "../../UI/ScoreBoard/ScoreBoard";
import Snake from "./snake";

function SnakeGame(props) {
  const [HighScores, setHighScores] = useState(null);
  const [user, setUser] = useState(props.user);
  const socket = props.socket;

  useEffect(() => {
    socket.on("updateScoreboard", (data) => {
      console.log("server message: module snakegame updating highscoreboard to ", data);
      setHighScores(data);
    });

    socket.on("message", (message) => {
      console.log(message);
    });
    getScoreBoard();
  }, []);

  const getScoreBoard = () => {
    fetch(`${props.APIURL()}getScoreboard`, {
      crossDomain: true,
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((e) => e.json())
      .then((e) => {
        e = e.sort(compareScores);
        setHighScores(e);
      });
    return null;
  };

  const postScore = (newScore) => {
    const requestOptions = {
      crossDomain: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newScore),
    };
    fetch(`${props.APIURL()}postSnakeScore`, requestOptions);
  };

  function compareScores(a, b) {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  }

  const HandleNewHighScore = (user, s) => {
    const newScore = { user: user, score: s };
    postScore(newScore);
  };

  const sendLiveScore = (user, s) => {
    const liveScore = { user: user, livescore: s };
    socket.emit("sendliveScore", liveScore);
  };

  // livescore für alle wird gelöscht wenn server highscoreboard update beauftragt

  return (
    <div className="main-wrapper">
      <div className="game-wrapper">
        <div className="game-container">
          <Snake
            newHighScore={(s) => HandleNewHighScore(user, s)}
            newLiveScore={(s) => sendLiveScore(user, s)}
          />
        </div>
      </div>
      {HighScores && (
        <div className="info-container">
          <LiveScoreboard
            data={HighScores}
            socket={props.socket}
            getData={getScoreBoard}
            sortFunction={compareScores}
            userList={props.userList}
            user={props.user}
          />
        </div>
      )}
    </div>
  );
}

export default SnakeGame;
