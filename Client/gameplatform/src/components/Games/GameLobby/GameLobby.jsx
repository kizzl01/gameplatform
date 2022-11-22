import React, { useState } from "react";
import { io } from "socket.io-client";
import UserInput from "../../UI/UserInput/UserInput";
const URL = process.env.REACT_APP_SERVER_WEBSOCKET_URL;

// const socket = io(URL);

const handleClick = (t) => {
  console.log(t);
  // socket.emit("message", t);
};

function GameLobby() {
  const [text, setText] = useState("init");
//   socket.on("message", (text) => {
//     setText(text);
//   });
  return (
    <div>
      <UserInput onAccept={(t) => handleClick(t)} />
      <h1>{text}</h1>
    </div>
  );
}

export default GameLobby;
