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
      <div className="flex-1 w-full header-viewport bg-slate-800 p-4">
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
