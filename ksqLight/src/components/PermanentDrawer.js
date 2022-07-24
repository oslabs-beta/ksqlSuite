import React from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Toolbar, createTheme, Container } from "@mui/material";
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import MailIcon from '@mui/icons-material/Mail';

export const PermanentDrawer = ({ setShowQueries, setShowMessages, setShowErrors }) => {
  let navigate = useNavigate();
  const theme = createTheme({
    background: {
      color: '#1e293b'
    }
  })
  const navQueryPage = () => {
    navigate("/queryPage");
  }

  const toggleCharts = (type) => {
    if (type === 'queries') {
      setShowQueries(true);
      setShowMessages(false);
      setShowErrors(false);
    }
    else if (type === 'messages') {
      setShowQueries(false);
      setShowMessages(true);
      setShowErrors(false);
    }
    else if (type === 'errors') {
      setShowQueries(false);
      setShowMessages(false);
      setShowErrors(true);
    }

  };



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container disableGutters sx={{
        width: 340,
        height: 'auto', // changed this from auto
        marginBottom: "-2000px", /* any large number will do */
        paddingBottom: "2000px",
        backgroundColor: "#1e293b",
        mx: 0
      }}>
        {/* <Toolbar></Toolbar> */}
        <List sx={{ color: 'white' }}>
          <ListItem>
            <ListItemButton onClick={() => toggleCharts('queries')}>
              <ListItemIcon sx={{ color: 'white' }}>
                <StackedLineChartIcon />
              </ListItemIcon>
              <ListItemText primary="Queries" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => toggleCharts('messages')}>
              <ListItemIcon sx={{ color: 'white' }}>
                <StackedLineChartIcon />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => toggleCharts('errors')}>
              <ListItemIcon sx={{ color: 'white' }}>
                <StackedLineChartIcon />
              </ListItemIcon>
              <ListItemText primary="Errors" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={navQueryPage}>
              <ListItemIcon sx={{ color: 'white' }}>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="SQL Query" />
            </ListItemButton>
          </ListItem>
        </List>
      </Container>
    </ThemeProvider >
  )
}
