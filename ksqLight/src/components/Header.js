import React from "react";
import { Typography, createTheme, Toolbar, AppBar, IconButton } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArticleIcon from '@mui/icons-material/Article';

export const Header = ({ showSettings, setShowSettings, mode, setMode }) => {
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

  return (
    <AppBar className="diagonal-hero-bg" position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <img src={require("../static/ksqLight2.png")} alt="Homepage" width="30" height="30"/>
        <Typography theme={ksqLightTheme} variant="h3" sx={{ flexGrow: 1, pl: 2 }} color="mainPage">ksqLight</Typography>
        <IconButton aria-label="Documentation" onClick={() => { navGithub() }} color="mainPage">
          <ArticleIcon />
        </IconButton>
        <IconButton aria-label="Refresh" color="mainPage" onClick={() => mode === 'light' ? setMode('dark') : setMode('light')}>
          {mode === 'light' ? <DarkModeIcon/> : <LightModeIcon/>}
        </IconButton>
        <IconButton aria-label="Hide" sx={{ pr: 0 }} onClick={() => setShowSettings(!showSettings)} color="mainPage">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar >
  )
};

