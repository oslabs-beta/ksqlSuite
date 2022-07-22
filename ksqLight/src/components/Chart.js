import React from "react";
import { Grid, Typography } from "@mui/material";

export const Chart = ({ content }) => {

  return (
      <Grid item xs={3}>
        <Typography color="primary">{content}</Typography>
      </Grid>
  )
}