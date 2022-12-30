import React, { useState, useEffect } from "react";
import "./ChatRoom.css";
import CustomChat from "./CustomChat/CustomChat";


function ChatRoom(props) {
  const [chatArray, setChatArray] = useState(null);

  useEffect(() => {
    props.socket.on("sendmessage", (message) => {
      addChatMessage(message);
    });
  }, [chatArray]);

  const addChatMessage = (message) => {
    if (chatArray === null) {
      const newChat = new Array([message]);
      setChatArray(newChat);
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

export default ChatRoom;
