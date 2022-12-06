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
  const [chatArray, setChatArray] = useState("test");

  useEffect(() => {
    props.socket.on("sendmessage", (message) => {
      console.log(`received message ${message}will be added to ${chatArray}`);
      addChatMessage(message);
      console.log(`after adding message: ${chatArray}`);
    });
  }, [chatArray]);

  const addChatMessage = (message) => {
    console.log(`adding message to ${chatArray}`);
    if (chatArray === "test") {
      const newChat = new Array([message]);
      console.log(`new Chat: ${newChat}`);
      setChatArray(newChat);
      console.log(`new chat Array: ${chatArray}`);
    } else {
      const chatCopy = [...chatArray];
      chatCopy.push(message);
      setChatArray(chatCopy);
    }
  };

  return (
    <div className="lobby-wrapper">
      <CustomChat
        user={props.user}
        SOCKET={props.socket}
        userList={props.userList}
        chatArray={chatArray}
      />
    </div>
  );
}

export default GameLobby;
