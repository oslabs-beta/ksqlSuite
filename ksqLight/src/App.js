import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { Homepage } from "./components/Homepage.js";
import { SettingsSidebar } from "./components/SettingsSidebar.js";
import { PermanentDrawer } from "./components/PermanentDrawer.js";
import { QueryPage } from "./components/QueryPage.js";
import { CssBaseline, Container, Box } from "@mui/material";

function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showQueries, setShowQueries] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [showErrors, setShowErrors] = useState(false);


  return (
    <BrowserRouter>
      <Box style={{ display: 'flex', flexDirection: "column", p: 0 }}>
        <Box>
          <Header fetchMetrics={fetchMetrics} setFetchMetrics={setFetchMetrics} showSettings={showSettings} setShowSettings={setShowSettings} sx={{ p: 0 }} />
        </Box>
        <SettingsSidebar showSettings={showSettings} setShowSettings={setShowSettings}></SettingsSidebar>
        <Box style={{ display: 'flex', flexDirection: "row", px: 0, mx: 0, pt: 3 }}>
          <PermanentDrawer
            setShowQueries={setShowQueries} setShowMessages={setShowMessages} setShowErrors={setShowErrors}></PermanentDrawer>
          <Routes>
            <Route path="/" element={<Homepage showQueries={showQueries} showMessages={showMessages} showErrors={showErrors} />} />
            <Route path="/queryPage" element={<QueryPage />} />
          </Routes>
        </Box>
      </Box>


    </BrowserRouter>

  );
}

export default App;

//PaperProps={{ style: { height: "90vh" } }} <- in Drawer
