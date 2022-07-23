import React from "react";
import { useState } from "react";
import { Typography, Grid, Toolbar } from "@mui/material";
import { Chart } from "./Chart.js";
import LineChart from "./LineChart.js";

export const Homepage = () => {
  const [content, setContent] = useState('Chart placeholder');

  const queryTypes = [
    ["runningQueries", "Number of Running Queries"],
    ["rebalancingQueries", "Number of Rebalancing Queries"],
    ["pendingShutdownQueries", "Number of Pending Shutdown Queries"],
    ["pendingErrorQueries", "Number of Pending Error Queries"],
    ["numPersistentQueries", "Number of Persistent Queries"],
    ["numIdleQueries", "Number of Idle Queries"],
    ["numActiveQueries", "Number of Active Queries"],
    ["notRunningQueries", "Number of Not Running Queries"],
    ["messagesProducedPerSec", "Number of Messages Produced Per Second"],
    ["messagesConsumedTotal", "Number of Messages Consumed"],
    ["messagesConsumedPerSec", "Number of Messages Consumed Per Second"],
    ["messagesConsumedMin", "Number of Messages Consumed Min"],
    ["messagesConsumedMax", "Number of Messages Consumed Max"],
    ["messagesConsumedAvg", "Number of Messages Consumed Average"],
    ["livenessIndicator", "Liveness Indicator"],
    ["errorRate", "Error Rate"],
    ["errorQueries", "Number of Error Queries"],
    ["createdQueries", "Number of Created Queries"],
    ["bytesConsumedTotal", "Number of Bytes Consumed Total"],
  ];

  return (
    <div>
      <Toolbar></Toolbar>
      <Typography color="primary">Homepage</Typography>
      <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-start" sx={{ pl: 28 }}>
        {queryTypes.map(([query, description], index) => <LineChart description={description} metric={query} key={index}/>)}
      </Grid>
    </div>

  )
}