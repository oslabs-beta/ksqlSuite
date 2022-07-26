import React from "react";
import { useState } from "react";
import { TextField, Typography, MenuItem, Select, Drawer, IconButton, Container } from "@mui/material"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
;

export const SettingsSidebar = ({ showSettings, setShowSettings }) => {
  const [timeWindowDays, setTimeWindowDays] = useState(0);
  const [timeWindowHours, setTimeWindowHours] = useState(1);
  const [timeWindowMinutes, setTimeWindowMinutes] = useState(30);
  const [refreshRateHours, setRefreshRateHours] = useState(0);
  const [refreshRateMinutes, setRefreshRateMinutes] = useState(0);
  const [refreshRateSeconds, setRefreshRateSeconds] = useState(10);

  const handleTimeWindowDays = (event) => {
    setTimeWindowDays(event.target.value);
  }
  const handleTimeWindowHours = (event) => {
    setTimeWindowHours(event.target.value);
  }
  const handleTimeWindowMinutes = (event) => {
    setTimeWindowMinutes(event.target.value);
  }
  const handleRefreshRateHours = (event) => {
    setRefreshRateHours(event.target.value);
  }
  const handleRefreshRateMinutes = (event) => {
    setRefreshRateMinutes(event.target.value);
  }
  const handleRefreshRateSeconds = (event) => {
    setRefreshRateSeconds(event.target.value);
  }

  return (
    <Drawer variant="temporary" anchor="right" open={showSettings} sx={{ zIndex: "tooltip" }}>
      <div className="flex-1 w-full header-viewport p-4">
        <form noValidate autoComplete="off">
          <IconButton aria-label="Hide" onClick={() => setShowSettings(!showSettings)}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h5">Prometheus Connection</Typography>
          <hr className="w-full mb-3 mt-1"></hr>
          <TextField
            variant="outlined"
            label="Host URL"
          />
          <hr className="w-full invisible mb-2 mt-2"></hr>
          <Typography variant="h5">ksqlDB Connection</Typography>
          <hr className="w-full mb-3 mt-1"></hr>
          <TextField
            variant="outlined"
            label="Host URL"
          />
          <hr className="w-full invisible mb-2 mt-2"></hr>
          <Typography variant="h5">Time Window</Typography>
          <hr className="w-full mb-3 mt-1"></hr>
          <Select
            id="time-window-days"
            value={timeWindowDays}
            label="Days"
            onChange={handleTimeWindowDays}

          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={13}>13</MenuItem>
            <MenuItem value={14}>14</MenuItem>
            <MenuItem value={15}>15</MenuItem>
          </Select>
          <Select
            id="time-window-hours"
            value={timeWindowHours}
            label="Hours"
            onChange={handleTimeWindowHours}
            autoWidth
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={13}>13</MenuItem>
            <MenuItem value={14}>14</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={17}>17</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={19}>19</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={21}>21</MenuItem>
            <MenuItem value={22}>22</MenuItem>
            <MenuItem value={23}>23</MenuItem>
          </Select>
          <Select
            id="time-window-minutes"
            value={timeWindowMinutes}
            label="Minutes"
            onChange={handleTimeWindowMinutes}
            autoWidth
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={35}>35</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={45}>45</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={55}>55</MenuItem>
          </Select>
          <hr className="w-full invisible mb-2 mt-2"></hr>
          <Typography variant="h5">Refresh Rate</Typography>
          <hr className="w-full mb-3 mt-1"></hr>
          <Select
            id="refresh-rate-hours"
            value={refreshRateHours}
            label="Hours"
            onChange={handleRefreshRateHours}
            autoWidth
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={13}>13</MenuItem>
            <MenuItem value={14}>14</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={17}>17</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={19}>19</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={21}>21</MenuItem>
            <MenuItem value={22}>22</MenuItem>
            <MenuItem value={23}>23</MenuItem>
          </Select>
          <Select
            id="refresh-rate-minutes"
            value={refreshRateMinutes}
            label="Minutes"
            onChange={handleRefreshRateMinutes}
            autoWidth
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={45}>45</MenuItem>
          </Select>
          <Select
            id="refresh-rate-seconds"
            value={refreshRateSeconds}
            label="Seconds"
            onChange={handleRefreshRateSeconds}
            autoWidth
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={45}>45</MenuItem>
          </Select>
        </form>
      </div>
    </Drawer>
  )
};

