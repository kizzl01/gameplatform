/* eslint-disable react-hooks/exhaustive-deps */
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  tableCellClasses,
} from "@mui/material";
import React, { useEffect } from "react";
import "./ScoreBoard.css";

export default function ScoreBoard(props) {
  const rows = props.data;
  const userList = props.userList;
  const socket = props.socket;
  const liveScores = props.liveScores;

  useEffect(() => {
    props.getData();
    socket.on("updateLiveScores", (liveScore) => {
      console.log(
        `got livescoreboard from server ${liveScore.livescore} for user ${liveScore.user}`
      );
      handleLiveScore(liveScore);
    });
  }, [socket]);

  const scoreBoardData = () => {
    const combinedArray = [];
    for (let i = 0; i < rows.length; i++) {
      combinedArray.push({
        name: rows[i].name,
        score: rows[i].score,
        livescore: null,
          // liveScores[liveScores.findIndex((x) => x.user === rows[i].name)]
          //   .livescore null,

      });
    }
    // console.log("new combined Array : ", combinedArray);
    return combinedArray;
  };

  const isPlayerOnline = (name) => {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].user === name && props.user === name) return 2;
      if (userList[i].user === name) return 1;
    }
    return 0;
  };

  const handleLiveScore = (livescore) => {
    for (let i = 0; i < liveScores.length; i++) {
      if (liveScores[i].user !== livescore.user) continue;
      liveScores[i].livescore = livescore.livescore;
    }
    console.log("new scoreboard : ", scoreBoardData());
  };

  console.log("scoreboard got livescores :", liveScores);

  return (
    <div>
      {rows && (
        <div>
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                border: "1px rgba(29, 29, 27, 0.15) solid",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
              },
              "&:last-child td, &:last-child th": { border: 0 },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Player</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Live</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreBoardData()
                .sort(props.sortFunction)
                .map((row) => (
                  <TableRow
                    key={row.name}
                    className={`online-player${isPlayerOnline(row.name)}`}
                  >
                    <TableCell component="th" scope="row">
                      {rows.indexOf(row) + 1}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.score}</TableCell>
                    <TableCell id={`livescore-${row.name}`}>
                      {row.livescore}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
