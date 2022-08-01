import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  Box,
} from "@mui/material";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import MailIcon from "@mui/icons-material/Mail";

export const PermanentDrawer = ({
  setShowQueries,
  setShowMessages,
  setShowErrors,
  setShowQuery,
}) => {
  let navigate = useNavigate();

  const navQueryPage = () => {
    navigate("/queryPage");
  };

  const toggleCharts = (type) => {
    if (type === "queries") {
      setShowQueries(true);
      setShowMessages(false);
      setShowErrors(false);
      setShowQuery(false);
    } else if (type === "messages") {
      setShowQueries(false);
      setShowMessages(true);
      setShowErrors(false);
      setShowQuery(false);
    } else if (type === "errors") {
      setShowQueries(false);
      setShowMessages(false);
      setShowErrors(true);
      setShowQuery(false);
    } else if (type === "queryPage") {
      setShowQuery(true);
      setShowQueries(false);
      setShowMessages(false);
      setShowErrors(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto", // changed this from auto
        // marginBottom: "-2000px", /* any large number will do */
        // paddingBottom: "2000px",
        mx: 0,
      }}
    >
      <CssBaseline />
      <List>
        <ListItem>
          <ListItemButton onClick={() => toggleCharts("queries")}>
            <ListItemIcon>
              <StackedLineChartIcon />
            </ListItemIcon>
            <ListItemText primary="Queries" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => toggleCharts("messages")}>
            <ListItemIcon>
              <StackedLineChartIcon />
            </ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => toggleCharts("errors")}>
            <ListItemIcon>
              <StackedLineChartIcon />
            </ListItemIcon>
            <ListItemText primary="Errors" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => toggleCharts("queryPage")}>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="SQL Query" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};
