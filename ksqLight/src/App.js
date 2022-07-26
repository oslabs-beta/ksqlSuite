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

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showQueries, setShowQueries] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [showErrors, setShowErrors] = useState(false);


  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>

          <Header fetchMetrics={fetchMetrics} setFetchMetrics={setFetchMetrics} showSettings={showSettings} setShowSettings={setShowSettings} />
          <SettingsSidebar showSettings={showSettings} setShowSettings={setShowSettings}></SettingsSidebar>
          <Box sx={{ display: 'flex' }}>
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
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter >

  );
}

export default App;

//PaperProps={{ style: { height: "90vh" } }} <- in Drawer
