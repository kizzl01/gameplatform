/* eslint-disable react-hooks/exhaustive-deps */
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  tableCellClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./ScoreBoard.css";

export default function ScoreBoard(props) {
  const userList = props.userList;
  const socket = props.socket;

  useEffect(() => {
    // props.getData();
  }, [socket]);

  const isPlayerOnline = (name) => {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].user === name && props.user === name) return 2;
      if (userList[i].user === name) return 1;
    }
    return 0;
  };

  // console.log("new scoreboard data: ", scoreBoardData);

  return (
    <div>
      {props.data && (
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
              {props.data.sort(props.sortFunction).map((row) => (
                <TableRow
                  key={row.name}
                  className={`online-player${isPlayerOnline(row.name)}`}
                >
                  <TableCell component="th" scope="row">
                    {props.data.indexOf(row) + 1}
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
