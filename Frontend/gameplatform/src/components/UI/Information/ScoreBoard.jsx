import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  tableCellClasses,
} from "@mui/material";
import React from "react";
import "./ScoreBoard.css";

export default class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: null,
    };
  }

  componentDidMount() {
    if (this.props.data) {
      const { data } = this.props;
      this.setState({ rows: data });
    }
  }

  render() {
    const { rows } = this.state;
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
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.sort(this.props.sortFunction).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {rows.indexOf(row)+1}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}
