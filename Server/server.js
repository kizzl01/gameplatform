const express = require("express");
const http = require("http");
const fspromise = require("fs/promises");
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

const SnakeHighScores = async () => {
  const data = await fspromise.readFile(SNAKESCOREBOARDPATH, {
    encoding: "utf8",
  });
  return JSON.parse(data);
};

const liveScores = async () => {
  const highscoreboard = await SnakeHighScores();
  const livescores = highscoreboard.map((x) => ({
    user: x.name,
    livescore: null,
  }));
  // console.log(livescores);
  return livescores;
};

const WriteNewHighScores = (newScoreboard) => {
  fs.writeFile(SNAKESCOREBOARDPATH, JSON.stringify(newScoreboard), (err) => {
    if (err) {
      console.log(err);
    }
    io.emit("updateScoreboard", newScoreboard);
  });
};

function compareScores(a, b) {
  if (a.score < b.score) {
    return 1;
  }
  if (a.score > b.score) {
    return -1;
  }
  return 0;
}

const ExistingUser = (data, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === n) return true;
  }
  return false;
};

const checkHighScoreBoardLength = (board) => {
  if (board.length < 11) return;
  board.pop();
};

const EnterNewScore = async (user, s) => {
  let Scoreboard = await SnakeHighScores();
  if (!ExistingUser(Scoreboard, user)) {
    Scoreboard.push({ name: user, score: s });
  } else if (
    Scoreboard[Scoreboard.findIndex((x) => x.name === user)].score < s
  ) {
    Scoreboard[Scoreboard.findIndex((x) => x.name === user)].score = s;
  }
  Scoreboard = Scoreboard.sort(compareScores);
  checkHighScoreBoardLength(Scoreboard);
  WriteNewHighScores(Scoreboard);
};

const UserInList = (data, n) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].user === n) {
      console.log(`user ${data[i].user} already in list`);
      return true;
    }
  }
  return false;
};

const updateLiveScoreBoard = (livescore) => {
  for (let i = 0; i < liveScores.length; i++) {
    if (liveScores[i].user !== livescore.user) continue;
    console.log(
      `writing new livescore ${livescore.livescore} for user ${liveScores[i].user}`
    );
    liveScores[i].livescore = livescore.livescore;
    return;
  }
  liveScores.push(livescore);
};

const logOnUser = (u, i) => {
  if (UserInList(userList, u)) return 0;
  const newUser = { user: u, id: i };
  userList.push(newUser);
  io.emit("loginSuccess", u);
  io.emit("updateUserList", userList);
  return 1;
};

const logOfUser = (id) => {
  for (let i = userList.length - 1; i > -1; i--) {
    if (userList[i].id !== id) {
      continue;
    }
    userList.splice(i, 1);
  }
  io.emit("updateUserList", userList);
};

const buildChatMessage = (m, u) => {
  return `${u}: ${m}`;
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

app.get("/getLiveScores", async function (req, res) {
  res.end(JSON.stringify(await liveScores()));
});

app.post("/postSnakeScore", (req, res) => {
  const user = req.body.user;
  const newScore = req.body.score;
  console.log(`user ${user} score ${newScore}`);
  if (!user || !newScore) {
    res.end("post unsuccessful");
    console.log("post failed");
    return;
  }
  EnterNewScore(user, newScore);
  res.end("score successfully posted");
});

app.post("/loginUser", (req, res) => {
  const response = "failed";
  if (logOnUser(req.body)) {
    response = "success";
    io.emit("updateUserList", userList);
  }
  res.end(response);
});

io.on("connection", (socket) => {
  const id = socket.id;
  socket.on("disconnect", (reason) => {
    console.log(`socket ${id} disconnected`);
    logOfUser(id);
    console.log(`logged on users: ${JSON.stringify(userList)}`);
  });

  socket.on("userlogon", (user) => {
    logOnUser(user, id);
    console.log(`logged on users: ${JSON.stringify(userList)}`);
  });

  socket.on("sendmessage", (message, user) => {
    io.emit("sendmessage", buildChatMessage(message, user));
  });

  socket.on("liveScore", (liveScore) => {
    // updateLiveScoreBoard(liveScore);
    io.emit("updateLiveScores", liveScore);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
