import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";

export default function GameLobby(props) {
  const socket = props.socket;
  const [lobbyList, setLobbyList] = useState(null);

  useEffect(() => {
    socket.emit("getLobbyList");
    socket.on("receiveLobbyList", (lobby) => {
      console.log(`received LobbyList ${lobby}`);
      setLobbyList(lobby);
    });
  }, [lobbyList]);

  const handleNewLobbyClick = () => {
    console.log("new Button clicked");
  };

  const handleJoinButtonClick = () => {
    console.log("join button clicked");
  };

  return (
    <div className="game-lobby-wrapper">
      <Button variant="contained" onClick={handleNewLobbyClick} size="medium">
        New
      </Button>
      <Button variant="contained" onClick={handleJoinButtonClick} size="medium">
        Join
      </Button>
    </div>
  );
}
