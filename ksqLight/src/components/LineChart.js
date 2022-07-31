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
import { CardContent } from "@mui/material";



//-----------Import Internal Modules-----------
import {getUnixRange, getDuration} from "../utils/utilityFunctions.js";

Chart.register(ChartStreaming);


const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
});

export default function LineChart({ metric, description, metricsState }) {
  useEffect(() => {
    let initialData;

    // define chart context
    const ctx = document.getElementById(metric).getContext("2d");

    // make initial fetch of graph data
    const [unixStart, unixEnd] = getUnixRange(metricsState.duration.days, metricsState.duration.hours, metricsState.duration.minutes);
    
    initialData = client.query({
      query: gql`
          query fetchMetric {
            ksqlDBMetrics(prometheusURL: "${metricsState.prometheusURL}" metric: "${metric}", resolution: ${metricsState.refreshRate}, start: ${unixStart}, end: ${unixEnd}) {
                  x,
                  y
              }
          }
      `
      })
      .then(res => {
        const data = res.data.ksqlDBMetrics.map((queryObj) => {
          return {
            x: new Date(queryObj.x * 1000),
            y: queryObj.y
          }
        });
        return data;
      })
      .catch(error => console.log(error));

    // define gradient for background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(58, 123, 213, 1)');
    gradient.addColorStop(1, 'rgba(0, 210, 255, 0.3)')

    // define chart configuration
    const config = {
      type: 'line',
      data: {
        datasets: [{
          data: initialData,
          // data: [{x: new Date(), y: '0'}],
          // data: [],           // empty at the beginning,
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
          type: 'realtime',
          ticks: {
            // minTicksLimit: 24
            autoskip: true,
            autoSkipPadding: 30,
            maxRotation: 0,
            steps: 10
          },
          realtime: {
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
                    const data = res.data.ksqlDBMetrics.map((queryObj) => {
                      return {
                        x: new Date(queryObj.x * 1000),
                        y: queryObj.y
                      }
                    });
                    chart.data.datasets[0].data = data;
                    // console.log('this is the data: ', data);
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


    // chart teardown on unmount
    return () => {
      realTimeChart.destroy();
    }
  }, [metricsState]);

  return (
    <Grid item xs={3} md={3} lg={3}>
      <CardContent sx={{ bgcolor: "white", boxShadow: 1, borderRadius: '16px' }}>
        <canvas id={metric} width="100%" height="100%"></canvas>
      </CardContent>
    </Grid>
  );
}
