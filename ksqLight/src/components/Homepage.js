import React from "react";
import { useState } from "react";
import { Typography, Grid, Toolbar, Container, CssBaseline, Box } from "@mui/material";
import { Chart } from "./Chart.js";
import LineChart from "./LineChart.js";
import { LivenessCard } from "./MetricCard.js";

export const Homepage = ({ showQueries, showMessages, showErrors, metricsState }) => {
  const [content, setContent] = useState('Chart placeholder');

  const queriesCharts = [
    ["runningQueries", "Number of Running Queries"],
    ["createdQueries", "Number of Created Queries"],
    ["numPersistentQueries", "Number of Persistent Queries"],
    ["numIdleQueries", "Number of Idle Queries"],
    ["rebalancingQueries", "Number of Rebalancing Queries"],
    ["numActiveQueries", "Number of Active Queries"],
    ["notRunningQueries", "Number of Not Running Queries"],
    ["pendingShutdownQueries", "Number of Pending Shutdown Queries"],
  ];

  const messagesCharts = [
    ["messagesConsumedTotal", "Number of Messages Consumed"],
    ["messagesProducedPerSec", "Number of Messages Produced Per Second"],
    ["messagesConsumedPerSec", "Number of Messages Consumed Per Second"],
    ["messagesConsumedMin", "Number of Messages Consumed Min"],
    ["messagesConsumedMax", "Number of Messages Consumed Max"],
    ["messagesConsumedAvg", "Number of Messages Consumed Average"],
  ];

  const errorCharts = [
    ["errorRate", "Error Rate"],
    ["errorQueries", "Number of Error Queries"],
    ["pendingErrorQueries", "Number of Pending Error Queries"],
  ]
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
    // ["livenessIndicator", "Liveness Indicator"],
    ["errorRate", "Error Rate"],
    ["errorQueries", "Number of Error Queries"],
    ["createdQueries", "Number of Created Queries"],
    ["bytesConsumedTotal", "Number of Bytes Consumed Total"],
  ];

  return (
    <Box>
      <CssBaseline />
      <Typography color="primary">Hi Welcome back</Typography>
      <Grid container spacing={4} sx={{}}>
        {showQueries &&
          queriesCharts.map(([query, description], index) =>
            <LineChart description={description} metric={query} metricsState={metricsState} key={index} />)
        }
        {showMessages &&
          messagesCharts.map(([query, description], index) =>
            <LineChart description={description} metric={query} metricsState={metricsState} key={index} />
          )
        }
        {/* {showErrors &&
          errorCharts.map(([query, description], index) =>
            <LineChart description={description} metric={query} key={index} />
          )
        } */}
        {/* {queryTypes.map(([query, description], index) => <LineChart description={description} metric={query} key={index} />)} */}
      </Grid>
    </Box>
  )
}
