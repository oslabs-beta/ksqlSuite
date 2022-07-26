//-----------Import External Modules-----------
import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import Chart from "chart.js/auto";
import ChartStreaming from "chartjs-plugin-streaming";
import 'chartjs-adapter-moment';


//-----------Import Internal Modules-----------
import {getUnixRange, getDuration} from "../utils/utilityFunctions.js";

Chart.register(ChartStreaming);


const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

//   console.log('test: ', Math.round(new Date().getTime() / 1000));

export default function LineChart({ metric, description, metricsState }) {
  useEffect(() => {
    // define chart context
    const ctx = document.getElementById(metric).getContext("2d");

    // define gradient for background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(58, 123, 213, 1)');
    gradient.addColorStop(1, 'rgba(0, 210, 255, 0.3)')

    // define chart configuration
    const config = {
    type: 'line',
    data: {
        datasets: [{
          data: [],           // empty at the beginning,
          borderColor: 'rgba(58, 123, 213, 1)',
          pointRadius: 0,
          hitRadius: 30,
          hoverRadius: 5,
          fill: true,
          backgroundColor: gradient,
      }]
    },
    options: {
      responsive: true,
      elements: {
        line: {
            tension: .4
        }
      },
      scales: {
        x: {
          type: 'realtime',   // x axis will auto-scroll from right to left
          realtime: {         // per-axis options
            duration: getDuration(metricsState.duration.days, metricsState.duration.hours, metricsState.duration.minutes),  // data in the past duration # of ms will be displayed
            refresh: metricsState.refreshRate * 1000,    // onRefresh callback will be called every refresh # ms
            delay: 1000,      // delay of 1000 ms, so upcoming values are known before plotting a line
            pause: false,     // chart is not paused
            ttl: undefined,   // data will be automatically deleted as it disappears off the chart
            frameRate: 30,    // data points are drawn 30 times every second
  
            // a callback to update datasets
            onRefresh: chart => {
              const [unixStart, unixEnd] = getUnixRange(metricsState.duration.days, metricsState.duration.hours, metricsState.duration.minutes);
  
              // query your data source and get the array of {x: timestamp, y: value} objects
              client.query({
                query: gql`
                    query testQuery {
                      ksqlDBMetrics(prometheusURL: "${metricsState.prometheusURL}" metric: "${metric}", resolution: ${metricsState.refreshRate}, start: ${unixStart}, end: ${unixEnd}) {
                            x,
                            y
                        }
                    }
                `
              })
              .then(res => {
                // chart.data.datasets[0].data.push(...[{x: new Date(), y: 1}]);
                const data = res.data.ksqlDBMetrics.map((queryObj) => {
                    return {
                        x: new Date(queryObj.x * 1000),
                        y: queryObj.y
                    }
                });
                // console.log(data);
                chart.data.datasets[0].data = data;
              })
              .catch(error => console.log(error));
            }
          }
        },
        y: {
            beginAtZero: true,
            ticks: {
                // display: false,
                color: "#999",
                stepSize: 5
            }
        }
      },
      plugins: {
        legend: {
            display: false,
        //   position: "top",
        },
        title: {
          fontFamily: 'Raleway',
          color: '#666',
          display: true,
          text: description,
        },
      },
    }
  };

  // instantiate new instance of a chart
  const realTimeChart = new Chart(ctx, config);

  // notes on where to go next
  // look into Line chart.js - 2 component to pass data to
  // look into the first batch of data coming back and compare it to other batches that successfully update the chart

  // // populate initial data to avoid having to wait for first refresh
  // client.query({
  //   query: gql`
  //       query testQuery {
  //         ksqlDBMetrics(metric: "numActiveQueries", resolution: 1, start: ${Math.round(new Date().getTime() / 1000) - 500}, end: ${Math.round(new Date().getTime() / 1000)}) {
  //               x,
  //               y
  //           }
  //       }
  //   `
  // })
  // .then(res => {
  //   // chart.data.datasets[0].data.push(...[{x: new Date(), y: 1}]);
  //   const data = res.data.ksqlDBMetrics.map((queryObj) => {
  //       return {
  //           x: new Date(queryObj.x * 1000),
  //           y: queryObj.y
  //       }
  //   });
  //   console.log('this runs within initial fetch');
  //   realTimeChart.data.datasets[0].data = data;
  //   // realTimeChart.update();
  // })
  // .catch(error => console.log(error));


    // chart teardown on unmount
    return () => {
      console.log('teardown');
      realTimeChart.destroy();
    }
  }, [metricsState]);

  return (
    <>
      <Grid item xs={2}>
        <canvas id={metric} width="100%" height="100%"></canvas>
      </Grid>
      <Grid item xs={10}>
      </Grid>
    </>
  );
}