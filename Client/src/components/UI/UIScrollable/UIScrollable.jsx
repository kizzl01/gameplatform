import React from "react";
// import GameLobby from "../../Games/GameLobby/GameLobby";
import "./UIScrollable.css";
import CustomButton from "../CustomButton/CustomButton";

function UIScrollable(props) {

  const handleClick = (id) => {
    props.handleClick(id);
  };

  const contentList = () => {
    return props.contentList.map((c) => (
      <ul className="content-list" key = {c.key}>
        <CustomButton
          content={c}
          onClick={handleClick}
          id={props.contentList.indexOf(c)}
        />
      </ul>
    ));
  };

  return (
    <div className="list-wrapper">
      <div className="content-list-wrapper">{contentList()}</div>
    </div>
  );
}

export default UIScrollable;
