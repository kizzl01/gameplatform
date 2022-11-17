const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const bodyParser = require("body-parser");
const SNAKESCOREBOARDPATH = __dirname + "/data/" + "SnakeHighScores.json";
const cors = require("cors");

const port = 4001;
const index = require("./routes/index");
const { json } = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin:["http://localhost:3000","https://localhost:3000"],
  methods : ["GET","POST"]
}))

const server = http.createServer(app);

const io = socketIo(server);

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. will be consumed by the client
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
    res.end()
  });
});

let interval;

io.on("connection", (socket) => {
  console.log("new client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
