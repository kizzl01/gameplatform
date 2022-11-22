const express = require("express");
const http = require("http");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const { json } = require("body-parser");
const socketIo = require("socket.io");

const SNAKESCOREBOARDPATH = __dirname + "/data/" + "SnakeHighScores.json";
const PORT = 4001;
const CLIENTURL = "http://localhost:3000";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

app.get("/getScoreboard", function (req, res) {
  fs.readFile(SNAKESCOREBOARDPATH, "utf-8", function (err, data) {
    res.end(data);
  });
});

app.post("/postScoreboard", (req, res) => {
  console.log("request body:", req.body);
  fs.writeFile(SNAKESCOREBOARDPATH, JSON.stringify(req.body), (err) => {
    if (err) {
      console.log(err);
    }
    res.end();
  });
});

let interval;

io.on("connection", (socket) => {
  console.log("new client connected");
  if (interval) {
    clearInterval(interval);
  }
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("client disconnected");
    clearInterval(interval);
  });

  socket.on("message",(message)=>{
    console.log(message);
    io.emit("message",`  ${message}`);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
