/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./CustomButton.css";

function CustomButton(props) {
  const [text, setText] = useState(props.content.key);
  const [id, setId] = useState(props.id);

  const handleClick = () =>{
    props.onClick(id);
  }
  
  return (
    <div className="content-button" onClick={handleClick}>
      <h1>{text}</h1>
    </div>
  );
}

export default CustomButton;
