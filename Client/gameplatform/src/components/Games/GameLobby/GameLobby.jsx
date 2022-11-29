import React, { useState, useEffect } from "react";
import "./GameLobby.css";
import { TextareaAutosize, TextField } from "@mui/material";
import CustomChat from "./CustomChat/CustomChat";

// const socket = io(URL);

const handleClick = (t) => {
  console.log(t);
  // socket.emit("message", t);
};

function GameLobby(props) {
  const [text, setText] = useState("init");
  const [user, setUser] = useState(props.user);
  const [userList, setUserList] = useState(props.userList);

  useEffect(() => {
    setUser(props.user);
    setUserList(props.userList);
  }, []);
  //   socket.on("message", (text) => {
  //     setText(text);
  //   });
  return (
    <div className="lobby-wrapper">
      <CustomChat user={props.user} SOCKET={props.SOCKET} userList={userList} />
    </div>
  );
}

export default GameLobby;
