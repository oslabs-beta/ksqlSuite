import React, { useEffect } from "react";
import { useState } from "react";
import { TextField, Typography, MenuItem, Select, Drawer, IconButton, Grid, Button, FormControl, Stack } from "@mui/material"
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
}

// eslint-disable-next-line no-lone-blocks
{/* <div className="flex-1 w-full header-viewport bg-slate-800 p-4">
      <form>
        <div className="mb-6">
          <div className="text-white text-2xl font-mono font-medium p-2">Prometheus Connection</div>
          <label htmlFor="promHost" className="pl-6 p-2 mb-2 text-left text-md font-medium text-white">Host</label>
          <input type="url" id="promHost" placeholder="http://localhost:9090/" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1.5"/>
        </div>
        <div className="mb-6">
          <hr className="w-1/3"></hr>
          <div className="text-white text-2xl font-mono font-medium p-2">ksqlDB Connection</div>
          <label htmlFor="ksqldbHost" className="pl-6 p-2 mb-2 text-left text-md font-medium text-white">Host</label>
          <input type="url" id="ksqldbHost" placeholder="http://localhost:8088/" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1.5"/>
        </div>
        <div className="mb-6">
          <hr className="w-1/3"></hr>
          <div className="text-white text-2xl font-mono font-medium p-2">Time Window</div>
          
        <div className="flex justify-left pl-6">
          <div className="">
            <label htmlFor="days" className="text-mono text-white flex justify-center">Days</label>
            <select id="days" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
            </select>
          </div>

          <div className="">
            <label htmlFor="hours" className="text-mono text-white flex justify-center">Hours</label>
            <select id="hours" className="block form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0">0</option>
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="15">16</option>
                <option value="15">17</option>
                <option value="15">18</option>
                <option value="15">19</option>
                <option value="15">20</option>
                <option value="15">21</option>
                <option value="15">22</option>
                <option value="15">23</option>
            </select>
          </div>

          <div className="">
            <label htmlFor="minutes" className="text-mono text-white flex justify-center">Mins</label>
            <select id="minutes/" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0">0</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30" selected>30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="55">55</option>
            </select>
          </div>
        </div>
        </div>

        <div className="mb-6 ">
        <hr className="w-1/3"></hr>
          <div className="text-white text-2xl font-mono font-medium py-2">Refresh Rate</div>
          
        <div className="flex justify-left pl-6">
          <div className="">
            <label htmlFor="refreshHours" className="text-mono text-white flex justify-center">Hours</label>
            <select id="refreshHours" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
            </select>
          </div>
          <div className="">
            <label htmlFor="refreshMinutes" className="text-mono text-white flex justify-center">Mins</label>
            <select id="refreshMinutes" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
            </select>
          </div>
          <div className="">
            <label htmlFor="refreshSeconds" className="text-mono text-white flex justify-center">Secs</label>
            <select id="refreshSeconds" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5" selected>5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
            </select>
          </div>

        </div><br></br>
          <hr className="w-1/3"></hr>
        </div>

        <div className="mb-6 ">
          <button type="submit" className="text-white bg-cyan-700 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
      </form>
    </div> */}