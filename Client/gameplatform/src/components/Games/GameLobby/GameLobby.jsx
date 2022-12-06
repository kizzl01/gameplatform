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

  useEffect(() => {
  }, []);
  //   socket.on("message", (text) => {
  //     setText(text);
  //   });
  return (
    <div className="lobby-wrapper">
      <CustomChat user={props.user} SOCKET={props.SOCKET} userList={props.userList} />
    </div>
  );
}

export default GameLobby;
