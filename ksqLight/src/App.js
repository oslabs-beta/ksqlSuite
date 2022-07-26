import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { Homepage } from "./components/Homepage.js";
import { SettingsSidebar } from "./components/SettingsSidebar.js";
import { PermanentDrawer } from "./components/PermanentDrawer.js";
import { QueryPage } from "./components/QueryPage.js";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

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
            <PermanentDrawer></PermanentDrawer>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/queryPage" element={<QueryPage />} />
            </Routes>
          </Box>
        </Box>


      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App;

//PaperProps={{ style: { height: "90vh" } }} <- in Drawer