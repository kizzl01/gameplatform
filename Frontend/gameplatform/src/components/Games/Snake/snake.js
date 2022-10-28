import React from "react";
import "./snake.css";
import * as phone from "./Phone.jpg";
import { Button } from "@mui/material";

// Class representing the game
class Game {
  // Build a new game with the given pixel width and height
  constructor(width, height, obj) {
    console.log("game constructor ");
    // At the beginnig, no movement is set, the game is paused
    this.nextMove = undefined;
    this.alreadyMoved = false;
    this.width = width;
    this.height = height;
    this.tileWidth = width / 60;
    this.tileHeight = height / 60;
    // Initialize a 1 sized snake at the center of the game board
    this.snake = new Array([
      Math.round(this.width / (2 * this.tileWidth)),
      Math.round(this.height / (2 * this.tileHeight)),
    ]);
    this.food = undefined;
    this.gameover = false;
    this.scoreHtmlElmt = document.getElementById("score");
    this.addFood();
  }

  // Callback function called when a keyboard key
  // is pushed down
  keyDown(e) {
    //Get the pause popup div
    // var popup = document.getElementById("pausePopup");
    switch (e.key) {
      case "a":
        if (this.nextMove !== "right" && !this.alreadyMoved) {
          this.nextMove = "left";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowLeft":
        if (this.nextMove !== "right" && !this.alreadyMoved) {
          this.nextMove = "left";
          this.alreadyMoved = true;
        }
        break;
      case "w":
        if (this.nextMove !== "down" && !this.alreadyMoved) {
          this.nextMove = "up";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowUp":
        if (this.nextMove !== "down" && !this.alreadyMoved) {
          this.nextMove = "up";
          this.alreadyMoved = true;
        }
        break;
      case "d":
        if (this.nextMove !== "left" && !this.alreadyMoved) {
          this.nextMove = "right";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowRight":
        if (this.nextMove !== "left" && !this.alreadyMoved) {
          this.nextMove = "right";
          this.alreadyMoved = true;
        }
        break;
      case "s":
        if (this.nextMove !== "up" && !this.alreadyMoved) {
          this.nextMove = "down";
          this.alreadyMoved = true;
        }
        break;
      case "ArrowDown":
        if (this.nextMove !== "up" && !this.alreadyMoved) {
          this.nextMove = "down";
          this.alreadyMoved = true;
        }
        break;
      case " ":
        this.nextMove = undefined;
        this.alreadyMoved = false;
        break;
      default:
        // Do nothing just ignore it
        break;
    }
  }

  // Add a food somewhere in the game (randomly)
  addFood() {
    console.log("add food");
    var x = Math.floor(Math.random() * 60);
    var y = Math.floor(Math.random() * 60);
    console.log("loaction " + x, y);
    for (var i = 0; i < this.snake.length; i++) {
      var xy = this.snake[i];

      if (xy[0] === x && xy[1] === y) {
        return this.addFood();
      }
    }

    this.food = [x, y];
  }

  // Update the game state with the next move
  update = (callback, arg) => {
    if (this.gameover) return;
    this.alreadyMoved = false;
    let newHead = this.snake[0].slice();
    switch (this.nextMove) {
      case undefined:
        return;
      case "left":
        newHead[0] -= 1;
        break;
      case "up":
        newHead[1] -= 1;
        break;
      case "right":
        newHead[0] += 1;
        break;
      case "down":
        newHead[1] += 1;
        break;
      default:
    }

    // Game Over If snake is going out ouf the game
    if (newHead[0] < 0) {
      this.gameover = true;
      newHead[0] = 0;
    } else if (newHead[0] >= Math.round(this.width / this.tileWidth)) {
      this.gameover = true;
      newHead[0] = Math.round(this.width / this.tileWidth) - 1;
    }
    if (newHead[1] < 0) {
      this.gameover = true;
      newHead[1] = 0;
    } else if (newHead[1] >= Math.round(this.height / this.tileHeight)) {
      this.gameover = true;
      newHead[1] = Math.round(this.height / this.tileHeight) - 1;
    }

    if (this.gameover) {
      console.log("gameover call");
      return;
    }

    //Check if next move is on some food
    if (newHead[0] === this.food[0] && newHead[1] === this.food[1]) {
      // Move food to another place
      //This place must not be somewhere on the snake
      this.addFood();
    } else {
      this.snake.pop(); //Don't grow the snake
    }
    // Push the snake's new head position
    this.snake.unshift(newHead);
    // Game Over If snake bites itself
    for (var i = 1; i < this.snake.length; i++) {
      if (newHead[0] === this.snake[i][0] && newHead[1] === this.snake[i][1]) {
        this.gameover = true;
        return;
      }
    }
    callback(arg);
  };

  drawSnakeAndFood = (ctx) => {
    for (let i = 0; i < this.snake.length; i++) {
      const xy = this.snake[i].slice();
      // console.log(xy);
      ctx.fillRect(
        xy[0] * this.tileWidth,
        xy[1] * this.tileHeight,
        this.tileWidth,
        this.tileHeight
      );
    }

    // Draw the food
    const food = new Image();
    food.src = phone.default;
    ctx.drawImage(
      food,
      this.food[0] * this.tileWidth,
      this.food[1] * this.tileHeight - food.height / 4
    );
  };

  initGameBoard = (ctx) => {
    // this.addFood();
    this.drawSnakeAndFood(ctx);
  };

  // Draw / render the current game state
  render = (ctx) => {
    // Clear the screen
    ctx.clearRect(0, 0, this.width, this.height);

    // Update score HTML element
    this.scoreHtmlElmt.textContent = this.snake.length - 1;

    // Draw the borders
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, this.width, this.height);
    // Draw the snake
    ctx.fillStyle = "white";
    this.drawSnakeAndFood(ctx);
    //GameOver
    if (this.gameover) {
      console.log(this.gameover);
      document.querySelector("#restart").classList.remove("hide");
      ctx.font = "48px serif";
      ctx.fillStyle = "black";
      var displayGameOver = "GAME OVER";
      var text = ctx.measureText(displayGameOver);
      ctx.fillText(
        displayGameOver,
        (this.width - text.width) / 2,
        this.height / 2
      );
      // return;

      // Quick restart on key down
      document.onkeydown = function () {
        restart();
      };
    }
  };
  restart() {}
}

const start = (obj) => {
  console.log("started with: ", obj);
  let canvas = document.getElementById("game");
  let game = new Game(canvas.width, canvas.height, obj);
  obj.setState({ isFinished: false });
  document.onkeydown = (e) => {
    game.keyDown(e);
  };
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.initGameBoard(ctx);
  loop(game, ctx, obj);
};

const loop = (game, ctx, obj) => {
  if (game.gameover) {
    obj.setState({ isFinished: true });
    // game.scoreHtmlElmt.textContent = "restart";
    return;
  }
  game.update(game.render, ctx);
  // every 5 food eaten, increase spead by 10 ms
  var snakeFastIndex = Math.floor(game.snake.length / 5);
  if (snakeFastIndex === 0) {
    var speed = 80;
  } else {
    // if speed should be faster to 30 ms, keep it to 30 ms, so the player can still play
    if (snakeFastIndex > 5) {
      speed = 30;
    } else {
      speed = 80 - 10 * snakeFastIndex;
    }
  }
  setTimeout(() => {
    loop(game, ctx, obj);
  }, speed);
};

function restart(obj) {
  start(obj);
  console.log("restart");
}

export default class Snake extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFinished: false,
    };
  }
  componentDidMount() {
    start(this);
  }

  handleClick = () => {
    restart(this);
  };

  render() {
    const { isFinished } = this.state;
    return (
      <div className="snake-game">
        <div className="panel">
          <canvas id="game" height={550} width={550}></canvas>
        </div>
        <div className="score-panel">
          <Button
            id="restart-button"
            variant="contained"
            disabled={!isFinished}
            onClick={this.handleClick}
          >
            Restart
          </Button>
          <font color="white">
            Score:
            <span id="score">0</span>
          </font>
        </div>
      </div>
    );
  }
}
