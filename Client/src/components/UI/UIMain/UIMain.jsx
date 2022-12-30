/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import GameTicTacToe from "../../Games/TicTacToe/GameTicTacToe";
import UserInput from "../UserInput/UserInput";
import "./UIMain.css";
import UIScrollable from "../UIScrollable/UIScrollable.jsx";
import SnakeGame from "../../Games/Snake/SnakeGame.jsx";
import ChatRoom from "../../Games/ChatRoom/ChatRoom.jsx";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import io from "socket.io-client";
import { Button } from "@mui/material";
import GameLobby from "../GameLobby/GameLobby";

//0 = johnnys Server, 1 = localhost, 2 = ipadresse windows subysystem linux adapter

const DEVELOPMENTMODE = 1;

function Main() {
  const APIURL = () => {
    switch (DEVELOPMENTMODE) {
      case 0:
        return process.env.REACT_APP_SERVER_API_URL;
      case 1:
        return process.env.REACT_APP_SERVER_API_URL_LOCAL;
      case 2:
        return process.env.REACT_APP_SERVER_API_URL_WSL;
      case 3:
        return process.env.REACT_APP_SERVER_API_URL_LOCALNETWORK;
      default:
        return process.env.REACT_APP_SERVER_API_URL_LOCAL;
    }
  };
  const SOCKETURL = () => {
    switch (DEVELOPMENTMODE) {
      case 0:
        return process.env.REACT_APP_SERVER_WEBSOCKET_URL;
      case 1:
        return process.env.REACT_APP_SERVER_WEBSOCKET_URL_LOCAL;
      case 2:
        return process.env.REACT_APP_SERVER_WEBSOCKET_URL_WSL;
      case 3:
        return process.env.REACT_APP_SERVER_WEBSOCKET_URL_LOCALNETWORK;
      default:
        return process.env.REACT_APP_SERVER_WEBSOCKET_URL_LOCAL;
    }
  };
  const [socket, setSocket] = useState(() => io(SOCKETURL()));
  const [user, setUser] = useState("dev");
  const [contentItem, setContentItem] = useState(null);
  const [userList, setUserList] = useState(null);

  useEffect(() => {
    checkForDevelopment();
    socket.on("updateUserList", (data) => {
      setUserList(data);
    });
    window.addEventListener(
      "keydown",
      function (e) {
        if (
          ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
            e.code
          ) > -1
        ) {
          e.preventDefault();
        }
      },
      false
    );
    window.addEventListener("beforeunload", alertuser);
    return () => {
      window.removeEventListener("beforeunload", alertuser);
    };
  }, []);

  const checkForDevelopment = () => {
    // if (DEVELOPMENTMODE === 1) return;
    setUser(null);
  };

  const alertuser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleClick = (i) => {
    setContentItem(i);
  };

  const handleUserLogon = (u) => {
    socket.emit("userlogon", u);
    socket.on("loginSuccess", (loggedOnUser) => {
      console.log(
        `login succesful for user ${u} with server response ${loggedOnUser}`
      );
      if ((loggedOnUser = u)) setUser(u);
    });
  };

  const contents = [
    <GameTicTacToe
      key="Tic Tac Toe"
      DEVELOPMENTMODE={DEVELOPMENTMODE}
      APIURL={APIURL}
      socket={socket}
    />,
    <SnakeGame
      key="Snake"
      user={user}
      userList={userList}
      DEVELOPMENTMODE={DEVELOPMENTMODE}
      APIURL={APIURL}
      socket={socket}
    />,
    <GameLobby
      key="GameLobby"
      user={user}
      userList={userList}
      socket={socket}
    />,
  ];

  const handleBackButton = () => {
    setContentItem(null);
  };

  const isInLobby = () => {
    if (!contents[contentItem]) return false;
    if (contents[contentItem].key === "Snake") return true;
  };

  const content = contents[contentItem];

  return (
    <div className="root-wrapper" style={{ height: "100%", width: "100%" }}>
      {!user && <UserInput onAccept={handleUserLogon} />}
      {user && !content && (
        <UIScrollable handleClick={handleClick} contentList={contents} />
      )}
      {user && content && (
        <div className="main-wrapper">
          <div className="back-button">
            <Button
              variant="contained"
              onClick={handleBackButton}
              size="medium"
            >
              <ArrowBackIosIcon fontSize="large" />
            </Button>
          </div>
          <div className="content-container">
            {content}
            {isInLobby() && (
              <div className="chat-window-div">
                <ChatRoom
                  key="GameLobby"
                  DEVELOPMENTMODE={DEVELOPMENTMODE}
                  APIURL={APIURL}
                  socket={socket}
                  user={user}
                  userList={userList}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
