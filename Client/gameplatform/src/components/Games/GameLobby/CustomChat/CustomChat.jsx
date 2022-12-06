import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import "./CustomChat.css";

function CustomChat(props) {
  const [text, setText] = useState(null);
  const [chatArray, setChatArray] = useState([]);
  const socket = props.SOCKET;

  useEffect(() => {
    socket.on("receivemessage", (chatlog) => {
      console.log(`received message ${chatlog} from server`);
    });
  }, []);

  const sendChatmessage = () => {};

  const handleChange = (e) => {
    socket.emit("userTyping");
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key !== "Enter") return;
    console.log("message sent", text);
    e.target.value = "";
    socket.emit("sendmessage", text, props.user);
  };

  const renderUsers = () => {
    if (props.userList)
      return props.userList.map((u) => (
        <ListItem key={u.id}>
          <ListItemText
            primary={
              !!(props.user === u.user) ? `${u.user} (you)` : `${u.user}`
            }
          />
        </ListItem>
      ));
  };

  const renderChatMessages = () => {
    if (chatArray) {
      console.log(`rendering chatArray ${chatArray}`);
      return chatArray.map((message) => (
        <ListItem key={message}>
          <ListItemText primary={`${message}`} />
        </ListItem>
      ));
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-text-fields">
        <div className="chat-output-div">
          <List>{renderChatMessages()}</List>
        </div>
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
      <div className="chat-users-div">
        <List>{renderUsers()}</List>
      </div>
    </div>
  );
}

export default CustomChat;
