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

const userList = new Array();
const chatMessages = new Array();

const UserInList = (data, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].user === n) return true;
  }
  return false;
};

const readUserlist = () => {
  let userList;
  fs.readFile(USERLISTPATH, "utf-8", function (err, data) {
    console.log("reading userlist: ", data);
    userList = data;
  });
  console.log("read userlist", userList);
  return userList;
};

const writeUserList = (userList) => {
  fs.writeFile(USERLISTPATH, userList, (err) => {
    if (err) {
      console.log(err);
    }
    io.emit("updateUserList", userList);
  });
};

const logOnUser = (u, i) => {
  if (UserInList(userList, u)) return 0;
  const newUser = { user: u, id: i };
  userList.push(newUser);
  console.log("logged on User", newUser);
  console.log(userList);
  io.emit("loginSuccess", u);
  io.emit("updateUserList", userList);
  return 1;
};

const buildChatMessage = (m, u) => {
  const newMessage = `${u}: ${m}`;
  // chatMessages.push(newMessage);
  return newMessage;
};

const logOfUser = (i) => {
  if (userList.findIndex((x) => x.id === i) > -1)
    userList.splice(
      userList.findIndex((x) => x.id === i),
      1
    );
  console.log(userList);
  io.emit("updateUserList", userList);
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
  // fs.readFile(USERLISTPATH, "utf-8", function (err, data) {
  //   res.end(data);
  // });
  // res.end(userList);
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

app.post("/loginUser", (req, res) => {
  const response = "failed";
  console.log(req.body);
  if (logOnUser(req.body)) {
    response = "success";
    io.emit("updateUserList", userList);
  }
  res.end(response);
});

io.on("connection", (socket) => {
  const id = socket.id;
  console.log("client connected", id);
  socket.on("disconnect", (reason) => {
    console.log("socket event disconnect fired for id", id);
    logOfUser(id);
  });

  socket.on("userlogon", (user) => {
    logOnUser(user, id);
  });

  socket.on("sendmessage", (message, user) => {
    console.log(`received message ${message} from user ${user}`);
    io.emit("sendmessage", buildChatMessage(message, user));
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
