import React, { useState } from "react";
import GameTicTacToe from "../Games/GameTicTacToe/GameTicTacToe";
import BasicTabs from "./Navigation/NavigationBar";
import Tabs from '@mui/material/Tabs';
import "./UIMain.css";

function Main() {
  return (
    <div className="main-wrapper">
      <div className="navigation-bar">
        <BasicTabs />
      </div>
      <div className="content-part">
        <div className="game-wrapper">
          <div className="tictactoe-board">
            <GameTicTacToe />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
