import React, { useEffect } from "react";
import { useState } from "react";
import { TextField, Typography, MenuItem, Select, Drawer, IconButton, Grid, Button, Stack } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const SettingsSidebar = ({ showSettings, setShowSettings, metricsState, setMetricsState }) => {
  const [localMetricsState, setLocalMetricsState] = useState({
    prometheusURL: metricsState.prometheusURL,
    ksqlDBURL: metricsState.ksqlDBURL,
    duration: metricsState.duration,
    refreshRate: metricsState.refreshRate
  });

  const handleLocalMetrics = (event) => {
    switch(event.target.name) {
      case "prometheus-url":
        setLocalMetricsState({
          ...localMetricsState,
          prometheusURL: event.target.value
        });
        break;
      case "ksqldb-url":
        setLocalMetricsState({
          ...localMetricsState,
          ksqlDBURL: event.target.value
        });
        break;
      case "duration-days":
        setLocalMetricsState({
          ...localMetricsState,
          duration: {
            ...localMetricsState.duration,
            days: event.target.value
          }
        });
        break;
      case "duration-hours":
        setLocalMetricsState({
          ...localMetricsState,
          duration: {
            ...localMetricsState.duration,
            hours: event.target.value
          }
        });
        break;
      case "duration-minutes":
        setLocalMetricsState({
          ...localMetricsState,
          duration: {
            ...localMetricsState.duration,
            minutes: event.target.value
          }
        });
        break;
      case "refresh-rate":
        setLocalMetricsState({
          ...localMetricsState,
          refreshRate: event.target.value
        });
        break;
      default:
        break;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // ToDo:
      // 1. verify prometheus URL
      // 2. verify ksqlDB url
      // 3. verify metrics exist for duration requested

    // update state
    setMetricsState({
      prometheusURL: localMetricsState.prometheusURL,
      ksqlDBURL: localMetricsState.ksqlDBURL,
      duration: {
        days: localMetricsState.duration.days,
        hours: localMetricsState.duration.hours,
        minutes: localMetricsState.duration.minutes
      },
      refreshRate: localMetricsState.refreshRate
    });
  }

  // useEffect(() => {
  //   console.log('this is the metrics state: ', metricsState);
  // }, [metricsState]);


  return(
    <Drawer variant="temporary" anchor="right" open={showSettings} PaperProps={{sx: {paddingTop: "3.5em", width: "35%"}}}>
      <div className="flex-1 w-full header-viewport  p-4">
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
            <IconButton aria-label="Hide" onClick={() => setShowSettings(!showSettings)}>
              <ArrowForwardIosIcon sx={{color: "#333"}}/>
            </IconButton>
              <Typography variant="h6" sx={{color: "#333"}}>Prometheus Connection</Typography>
                <hr className="w-full mb-3 mt-1"></hr>
              <TextField
                fullWidth 
                variant="outlined"
                label="URL"
                name="prometheus-url"
                onChange={handleLocalMetrics}
                value={localMetricsState.prometheusURL}
              />
              <hr className="w-full invisible mb-2 mt-2"></hr>
              <Typography variant="h6" sx={{color: "#333"}}>ksqlDB Connection</Typography>
              <hr className="w-full mb-3 mt-1"></hr>
              <TextField
                fullWidth 
                variant="outlined"
                label="URL"
                name="ksqldb-url"
                onChange={handleLocalMetrics}
                value={localMetricsState.ksqlDBURL}
              />
              <hr className="w-full invisible mb-2 mt-2"></hr>
              <Typography variant="h6" sx={{color: "#333"}}>Duration</Typography>
              <hr className="w-full mb-3 mt-1"></hr>
              <Grid spacing={2} container justifyContent="flex-start" alignItems="center">
                <Grid item xs={4}>
                  <TextField
                  variant="outlined"
                  label="Days"
                  name="duration-days"
                  onChange={handleLocalMetrics}
                  value={localMetricsState.duration.days}
                  type="number"
                  
                />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                  variant="outlined"
                  label="Hours"
                  name="duration-hours"
                  onChange={handleLocalMetrics}
                  value={localMetricsState.duration.hours}
                  type="number"
                />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                  variant="outlined"
                  label="Minutes"
                  name="duration-minutes"
                  onChange={handleLocalMetrics}
                  value={localMetricsState.duration.minutes}
                  type="number"
                />
                </Grid>
              </Grid>
              <hr className="w-full invisible mb-2 mt-2"></hr>
              <Typography variant="h6">Refresh Rate</Typography>
              <hr className="w-full mb-3 mt-1"></hr>
              <Grid item xs={4}>
                <TextField
                  fullWidth 
                  variant="outlined"
                  label="seconds"
                  value={localMetricsState.refreshRate}
                  name="refresh-rate"
                  type="number"
                  onChange={handleLocalMetrics}
                />
              </Grid>
              <Stack direction="row" spacing={2} sx={{mt: "1.5em"}}>
                <Button variant="contained" type="submit">Submit</Button>
                <Button color='secondary' variant="contained" onClick={() => setShowSettings(!showSettings)}>Cancel</Button>
              </Stack>
          </Grid>
        </form>
      </div>
    </Drawer>
  )
};

