import React, { useEffect, useState } from "react";
import { Typography, Toolbar, TextField, Stack, Button } from "@mui/material";
import { Box } from "@mui/system";

export const QueryPage = ({ metricsState }) => {
  const [query, setQuery] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {metricsState.ksqlDBURL !== "" ? (
        <Box
          m={1}
          //margin
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{ width: "80vw", mt: "2em" }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              fullWidth
              multiline
              color="queryPage"
              InputProps={{ sx: { minHeight: "8em" } }}
              variant="outlined"
              label="ksqlDB Query"
              name="query"
            />
            <Button
              color="queryPage"
              variant="outlined"
              sx={{ mt: "2em", alignSelf: "flex-start" }}
              type="submit"
            >
              Run Query
            </Button>
          </form>
        </Box>
      ) : (
        <Box
          m={1}
          //margin
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          sx={{ width: "80vw", mt: "2em" }}
        >
          <Typography
            variant="h6"
            color="queryPage"
            style={{ pt: "12em", color: "#4e4376" }}
          >
            Enter ksqlDB URL in settings menu to submit queries...
          </Typography>
        </Box>
      )}
    </>
    // </Stack>
  );
};
