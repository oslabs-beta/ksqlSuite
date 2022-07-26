import React, { useEffect, useRef } from "react";
import {
  ApolloClient,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { Typography, CardContent, IconButton } from "@mui/material";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { shadows } from '@mui/system';

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
});

export const LivenessCard = () => {

  const data = useRef([]);

  const flipCard = () => {
    // supposed to flip liveness card here
  }

  useEffect(() => {
    let metric = "livenessIndicator";

    // query your data source and get the array of {x: timestamp, y: value} objects
    client.query({
      query: gql`
      query testQuery {
        ksqlDBMetrics(metric: "${metric}", resolution: 2, start: ${Math.round(new Date().getTime() / 1000) - 3000}, end: ${Math.round(new Date().getTime() / 1000)}) {
              x,
              y
          }
      }
  `
    })
      .then(res => {
        // chart.data.datasets[0].data.push(...[{x: new Date(), y: 1}]);
        data.current = res.data.ksqlDBMetrics.map((queryObj) => {
          return {
            x: new Date(queryObj.x * 1000),
            y: queryObj.y
          }
        });
        // chart.data.datasets[0].data = data;
      })
      .catch(error => console.log(error));
  }, []) //useEffect dependency here

  return (
    <CardContent
      sx={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: "column", bgcolor: "rgb(209, 233, 252)", boxShadow: 0, borderRadius: '16px' }}>
      <IconButton
        size="large"
        style={{ width: "4rem", backgroundImage: `linear-gradient(135deg, rgba(16, 57, 150, 0) 0%, rgba(16, 57, 150, 0.24) 100%)` }}
        sx={{ color: 'rgb(6, 27, 100)', borderRadius: '50%' }}
        onClick={() => console.log('')} // placeholder for flipping card
      >
        <MonitorHeartIcon />
      </IconButton>
      {
        data[data.length - 1] ?
          <Typography variant='h3' sx={{ textAlign: 'center', fontWeight: 700, lineHeight: 1.5, fontSize: '1.5rem', fontFamily: 'Public Sans', color: 'green', opacity: 0.72 }}>Running</Typography>
          :
          <Typography variant='h3' sx={{ textAlign: 'center', fontWeight: 700, lineHeight: 1.5, fontSize: '1.5rem', fontFamily: 'Public Sans', color: 'red', opacity: 0.72 }}>Down</Typography>
      }

      <Typography variant='h6' sx={{ fontWeight: 600, lineHeight: 1.5, fontSize: '0.875rem', fontFamily: 'Public Sans', opacity: 0.72, color: 'rgb(6, 27, 100)' }}>
        Liveness Indicator</Typography>

    </CardContent >

  )
}
