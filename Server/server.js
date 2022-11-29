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
const USERLISTPATH = __dirname + "/data/" + "UserList.json";
const PORT = 4001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

var userList = new Array();

const UserInList = (data, n) => {
  for (let i = 0; i < data.length; i++) {
    console.log(data);
    if (data[i].user === n) return true;
  }
  return false;
};

const readUserlist = () => {
  fs.readFile(USERLISTPATH, "utf-8", function (err, data) {
    userList = Array(data);
  });
};

const writeUserList = () => {
  fs.writeFile(USERLISTPATH, userList, (err) => {
    if (err) {
      console.log(err);
    }
    io.emit("updateUserList", userList);
  });
};

const logOnUser = (u) => {
  if (UserInList(userList, u)) return;
  // userList.push({ user: u });
  writeUserList();
  io.emit("message", `User ${u} logged on`);
  console.log("logonuser finished", userList);
};

const logOfUser = (u) => {
  if (!UserInList(userList, u)) return;
  userList.splice(userList.indexOf({ user: u }));
  writeUserList();
  console.log(userList);
};

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.get("/getScoreboard", function (req, res) {
  fs.readFile(SNAKESCOREBOARDPATH, "utf-8", function (err, data) {
    res.end(data);
  });
});

app.post("/postScoreboard", (req, res) => {
  fs.writeFile(SNAKESCOREBOARDPATH, JSON.stringify(req.body), (err) => {
    if (err) {
      console.log(err);
    }
    console.log("client posted a scoreboard:", req.body);
    io.emit("updateScoreboard", req.body);
    res.end();
  });
});

app.get("/getUserList", function (req, res) {
  fs.readFile(USERLISTPATH, "utf-8", function (err, data) {
    res.end(data);
  });
});

app.post("/postUserList", (req, res) => {
  console.log("posting Userlist", req.body);
  fs.writeFile(USERLISTPATH, JSON.stringify(req.body), (err) => {
    if (err) {
      console.log(err);
    }
    io.emit("updateUserList", req.body);
    res.end();
  });
});

let interval;

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // console.log("client disconnected");
    clearInterval(interval);
  });

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", `  ${message}`);
  });

  socket.on("userlogon", (user) => {
    readUserlist();
    console.log("user logged on ", user);
    logOnUser(user);
    io.emit("userList", userList);
  });

  socket.on("userlogoff", (user) => {
    readUserlist();
    logOfUser(user);
    io.emit("userList", userList);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
