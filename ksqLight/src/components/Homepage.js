import React from "react";
import { Grid, CssBaseline, Box, CardContent } from "@mui/material";
import LineChart from "./LineChart.js";

export const Homepage = ({ showQueries, showMessages, showErrors, metricsState }) => {
  const queriesCharts = [
    ["runningQueries", "Running Queries"],
    ["createdQueries", "Created Queries"],
    ["numPersistentQueries", "Persistent Queries"],
    ["numIdleQueries", "Idle Queries"],
    ["rebalancingQueries", "Rebalancing Queries"],
    ["numActiveQueries", "Active Queries"],
    ["notRunningQueries", "Not Running Queries"],
    ["pendingShutdownQueries", "Pending Shutdown Queries"],
  ];

  const messagesCharts = [
    ["messagesConsumedTotal", "Messages Consumed"],
    ["messagesProducedPerSec", "Messages Produced Per Second"],
    ["messagesConsumedPerSec", "Messages Consumed Per Second"],
    ["messagesConsumedMin", "Messages Consumed Min"],
    ["messagesConsumedMax", "Messages Consumed Max"],
    ["messagesConsumedAvg", "Messages Consumed Average"],
  ];

  const errorCharts = [
    ["errorRate", "Error Rate"],
    ["errorQueries", "Error Queries"],
    ["pendingErrorQueries", "Pending Error Queries"],
  ]

  return (
    <Box>
      <CssBaseline />
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
        {showErrors &&
          errorCharts.map(([query, description], index) =>
            <LineChart description={description} metric={query} metricsState={metricsState} key={index} />
          ).concat([<Grid item xl={3}><CardContent sx={{ width: "300px" }}></CardContent></Grid>])
        }
      </Grid>
    </Box>
  )
}
