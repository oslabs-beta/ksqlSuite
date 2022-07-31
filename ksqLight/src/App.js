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
import { Welcomepage } from "./components/Welcomepage.js";

// http://localhost:9090
function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showQueries, setShowQueries] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [mode, setMode] = useState('light');
  const [metricsState, setMetricsState] = useState({
    prometheusURL: null,
    ksqlDBURL: "",
    duration: {
      days: 0,
      hours: 0,
      minutes: 10
    },
    refreshRate: 5
  });

  const theme = createTheme({
    palette: {
      mainPage: {
        main: "#f3e5f5",
      },
      mode,
      ...(mode === 'light' ?
        {
          background: {
            default: "#f9fafb",
          },
          chartColor: {
            background: "#FFFFFF"
          },
          cardColor: {
            background1: "rgb(209, 233, 252)",
            background2: "rgb(208, 242, 255)",
            background3: "rgb(255, 247, 205)",
            background4: "rgb(255, 231, 217)",
          }
        }
        :
        {

        })
    },
  });

  const serverCards = ["livenessIndicator", "bytesConsumed", "errorRate", "errorQueries"].map((el, i) => {
    return (
      <Grid item xs={3} md={3} lg={3}>
        <MetricCard key={i} type={el} index={i} />
      </Grid>
    )
  });
  console.log(metricsState);
  return (
    !metricsState.prometheusURL ?
      <ThemeProvider theme={theme}>
        <Welcomepage setMetricsState={setMetricsState} metricsState={metricsState}></Welcomepage>
      </ThemeProvider>
      :
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Header fetchMetrics={fetchMetrics} setFetchMetrics={setFetchMetrics} showSettings={showSettings} setShowSettings={setShowSettings} mode={mode} setMode={setMode} />
            <SettingsSidebar showSettings={showSettings} setShowSettings={setShowSettings} metricsState={metricsState} setMetricsState={setMetricsState} />
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
                <Grid container columnSpacing={10} sx={{ p: 3, justifyContents: "center", alignItems: "center" }}>
                  {serverCards}
                </Grid>
                <Grid container justifyContent="center" alignItems="center" sx={{ pr: "2em" }}>
                  {/* <Routes>
                    <Route path="/" element={<Homepage showQueries={showQueries} showMessages={showMessages} showErrors={showErrors} metricsState={metricsState} />} />
                    <Route path="/queryPage" element={<QueryPage />} />
                  </Routes> */}
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
