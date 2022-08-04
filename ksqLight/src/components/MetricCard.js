import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Typography, CardContent, IconButton, Box } from "@mui/material";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ErrorIcon from "@mui/icons-material/Error";
import BugReportIcon from "@mui/icons-material/BugReport";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
});

export const MetricCard = ({ type, index }) => {
  const [data, setData] = useState(null);

  const metricType = [
    "Liveness Indicator",
    "Error Rate",
    "Error Queries",
    "Bytes Consumed",
  ];
  const bgColor = [
    "cardColor.background1",
    "cardColor.background2",
    "cardColor.background3",
    "cardColor.background4",
  ];
  const textColor = [
    "cardColor.textColor1",
    "cardColor.textColor2",
    "cardColor.textColor3",
    "cardColor.textColor4",
  ];
  const bgImage = [
    "cardColor.iconBg1",
    "cardColor.iconBg2",
    "cardColor.iconBg3",
    "cardColor.iconBg4",
  ];
  const iconColor = [
    "cardColor.iconColor1",
    "cardColor.iconColor2",
    "cardColor.iconColor3",
    "cardColor.iconColor4",
  ];

  useEffect(() => {
    client
      .query({
        query: gql`
      query testQuery {
        ${type}(prometheusURL: "http://localhost:9090/")
      }
  `,
      })
      .then((res) => setData(res.data[type]))
      .catch((error) => console.log(error));
  }, []);

  return (
    <CardContent
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: bgColor[index],
        boxShadow: 1,
        borderRadius: "16px",
      }}
    >
      <Box
        width="100%"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <IconButton
          size="small"
          sx={{ borderRadius: "50%", color: iconColor[index] }}
        >
          {index === 0 && <MonitorHeartIcon />}
          {index === 1 && <ErrorIcon />}
          {index === 2 && <BugReportIcon />}
          {index === 3 && <DataThresholdingIcon />}
        </IconButton>
        <Box>
          <Typography
            variant="h6"
            sx={{
              verticalAlign: "center",
              fontSize: "0.96rem",
              opacity: 0.72,
              color: textColor[index],
            }}
          >
            {metricType[index]}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h3" sx={{ fontSize: "1.8rem", pt: 1 }}>
        {index === 0 && (data ? "Running" : "Down")}
        {index === 1 && (data !== null ? data : "N/A")}
        {index === 2 && (data !== null ? data : "N/A")}
        {index === 3 && (data !== null ? data : "N/A")}
      </Typography>
    </CardContent>
  );
};
