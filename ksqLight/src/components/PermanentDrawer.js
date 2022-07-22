import React from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Toolbar, createTheme } from "@mui/material";
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import MailIcon from '@mui/icons-material/Mail';

export const PermanentDrawer = () => {
  let navigate = useNavigate();
  const theme = createTheme({
    background: {
      color: '#1e293b'
    }
  })
  const navQueryPage = () => {
    navigate("/queryPage");
  }

  return (
    <ThemeProvider theme={theme}>
    <Drawer variant="permanent" anchor="left" open={true} PaperProps={{ sx: {backgroundColor: "#1e293b"}}}>
      <Toolbar></Toolbar>
      <List sx={{ color:'white' }}>
        <ListItem>
          <ListItemButton>
            <ListItemIcon sx={{ color:'white' }}>
              <StackedLineChartIcon/>
            </ListItemIcon>
            <ListItemText primary="Prometheus" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemIcon sx={{ color:'white' }}>
              <StackedLineChartIcon/>
            </ListItemIcon>
            <ListItemText primary="ksqlDB" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={navQueryPage}>
            <ListItemIcon sx={{ color:'white' }}>
              <MailIcon/>
            </ListItemIcon>
            <ListItemText primary="SQL Query" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
    </ThemeProvider>
  )
}