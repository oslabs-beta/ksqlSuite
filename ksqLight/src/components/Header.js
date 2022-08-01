import React from "react";
import { Typography, createTheme, Toolbar, AppBar, IconButton } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import SyncIcon from '@mui/icons-material/Sync';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from "react-router-dom";

export const Header = ({ fetchMetrics, setFetchMetrics, showSettings, setShowSettings, mode, setMode }) => {
  const navigate = useNavigate();
  const ksqLightTheme = createTheme({
    typography: {
      fontFamily: 'Raleway',
      fontSize: 9,
    }
  })
  const navGithub = () => {
    window.open(
      "https://github.com/oslabs-beta/ksqljs/", "_blank");
  }
  const navHome = () => {
    navigate("/");
  }

  return (
    <AppBar className="diagonal-hero-bg" position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography onClick={navHome} theme={ksqLightTheme} variant="h3" sx={{ flexGrow: 1 }} color="mainPage">ksqLight</Typography>
        <IconButton aria-label="Documentation" onClick={() => { navGithub() }} color="mainPage">
          <ArticleIcon />
        </IconButton>
        <IconButton aria-label="Refresh" color="mainPage" onClick={() => mode === 'light' ? setMode('dark') : setMode('light')}>
          <SyncIcon />
        </IconButton>
        <IconButton aria-label="Hide" sx={{ pr: 0 }} onClick={() => setShowSettings(!showSettings)} color="mainPage">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar >
  )
};

