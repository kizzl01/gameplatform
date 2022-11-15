import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { StyledEngineProvider } from "@mui/material";
import "./BasicTabs.css";

function BasicTabs(props) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <StyledEngineProvider>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={(e, v) => {
              props.onClick(v);
              handleChange(e, v);
            }}
            aria-label="basic tabs example"
            orientation="vertical"
            visibleScrollbar={false}
          >
            <Tab label="Tic Tac Toe" />
            <Tab label="Snake" />
            <Tab label="Game 3" />
          </Tabs>
        </Box>
      </Box>
    </StyledEngineProvider>
  );
}

export default BasicTabs;
