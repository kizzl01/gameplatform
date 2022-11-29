/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import GameTicTacToe from "../../Games/TicTacToe/GameTicTacToe";
import UserInput from "../UserInput/UserInput";
import "./UIMain.css";
import UIScrollable from "../UIScrollable/UIScrollable.jsx";
import SnakeGame from "../../Games/Snake/SnakeGame.jsx";
import GameLobby from "../../Games/GameLobby/GameLobby.jsx";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SocketIOClient from "socket.io-client";
import { Button } from "@mui/material";

//0 = johnnys Server, 1 = localhost, 2 = ipadresse windows subysystem linux adapter

const DEVELOPMENTMODE = 2;

function Main() {
  const [user, setUser] = useState("dev");
  const [contentItem, setContentItem] = useState(null);
  const [userList, setUserList] = useState(null);

  const APIURL = () => {
    switch (DEVELOPMENTMODE) {
      case 0:
        return process.env.REACT_APP_SERVER_API_URL;
      case 1:
        return process.env.REACT_APP_SERVER_API_URL_LOCAL;
      case 2:
        return process.env.REACT_APP_SERVER_API_URL_WSL;
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
      default:
        return process.env.REACT_APP_SERVER_WEBSOCKET_URL_LOCAL;
    }
  };

  const socket = SocketIOClient(SOCKETURL());

  useEffect(() => {
    checkForDevelopment();
    getUserList();
    socket.on("updateUserList", (data) => {
      console.log("server said: update user list to: ", data);
      setUserList(data);
    });
    return()=>{
      socket.emit("userlogoff", user);
    }
  }, []);

  const UserInList = (data, n) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].user.toLowerCase() === n.toLowerCase()) return true;
    }
    return false;
  };

  const getUserList = () => {
    fetch(`${APIURL()}getUserList`, {
      crossDomain: true,
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((e) => e.json())
      .then((e) => {
        setUserList(e);
        console.log(e);
      });
    return null;
  };

  const postUserList = (data) => {
    const requestOptions = {
      crossDomain: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(`${APIURL()}postUserList`, requestOptions);
  };

  const checkForDevelopment = () => {
    // if (DEVELOPMENTMODE === 1) return;
    setUser(null);
    window.addEventListener("beforeunload", alertuser);
    return () => {
      window.removeEventListener("beforeunload", alertuser);
    };
  };

  const alertuser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleClick = (i) => {
    setContentItem(i);
  };

  const addUserToUserList = (u) => {
    if (UserInList(userList, u)) return;
    userList.push({ user: u });
    console.log("added user to userlist");
  };

  const handleUserLogon = (u) => {
    setUser(u);
    socket.emit("userlogon",u);
    addUserToUserList(u);
  };

  const contents = [
    <GameTicTacToe
      key="Tic Tac Toe"
      DEVELOPMENTMODE={DEVELOPMENTMODE}
      APIURL={APIURL}
      SOCKET={socket}
    />,
    <SnakeGame
      key="Snake"
      user={user}
      DEVELOPMENTMODE={DEVELOPMENTMODE}
      APIURL={APIURL}
      SOCKET={socket}
    />,
    <GameLobby
      key="GameLobby"
      DEVELOPMENTMODE={DEVELOPMENTMODE}
      user={user}
      APIURL={APIURL}
      SOCKET={socket}
      userList={userList}
    />,
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
        <div className="main-wrapper">
          <Button variant="contained" onClick={handleBackButton} size="medium">
            <ArrowBackIosIcon fontSize="large" />
          </Button>
          <div className="content-container">{content}</div>
        </div>
      )}
    </div>
  );
}

export default Main;
