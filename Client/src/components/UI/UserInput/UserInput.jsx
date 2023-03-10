import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./UserInput.css";

function UserInput(props) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div style={{height:"100vh" ,width:"100vw"}}>
      <div className="user-input">
        <TextField
          id="username"
          label="Nutzername"
          variant="filled"
          onChange={handleChange}
          value={text}
        />
        <Button variant="contained" onClick={() => props.onAccept(text)}>
          Bestätigen
        </Button>
      </div>
    </div>
  );
}

export default UserInput;
