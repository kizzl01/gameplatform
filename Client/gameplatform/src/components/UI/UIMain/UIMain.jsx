/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import SocketIOClient from "socket.io-client";
import GameTicTacToe from "../../Games/TicTacToe/GameTicTacToe";
import UserInput from "../UserInput/UserInput";
import "./UIMain.css";
import UIScrollable from "../UIScrollable/UIScrollable.jsx";
import SnakeGame from "../../Games/Snake/SnakeGame.jsx";
import GameLobby from "../../Games/GameLobby/GameLobby.jsx";
import { Button } from "@mui/material";

function Main() {
  const [user, setUser] = useState(null);
  const [contentItem, setContentItem] = useState(null);
  const [userList, setUserlist] = useState(null);

  useEffect(() => {
    // const socket = SocketIOClient(ENDPOINT);
    // socket.on("FromAPI", (data) => {
    //   console.log("got time: ", data);
    // });

    window.addEventListener("beforeunload", alertuser);
    return () => {
      window.removeEventListener("beforeunload", alertuser);
    };
  }, []);

  const alertuser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleClick = (i) => {
    setContentItem(i);
  };

  const handleUserLogon = (u) => {
    setUser(u);
  };

  const contents = [
    <GameTicTacToe key="Tic Tac Toe" />,
    <SnakeGame key="Snake" user={user} />,
    <GameLobby key="GameLobby" />,
  ];

  const handleBackButton = () => {
    setContentItem(null);
  };

  const content = contents[contentItem];
  return (
    <div className="root-wrapper" style={{ height: "100%", width: "100%" }}>
      {!user && <UserInput onAccept={handleUserLogon} />}
      {user && !content && (
        <UIScrollable handleClick={handleClick} contentList={contents} />
      )}
      {user && content && (
        <div>
          <div>
            <Button variant="contained" onClick={handleBackButton}>
              Zurück
            </Button>
          </div>
          <div>{content}</div>
        </div>
      )}
    </div>
  );
}

export default Main;
