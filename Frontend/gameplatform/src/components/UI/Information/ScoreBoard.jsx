import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
} from "@mui/material";
import React from "react";
import "./ScoreBoard.css";

export default class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    // this.props.getData();
    if(this.props.data){
      this.setState({ data: this.props.data });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {data && (
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.place}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <button onClick={this.postScoreBoard}>post</button>
          </div>
        )}
      </div>
    );
  }
}
