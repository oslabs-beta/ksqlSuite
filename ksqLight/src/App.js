import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { Homepage } from "./components/Homepage.js";
import { SettingsSidebar } from "./components/SettingsSidebar.js";
import { PermanentDrawer } from "./components/PermanentDrawer.js";
import { QueryPage } from "./components/QueryPage.js";
import { CssBaseline, ThemeProvider, createTheme, Box, Grid } from "@mui/material";
import { MetricCard } from "./components/MetricCard.js";
import { green, purple } from '@mui/material/colors';
import { LivenessCard } from "./components/LivenessCard.js";
import { Welcomepage } from "./components/Welcomepage.js";

const theme = createTheme({
  palette: {
    // primary: {
    //   main: purple[500],
    // },
    secondary: {
      main: green[500],
    },
    background: {
      default: "rgb(249, 250, 251)",
    },
    mode: 'light',
  },
});

function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  // const [metricsState, setMetricsState] = useState({
  //   prometheusURL: "http://localhost:9090/",
  //   ksqlDBURL: "",
  //   duration: {
  //     days: 0,
  //     hours: 0,
  //     minutes: 10
  //   },
  //   refreshRate: 2
  // });

  // return (
  //   <BrowserRouter>
  //     <CssBaseline/>
  //     <Header 
  //       fetchMetrics={fetchMetrics} 
  //       setFetchMetrics={setFetchMetrics} 
  //       showSettings={showSettings} 
  //       setShowSettings={setShowSettings}/>
  //     <SettingsSidebar 
  //       showSettings={showSettings} 
  //       setShowSettings={setShowSettings} 
  //       metricsState={metricsState}
  //       setMetricsState={setMetricsState}>
  //     </SettingsSidebar>
  //     <PermanentDrawer></PermanentDrawer>
  //     <Routes>
  //       <Route path="/" element={<Homepage metricsState={metricsState}/>}/>
  //       <Route path="/queryPage" element={<QueryPage/>}/>
  //     </Routes>
  //   </BrowserRouter>

  const [showQueries, setShowQueries] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [metricsState, setMetricsState] = useState({
    prometheusURL: "http://localhost:9090/",
    ksqlDBURL: "",
    duration: {
      days: 0,
      hours: 0,
      minutes: 10
    },
    refreshRate: 5
  });


  return (
    // <Welcomepage></Welcomepage>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>

          <Header fetchMetrics={fetchMetrics} setFetchMetrics={setFetchMetrics} showSettings={showSettings} setShowSettings={setShowSettings} />
          <SettingsSidebar showSettings={showSettings} setShowSettings={setShowSettings} metricsState={metricsState} setMetricsState={setMetricsState} />
          {/* <Box sx={{ display: 'flex' }}>
            <PermanentDrawer
              setShowQueries={setShowQueries}
              setShowMessages={setShowMessages}
              setShowErrors={setShowErrors}
            />
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Grid container columnSpacing={9} rowSpacing={2} sx={{ display: 'flex', flexDirection: "row", p: 3, justifyContents: "center", alignItems: "center" }}>
                <Grid item xs={3} md={3} lg={3}>
                  <MetricCard type="livenessIndicator" index={0} />
                </Grid>
                <Grid item xs={3} md={3} lg={3}>
                  <MetricCard type="bytesConsumedTotal" index={1} />
                </Grid>
                <Grid item xs={3} md={3} lg={3} >
                  <MetricCard type="errorRate" index={2} />
                </Grid>
                <Grid item xs={3} md={3} lg={3} >
                  <MetricCard type="errorQueries" index={3} />
                </Grid>
              </Grid>
              <Routes>
                <Route path="/" element={<Homepage showQueries={showQueries} showMessages={showMessages} showErrors={showErrors} />} />
                <Route path="/queryPage" element={<QueryPage />} />
              </Routes>
            </Box>
          </Box> */}
          <Grid container spacing={1}>
            <Grid item lg={2} md={2} sm={2}>
              <PermanentDrawer
                setShowQueries={setShowQueries}
                setShowMessages={setShowMessages}
                setShowErrors={setShowErrors}
              />
            </Grid>

            <Grid item lg={10} md={10} sm={10} sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Grid container columnSpacing={9} rowSpacing={2} sx={{ p: 3, justifyContents: "center", alignItems: "center" }}>
                <Grid item xs={3} md={3} lg={3}>
                  <MetricCard type="livenessIndicator" index={0} />
                </Grid>
                <Grid item xs={3} md={3} lg={3}>
                  <MetricCard type="bytesConsumed" index={1} />
                </Grid>
                <Grid item xs={3} md={3} lg={3} >
                  <MetricCard type="errorRate" index={2} />
                </Grid>
                <Grid item xs={3} md={3} lg={3} >
                  <MetricCard type="errorQueries" index={3} />
                </Grid>
              </Grid>
              <Grid container justifyContent="center" alignItems="center" sx={{ pr: "2em" }}>
                <Routes>
                  <Route path="/" element={<Homepage showQueries={showQueries} showMessages={showMessages} showErrors={showErrors} metricsState={metricsState} />} />
                  <Route path="/queryPage" element={<QueryPage />} />
                </Routes>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </BrowserRouter >
  );
}

export default App;

//PaperProps={{ style: { height: "90vh" } }} <- in Drawer
