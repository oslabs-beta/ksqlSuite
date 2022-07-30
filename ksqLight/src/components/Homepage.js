import React from "react";
import { Grid, CssBaseline, Box, CardContent } from "@mui/material";
import LineChart from "./LineChart.js";

export const Homepage = ({ showQueries, showMessages, showErrors, metricsState }) => {
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
