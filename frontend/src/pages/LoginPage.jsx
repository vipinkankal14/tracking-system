"use client";

import { useState } from "react";
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Person, Business } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import "../styles/login.scss";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabValue, setTabValue] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [officePassword, setOfficePassword] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserLogin = (e) => {
    e.preventDefault();
    console.log("User login:", { email: userEmail, password: userPassword });
    // Add actual login logic here
  };

  const handleOfficeLogin = (e) => {
    e.preventDefault();
    console.log("Office login:", {
      email: officeEmail,
      password: officePassword,
    });
    // Add actual login logic here
  };

  return (
    <div className="login-page">
      <Container maxWidth="sm" className="login-container">
        <Paper elevation={3} className="login-paper">
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            className="login-title"
          >
            Login
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="login tabs"
            className="login-tabs"
          >
            <Tab
              icon={<Person />}
              label={isMobile ? "" : "User Login"}
              iconPosition="start"
              id="login-tab-0"
              aria-controls="login-tabpanel-0"
            />
            <Tab
              icon={<Business />}
              label={isMobile ? "" : "Office Login"}
              iconPosition="start"
              id="login-tab-1"
              aria-controls="login-tabpanel-1"
            />
          </Tabs>

          {/* User Login Panel */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleUserLogin} className="login-form">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user-email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="user-password"
                autoComplete="current-password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="login-button"
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    component={RouterLink}
                    to="/forgot-password?fromLogin=true"
                    variant="body2"
                  >
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </form>
          </TabPanel>

          {/* Office Login Panel */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleOfficeLogin} className="login-form">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="office-email"
                label="Office Email Address"
                name="email"
                autoComplete="email"
                value={officeEmail}
                onChange={(e) => setOfficeEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="office-password"
                autoComplete="current-password"
                value={officePassword}
                onChange={(e) => setOfficePassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="login-button"
              >
                Office Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    component={RouterLink}
                    to="/forgot-password?fromLoginOffice=true"
                    variant="body2"
                  >
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
