import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { Homepage } from "./components/Homepage.js";
import { SettingsSidebar } from "./components/SettingsSidebar.js";
import { PermanentDrawer } from "./components/PermanentDrawer.js";
import { QueryPage } from "./components/QueryPage.js";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Grid,
} from "@mui/material";
import { MetricCard } from "./components/MetricCard.js";
import { Welcomepage } from "./components/Welcomepage.js";

// http://localhost:9090
function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showQueries, setShowQueries] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [mode, setMode] = useState("light");
  const [metricsState, setMetricsState] = useState({
    prometheusURL: null,
    ksqlDBURL: "",
    duration: {
      days: 0,
      hours: 0,
      minutes: 10,
    },
    refreshRate: 5,
  });

  const theme = createTheme({
    palette: {
      mainPage: {
        main: "#f3e5f5",
      },
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#fbfaff",
            },
            chartColor: {
              background: "#FFFFFF",
            },
            queryPage: {
              main: "rgb(78, 67, 118, .9)",
            },
            cardColor: {
              // background1: "rgb(209, 233, 252)",
              // background2: "rgb(208, 242, 255)",
              // background3: "rgb(255, 247, 205)",
              // background4: "rgb(255, 231, 217)",
              background1: "#FFFFFF",
              background2: "#FFFFFF",
              background3: "#FFFFFF",
              background4: "#FFFFFF",
              iconColor1: "#04724D",
              iconColor2: "#FFC300",
              iconColor3: "#540C97",
              iconColor4: "#C48EF6",
              // textColor1: "#061B64",
              // textColor2: "#04297A",
              // textColor3: "#7A4F01",
              // textColor4: "#7A0C2E",
            },
          }
        : {
            chartColor: {
              background: "#1A1A1A",
            },
            cardColor: {
              background1: "#1A1A1A",
              background2: "#1A1A1A",
              background3: "#1A1A1A",
              background4: "#1A1A1A",
            },
            queryPage: {
              main: "rgb(78, 67, 118, .9)",
            },
          }),
    },
  });

  const serverCards = [
    "livenessIndicator",
    "bytesConsumed",
    "errorRate",
    "errorQueries",
  ].map((el, i) => {
    return (
      <Grid item xs={3} md={3} lg={3} key={i}>
        <MetricCard key={i} type={el} index={i} />
      </Grid>
    );
  });

  return !metricsState.prometheusURL ? (
    <ThemeProvider theme={theme}>
      <Welcomepage
        setMetricsState={setMetricsState}
        metricsState={metricsState}
      ></Welcomepage>
    </ThemeProvider>
  ) : (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header
            fetchMetrics={fetchMetrics}
            setFetchMetrics={setFetchMetrics}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            mode={mode}
            setMode={setMode}
          />
          <SettingsSidebar
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            metricsState={metricsState}
            setMetricsState={setMetricsState}
          />
          <Grid container spacing={1}>
            <Grid item lg={2} md={2} sm={2}>
              <PermanentDrawer
                setShowQueries={setShowQueries}
                setShowMessages={setShowMessages}
                setShowErrors={setShowErrors}
                setShowQuery={setShowQuery}
              />
            </Grid>
            <Grid
              item
              lg={10}
              md={10}
              sm={10}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Grid
                container
                columnSpacing={4}
                sx={{
                  pt: 3,
                  pb: 3,
                  pr: "2em",
                  justifyContents: "center",
                  alignItems: "center",
                }}
              >
                {serverCards}
              </Grid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ pr: "2em" }}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Homepage
                        showQueries={showQueries}
                        showMessages={showMessages}
                        showErrors={showErrors}
                        metricsState={metricsState}
                        showQuery={showQuery}
                      />
                    }
                  />
                  {/* <Route path="/queryPage" element={<QueryPage />} /> */}
                </Routes>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

//PaperProps={{ style: { height: "90vh" } }} <- in Drawer
