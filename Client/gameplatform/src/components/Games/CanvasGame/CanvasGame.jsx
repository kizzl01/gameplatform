import React, { useState, useEffect } from "react";
import "./CanvasGame.css";

function CanvasGame() {
  return (
    <div className="canvas-game-container">
      <canvas id="canvas-game" height={"100%"} width={"100%"}></canvas>
    </div>
  );
}

export default CanvasGame;
