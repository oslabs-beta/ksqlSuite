import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { Homepage } from "./components/Homepage.js";
import { SettingsSidebar } from "./components/SettingsSidebar.js";
import { PermanentDrawer } from "./components/PermanentDrawer.js";
import { QueryPage } from "./components/QueryPage.js";
import { CssBaseline } from "@mui/material";

function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [metricsState, setMetricsState] = useState({
    prometheusURL: "http://localhost:9090/",
    ksqlDBURL: "",
    duration: {
      days: 0,
      hours: 0,
      minutes: 10
    },
    refreshRate: 2
  });

  return (
    <BrowserRouter>
      <CssBaseline/>
      <Header 
        fetchMetrics={fetchMetrics} 
        setFetchMetrics={setFetchMetrics} 
        showSettings={showSettings} 
        setShowSettings={setShowSettings}/>
      <SettingsSidebar 
        showSettings={showSettings} 
        setShowSettings={setShowSettings} 
        metricsState={metricsState}
        setMetricsState={setMetricsState}>
      </SettingsSidebar>
      <PermanentDrawer></PermanentDrawer>
      <Routes>
        <Route path="/" element={<Homepage metricsState={metricsState}/>}/>
        <Route path="/queryPage" element={<QueryPage/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;

//PaperProps={{ style: { height: "90vh" } }} <- in Drawer