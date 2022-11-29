import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import SocketIOClient, { Socket } from "socket.io-client";
import "./CustomChat.css";

function CustomChat(props) {
  const [user, setUser] = useState(props.user);
  const [userList, setUserList] = useState(null);
  const [text, setText] = useState(null);

  const socket = props.SOCKET;

  useEffect(() => {
    setUser(props.user);
  }, []);

  const sendChatmessage = () => {};

  const handleChange = (e) => {
    socket.emit("userTyping");
    console.log(e.target.value);
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key !== "Enter") return;
    socket.emit("sendmessage", text);
  };

  return (
    <div className="chat-room">
      <div className="chat-text-fields">
        <div className="chat-output-div"></div>
        <div className="chat-input-div">
          <TextField
            id="chat-input"
            label="Chat"
            fullWidth
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
      <div className="chat-users-div"></div>
    </div>
  );
}

export default CustomChat;
