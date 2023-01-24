import React, { useEffect, useState } from "react";
import ScoreBoard from "../ScoreBoard/ScoreBoard";

export default function LiveScoreboard(props) {
  const [scoreBoard, setScoreboard] = useState(props.data);
  const socket = props.socket;

  useEffect(() => {
    socket.on("updateLiveScores", (liveScore) => {
      console.log("server message: getting livescore", liveScore);
      handleLiveScore(liveScore);
    });
    socket.on("updateScoreboard", (data) => {
      console.log(
        "server message: module livescorebaord updating scoreboard to ",
        data,
      );
      setScoreboard(data);
    });
  }, [props.data]);

  const scoreBoardData = props.data.map((x) => ({
    name: x.name,
    score: x.score,
    livescore: null,
  }));

  const handleLiveScore = (livescore) => {
    const copy = scoreBoardData.slice();
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].name === livescore.user)
        copy[i].livescore = livescore.livescore;
    }
    setScoreboard(copy);
    // scoreBoardData[scoreBoardData.findIndex((x) => x.user === livescore.user)].livescore = livescore.livescore;
    console.log("after handling livescore : ", copy);
  };

  return (
    <ScoreBoard
      data={scoreBoard}
      socket={props.socket}
      getData={props.getScoreBoard}
      sortFunction={props.compareScores}
      userList={props.userList}
      user={props.user}
    />
  );
}
