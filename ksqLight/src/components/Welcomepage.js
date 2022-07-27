import React from "react";
import { Typography, createTheme, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Welcomepage = () => {
  const navigate = useNavigate();

  const navHome = () => {
    navigate("/dashboard");
  };

  return (
    <Box class="hero">
      <Box class="diagonal-hero-bg">
        <Box class="stars">
          <Box class="small"></Box>
          <Box class="medium"></Box>
          <Box class="big"></Box>
        </Box>
      </Box>
    </Box>
  );
};

