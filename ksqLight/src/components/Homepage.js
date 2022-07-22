import React from "react";
import { useState } from "react";
import { Typography, Grid, Toolbar } from "@mui/material";
import { Chart } from "./Chart.js";

export const Homepage = () => {
  const [content, setContent] = useState('Chart placeholder');
  return (
    <div>
      <Toolbar></Toolbar>
      <Typography color="primary">Homepage</Typography>
      <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-start" sx={{ pl: 28 }}>
        <Chart content={content}></Chart>
        <Chart content={content}></Chart>
        <Chart content={content}></Chart>
        <Chart content={content}></Chart>
        <Chart content={content}></Chart>
        <Chart content={content}></Chart>
      </Grid>
    </div>

  )
}