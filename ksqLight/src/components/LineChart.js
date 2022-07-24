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

// import config from './chartConfig.js';


Chart.register(ChartStreaming);

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
});

//   console.log('test: ', Math.round(new Date().getTime() / 1000));

export default function LineChart({ metric, description }) {
  useEffect(() => {
    let delayed;
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
        animation: {
          onComplete: () => {
            delayed = true;
          },
          // delay: (context) => {
          //   let delay = 0;
          //   if (context.type === "data" && context.mode === "default" && !delayed) {
          //     delay = context.dataIndex * 300 + context.datasetIndex * 100;
          //   }
          //   return delay;
          // }
          delay: 3,
        },
        elements: {
          line: {
            tension: .4
          }
        },
        scales: {
          x: {
            type: 'realtime',   // x axis will auto-scroll from right to left
            realtime: {         // per-axis options
              duration: 200000,  // data in the past 20000 ms will be displayed
              refresh: 2000,    // onRefresh callback will be called every 1000 ms
              delay: 2000,      // delay of 1000 ms, so upcoming values are known before plotting a line
              pause: false,     // chart is not paused
              ttl: undefined,   // data will be automatically deleted as it disappears off the chart
              frameRate: 30,    // data points are drawn 30 times every second

              // a callback to update datasets
              onRefresh: chart => {

                // query your data source and get the array of {x: timestamp, y: value} objects
                client.query({
                  query: gql`
                    query testQuery {
                      ksqlDBMetrics(metric: "${metric}", resolution: 2, start: ${Math.round(new Date().getTime() / 1000) - 500}, end: ${Math.round(new Date().getTime() / 1000)}) {
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

    // populate initial data to avoid having to wait for first refresh
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
    //   console.log('this is a test');
    //   realTimeChart.data.datasets[0].data = data;
    //   realTimeChart.update();
    // })
    // .catch(error => console.log(error));


    // chart teardown on unmount
    return () => {
      realTimeChart.destroy();
    }
  }, []);

  return (
    <Grid item xs={4} md={4} lg={4}>
      <canvas id={metric} width="100%" height="100%"></canvas>
    </Grid>
  );
}
