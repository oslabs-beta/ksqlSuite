import React from "react";
import { Typography, createTheme, Box, Fade, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Welcomepage = () => {
  // const navigate = useNavigate();

  // const navHome = () => {
  //   navigate("/dashboard");
  // };

  return (
    <Box>
      <Box className="diagonal-hero-bg">
        <Box className="stars">
          <Box className="small"></Box>
          <Box className="medium"></Box>
          <Box className="big"></Box>
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* <Fade in={true} timeout={2000} >
          <Typography
            sx={{
              fontSize: "75px",
              color: "#f3e5f5"
            }}
          >
            Welcome
          </Typography>
        </Fade> */}
        <Fade in={true} timeout={2000} >
          <Typography
            sx={{
              fontSize: "165px",
              color: "#f3e5f5"
            }}
          >ksqLight.</Typography>
        </Fade>
        <Fade in={true} timeout={2000} style={{ transitionDelay: `1000ms` }}>
          <Button variant="outlined" sx={{ color: "#f3e5f5" }}>Get Started</Button>
          {/* <Typography
            sx={{
              fontSize: "25px",
              color: "#f3e5f5"
            }}
          >to get started, enter your prometheus URL below</Typography> */}
        </Fade>
      </Box>
    </Box>


  );
};

