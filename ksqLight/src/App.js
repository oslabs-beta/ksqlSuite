import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { Homepage } from "./components/Homepage.js";
import { SettingsSidebar } from "./components/SettingsSidebar.js";
import { PermanentDrawer } from "./components/PermanentDrawer.js";
import { QueryPage } from "./components/QueryPage.js";
import { CssBaseline, ThemeProvider, createTheme, Box, Grid } from "@mui/material";
import { LivenessCard } from "./components/LivenessCard.js";
import { Welcomepage } from "./components/Welcomepage.js";

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
    <Welcomepage></Welcomepage>
    // <BrowserRouter>
    //   <ThemeProvider theme={theme}>
    //     <CssBaseline />
    //     <Box sx={{
    //       display: 'flex',
    //       flexDirection: 'column'
    //     }}>

    //       <Header fetchMetrics={fetchMetrics} setFetchMetrics={setFetchMetrics} showSettings={showSettings} setShowSettings={setShowSettings} />
    //       <SettingsSidebar showSettings={showSettings} setShowSettings={setShowSettings}></SettingsSidebar>
    //       <Box sx={{ display: 'flex' }}>
    //         <PermanentDrawer
    //           setShowQueries={setShowQueries}
    //           setShowMessages={setShowMessages}
    //           setShowErrors={setShowErrors}
    //         />
    //         <Box sx={{
    //           display: 'flex',
    //           flexDirection: 'column'
    //         }}>
    //           <Grid container spacing={4} sx={{ display: 'flex', flexDirection: "row", p: 3 }}>
    //             <Grid item xs={4} md={4} lg={4}>
    //               <LivenessCard />
    //             </Grid>
    //             <Grid item xs={4} md={4} lg={4}>
    //               <LivenessCard />
    //             </Grid>
    //             <Grid item xs={4} md={4} lg={4}>
    //               <LivenessCard />
    //             </Grid>
    //           </Grid>
    //           <Routes>
    //             <Route path="/" element={<Homepage showQueries={showQueries} showMessages={showMessages} showErrors={showErrors} />} />
    //             <Route path="/queryPage" element={<QueryPage />} />
    //           </Routes>
    //         </Box>
    //       </Box>
    //     </Box>
    //   </ThemeProvider>
    // </BrowserRouter >

  );
}

export default App;

//PaperProps={{ style: { height: "90vh" } }} <- in Drawer
