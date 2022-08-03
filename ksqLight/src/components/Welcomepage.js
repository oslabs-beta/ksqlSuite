import { useState } from "react";
import { Typography, TextField, Box, Fade, Button, Stack } from "@mui/material";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
});

export const Welcomepage = ({ setMetricsState, metricsState }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [invalidPrometheusMessage, setInvalidPrometheusMessage] =
    useState(null);
  const [url, setUrl] = useState("");

  const handleClick = () => {
    setShowTextBox(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const {
        data: {
          isValidPrometheusURL: {
            isValid: prometheusValid,
            error: prometheusError,
          },
        },
      } = await client.query({
        query: gql`
            query validatePrometheusURL{
              isValidPrometheusURL(prometheusURL: "${url}") {
                isValid,
                error
              }
            }
        `,
      });
      if (prometheusError) {
        setInvalidPrometheusMessage(prometheusError);
        return;
      } else if (prometheusValid) {
        setInvalidPrometheusMessage(null);
      }
      setMetricsState({
        ...metricsState,
        prometheusURL: url,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box className="diagonal-hero-bg">
        <Box className="stars">
          <Box className="small"></Box>
          <Box className="medium"></Box>
          <Box className="big"></Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={true} timeout={2000}>
          <Typography
            sx={{
              fontFamily: "Raleway",
              fontSize: "165px",
              color: "#f3e5f5",
            }}
          >
            ksqLight.
          </Typography>
        </Fade>

        {showTextBox ? (
          <>
            {!invalidPrometheusMessage ? (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2} direction="row">
                  <TextField
                    autoComplete="off"
                    autoFocus={true}
                    color="mainPage"
                    inputProps={{
                      style: { color: "#f3e5f5" },
                    }}
                    variant="outlined"
                    label="Prometheus URL"
                    name="prometheus-url"
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button
                    color="mainPage"
                    variant="outlined"
                    // sx={{ color: "#f3e5f5" }}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Stack>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2} direction="row">
                  <TextField
                    error
                    autoComplete="off"
                    autoFocus={true}
                    color="mainPage"
                    inputProps={{
                      style: { color: "#f3e5f5" },
                    }}
                    variant="outlined"
                    label="Prometheus URL"
                    name="prometheus-url"
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button
                    color="mainPage"
                    variant="outlined"
                    // sx={{ color: "#f3e5f5" }}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Stack>
                <Typography variant="h8" sx={{ color: "red" }}>
                  {invalidPrometheusMessage}
                </Typography>
              </form>
            )}
          </>
        ) : (
          <Fade in={true} timeout={2000} style={{ transitionDelay: `1000ms` }}>
            <Button
              color="mainPage"
              variant="outlined"
              sx={{ color: "#f3e5f5" }}
              onClick={() => handleClick()}
            >
              Get Started
            </Button>
          </Fade>
        )}
      </Box>
    </Box>
  );
};
