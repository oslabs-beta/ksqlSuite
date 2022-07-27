import React from "react";
import { useState } from "react";
import { Typography, Grid, Toolbar, Container, CssBaseline, Box } from "@mui/material";
import { Chart } from "./Chart.js";
import LineChart from "./LineChart.js";
import { LivenessCard } from "./MetricCard.js";

export const Homepage = ({ showQueries, showMessages, showErrors }) => {
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
    // <Container disableGutters style={{
    //   backgroundColor: "rgb(249, 250, 251)",
    //   width: 'auto',
    //   height: 'auto', // changed this from auto
    //   marginBottom: "-2000px", /* any large number will do */
    //   paddingBottom: "2000px",
    //   px: 1
    // }}>
    <Box>
      <CssBaseline />
      {/* <Toolbar></Toolbar> */}
      <Typography color="primary">Hi Welcome back</Typography>
      {/* <Grid container spacing={4} sx={{ display: 'flex', flexDirection: "row", p: 3 }}>
        <Grid item xs={4} md={4} lg={4}>
          <LivenessCard />
        </Grid>
        <Grid item xs={4} md={4} lg={4}>
          <LivenessCard />
        </Grid>
        <Grid item xs={4} md={4} lg={4}>
          <LivenessCard />
        </Grid>
      </Grid> */}

      <Grid container spacing={0} sx={{}}>
        {showQueries &&
          queriesCharts.map(([query, description], index) =>
            <LineChart description={description} metric={query} key={index} />)
        }
        {showMessages &&
          messagesCharts.map(([query, description], index) =>
            <LineChart description={description} metric={query} key={index} />
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

    // </Container>
  )
}
