/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ScoreBoard from "../../UI/ScoreBoard/ScoreBoard";
import Snake from "./snake";
const APIURL = process.env.REACT_APP_SERVER_API_URL;
const APIURLLOCAL = process.env.REACT_APP_SERVER_API_URL_LOCAL;

function SnakeGame(props) {
  const [HighScores, setHighScores] = useState(null);
  const [user, setUser] = useState(props.user);

  useEffect(() => {
    getScoreBoard();
  }, []);

  const getScoreBoard = () => {
    fetch(`${APIURL}getScoreboard`, {
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

  const postScoreBoard = (data) => {
    data = data.sort(compareScores);
    const requestOptions = {
      crossDomain: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(`${APIURL}postScoreboard`, requestOptions);
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

  const WriteNewHighScores = (user, s) => {
    const n = user.toLowerCase();
    let copy = HighScores.slice();
    
    if (!ExistingUser(copy, n)) {
      HighScores.push({ name: user, score: s });
      copy = HighScores.slice();
    } else if (
      copy[copy.findIndex((x) => x.name.toLowerCase() === n)].score < s
    ) {
      copy[copy.findIndex((x) => x.name.toLowerCase() === n)].score = s;
    }
    
    copy = copy.sort(compareScores);
    checkHighScoreBoardLength(copy);
    postScoreBoard(copy);
    setHighScores(copy);
  };

  const checkHighScoreBoardLength=(board)=>{
    if(board.length<11) return;
    board.pop();
  }

  const ExistingUser = (data, n) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase() === n) return true;
    }
    return false;
  };

  return (
    <div className="main-wrapper">
      <div className="game-wrapper">
        <div className="game-container">
          <Snake newScore={(s) => WriteNewHighScores(user, s)} />
        </div>
      </div>
      {HighScores && (
        <div className="info-container">
          <ScoreBoard
            data={HighScores}
            getData={getScoreBoard}
            sortFunction={compareScores}
          />
        </div>
      )}
    </div>
  );
}

export default SnakeGame;
