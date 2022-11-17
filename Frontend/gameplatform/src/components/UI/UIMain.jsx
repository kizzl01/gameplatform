import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import Snake from "../Games/Snake/snake.js";
import GameTicTacToe from "../Games/TicTacToe/GameTicTacToe";
import ScoreBoard from "./Information/ScoreBoard.jsx";
import BasicTabs from "./Navigation/BasicTabs";
import "./UIMain.css";

function UserInput(props) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="user-input">
      <TextField
        id="username"
        label="Nutzername"
        variant="filled"
        onChange={handleChange}
        value={text}
      />
      <Button variant="contained" onClick={() => props.onAccept(text)}>
        Bestätigen
      </Button>
    </div>
  );
}

function Main() {
  const [user, setUser] = useState(null);
  const [contentItem, setContentItem] = useState(0);
  const [HighScores, setHighScores] = useState(null);
  const [userList, setUserlist] = useState(null);

  // Kommunikation Server -> Client
  // methode zum daten anfragen per httpget methode. spricht den endpunkt der API an der in der fetch methode angegeben ist
  function compareScores(a, b) {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  }

  const getScoreBoard = () => {
    fetch("https://localhost:44384/api/SnakeScoreBoard", {
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

  const getUserList = () => {
    fetch("https://localhost:44384/api/User", {
      crossDomain: true,
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((e) => e.json())
      .then((e) => {
        setUserlist(e);
      });
    return null;
  }

  // Kommunikation Client -> Server
  // methode zum posten per httppost. spricht den Endpunkt der API an der in der fetch methode angegeben ist

  const postScoreBoard = (data) => {
    data = data.sort(compareScores);
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
    getUserList();
    getScoreBoard();
    window.addEventListener("beforeunload", alertuser);
    return () => {
      window.removeEventListener("beforeunload", alertuser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alertuser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleClick = (i) => {
    setContentItem(i);
    console.log("UserListe: ", userList);
  };

  const handleUserLogon = (u) =>{
    
    setUser(u);
  }

  // Die Methode gibt als Rückgabewert ein Array von Komponenten zurück. Hier werden die einzelnen Spiele später eingefügt!

  const contents = () => {
    const c = [
      <GameTicTacToe />,
      <Snake newScore={(s) => WriteNewHighScores(user, s)} />,
    ];
    return c;
  };

  const ExistingUser = (data, n) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase() === n) return true;
    }
    return false;
  };

  const WriteNewHighScores = (user, s) => {
    const n = user.toLowerCase();
    // const copy = JSON.parse(JSON.stringify(HighScores)); //erstellt eine Echte Kopie eines JSON objektes
    let copy = HighScores.slice(); // erstellt nur eine referenz auf das echte objekt (shallow Copy)
    if (!ExistingUser(copy, n)) {
      HighScores.push({ name: user, score: s });
      copy = HighScores.slice();
    } else if (
      copy[copy.findIndex((x) => x.name.toLowerCase() === n)].score < s
    ) {
      copy[copy.findIndex((x) => x.name.toLowerCase() === n)].score = s;
    }
    copy = copy.sort(compareScores);
    setHighScores(copy);
    postScoreBoard(copy);
  };

  const content = contents()[contentItem];
  return (
    <div className="root-wrapper" style={{ height: "100%", width: "100%" }}>
      {!user && <UserInput onAccept={handleUserLogon} />}
      {user && content !== null && (
        <div className="main-wrapper">
          <div className="navigation-container">
            <BasicTabs onClick={(i) => handleClick(i)} />
          </div>
          <div className="content-container">
            <div className="game-wrapper">
              <div className="game-container">{content}</div>
            </div>
          </div>
          <div className="info-container">
            {content && content.type.name === "Snake" && (
              <ScoreBoard
                data={HighScores}
                getData={getScoreBoard}
                sortFunction={compareScores}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
