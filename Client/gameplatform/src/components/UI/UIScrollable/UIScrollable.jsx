import React, { useState, useEffect } from "react";
// import GameLobby from "../../Games/GameLobby/GameLobby";
import "./UIScrollable.css";
import CustomButton from "../CustomButton/CustomButton";

function UIScrollable(props) {
  const [user, setUser] = useState(props.user);
  const [gameList, setGameList] = useState(props.contentList);

  useEffect(() => {
    setUser(props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (id) =>{
    props.handleClick(id);
  }

  const contentList = () => {
    return gameList.map((c) => (
      <ul className="content-list">
          <CustomButton content={c} onClick = {handleClick} id = {gameList.indexOf(c)}/>
      </ul>
    ));
  };

  return (
    <div className="main">
      <div className="content-list-wrapper">{contentList()}</div>
    </div>
  );
}

export default UIScrollable;
