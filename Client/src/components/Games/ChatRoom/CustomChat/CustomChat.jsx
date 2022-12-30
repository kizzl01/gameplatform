import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { FixedSizeList } from "react-window";
import "./CustomChat.css";

function CustomChat(props) {
  const [text, setText] = useState(null);
  const socket = props.SOCKET;
  const textArea = document.getElementById("chat-output-div");
  const messageDiv = document.getElementById("message-div");

  useEffect(() => {}, []);

  const handleChange = (e) => {
    socket.emit("userTyping");
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key !== "Enter") return;
    e.target.value = "";
    textArea.scrollTop = textArea.scrollHeight + 48;
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
    if (props.chatArray !== null) {
      // return props.chatArray.map((message) => (
      //   <ListItem key={message}>
      //     <ListItemText primary={`${message}`} />
      //   </ListItem>
      // ));
      return props.chatArray.map((message) => (
        <div className="message-div" id="message-div">
          <ListItem key={message}>
            <ListItemText primary={`${message}`} />
          </ListItem>
        </div>
      ));
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-text-fields">
        <div className="chat-output-div">
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              padding: 0,
              overflow: "auto",
              maxHeight: "100%",
              "& ul": { padding: 0 },
            }}
            id="chat-output-div"
          >
            {renderChatMessages()}
          </List>
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
