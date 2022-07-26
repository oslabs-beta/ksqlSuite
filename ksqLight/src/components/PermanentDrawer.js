import React from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Toolbar, createTheme, Container, Box } from "@mui/material";
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import MailIcon from '@mui/icons-material/Mail';

export const PermanentDrawer = () => {
  let navigate = useNavigate();
  // const theme = createTheme({
  //   background: {
  //     color: '#1e293b'
  //   }
  // })
  const navQueryPage = () => {
    navigate("/queryPage");
  }

  return (

    <Drawer variant="permanent" sx={{
      width: 240,
    }} >
      <Toolbar />
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <StackedLineChartIcon />
            </ListItemIcon>
            <ListItemText primary="Prometheus" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <StackedLineChartIcon />
            </ListItemIcon>
            <ListItemText primary="ksqlDB" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={navQueryPage}>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="SQL Query" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>

    // </ThemeProvider>
  )
}