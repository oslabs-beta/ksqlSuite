import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, createTheme, Toolbar, AppBar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import { styled } from "@mui/styles";

// const useStyles = makeStyles(() => {
//   return ({
//     appBar: {
//       zIndex: (theme) => theme.zIndex.drawer + 1
//     }
//   })
// })

export const Header = ({ fetchMetrics, setFetchMetrics, showSettings, setShowSettings }) => {
  let navigate = useNavigate();

  const ksqLightTheme = createTheme({
    typography:{
      fontFamily: 'Raleway'
    }
  })
  // const theme = useTheme();
  // const classes = useStyles(theme);

  return (
    
    <AppBar position="fixed" >
      <Toolbar>
        <Typography theme={ksqLightTheme} variant="h3">ksqLight</Typography>
      </Toolbar>
    </AppBar>
  )
}

// eslint-disable-next-line no-lone-blocks
{/* <nav className="flex items-center justify-between flex-wrap bg-gradient-to-r h-16 from-cyan-700 to-sky-700 background-animate p-3">
<div className="flex items-center flex-shrink-0 text-white mr-6">
  <button onClick={() => {navHomepage()}} className="font-raleway font-bold text-3xl tracking-tight">ksqLight</button>
</div>
<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
  <div className="lg:flex-grow"></div>
  <button onClick={() => {navGithub()}} className="flex items-center px-2 py-2 text-teal-200 hover:text-white hover:border-white">
    <svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm2 6a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H7z" clipRule="evenodd"/></svg>
  </button>
  <button className="flex items-center px-2 py-2 text-teal-200 hover:text-white hover:border-white">
    <svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 0 1 1 1v2.101a7.002 7.002 0 0 1 11.601 2.566 1 1 0 1 1-1.885.666A5.002 5.002 0 0 0 5.999 7H9a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm.008 9.057a1 1 0 0 1 1.276.61A5.002 5.002 0 0 0 14.001 13H11a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-2.101a7.002 7.002 0 0 1-11.601-2.566 1 1 0 0 1 .61-1.276z" clipRule="evenodd"/></svg>
  </button>
  <button className="flex items-center px-2 py-2 text-teal-200 hover:text-white hover:border-white">
    <svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-12a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l2.828 2.829a1 1 0 1 0 1.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
  </button>
  <button onClick={() => toggleMetrics()} className="flex items-center px-2 py-2 text-teal-200 hover:text-white hover:border-white">
    {fetchMetrics ? pauseButtonSVG() : playButtonSVG()}
  </button>
  <button className="flex items-center px-2 py-2 text-teal-200 hover:text-white hover:border-white">
    <svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor"><path d="M2 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5zm6-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7zm6-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4z"/></svg>
  </button>
  <button onClick={() => toggleSettings()} className="flex items-center px-2 py-2 text-teal-200 hover:text-white hover:border-white">
    <svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 0 1 2.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 0 1 .947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 0 1-2.287-.947zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clipRule="evenodd"/></svg>
  </button>
</div>
</nav> */}

  // const toggleMetrics = () => {
  //   setFetchMetrics(!fetchMetrics);
  // }
  // const toggleSettings = () => {
  //   setShowSettings(!showSettings);
  // }
  // const navGithub = () => {
  //   window.open(
  //   "https://github.com/oslabs-beta/ksqljs/", "_blank");
  // }
  // const navHomepage = () => {
  //   navigate("/")
  // }
  
  // const playButtonSVG = () => {
  //   return(<svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z" clipRule="evenodd"/></svg>)
  // }
  // const pauseButtonSVG = () => {
  //   return(<svg className="h-5 w-5" viewBox="0 0 18 18" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM7 8a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V8zm5-1a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1z" clipRule="evenodd"/></svg>)
  // }