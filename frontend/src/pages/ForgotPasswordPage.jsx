"use client"

import { useState } from "react"
import { Container, Paper, Typography, TextField, Button, Box, Tabs, Tab, Link, useMediaQuery } from "@mui/material"
import { Person, Business, ArrowBack } from "@mui/icons-material"
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useSearchParams } from "react-router-dom"
import "../styles/forgot-password.scss"

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`forgot-tabpanel-${index}`}
      aria-labelledby={`forgot-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const fromLogin = searchParams.get("fromLogin") === "true";
  const fromLoginOffice = searchParams.get("fromLoginOffice") === "true";

  // Set initial tab based on query parameters
  const initialTab = fromLogin ? 0 : fromLoginOffice ? 1 : 0;
  const [tabValue, setTabValue] = useState(initialTab);

  const [userEmail, setUserEmail] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleTabChange = (event, newValue) => {
    // Disable tab switching if coming from LoginPage
    if (!fromLogin && !fromLoginOffice) {
      setTabValue(newValue);
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    console.log("User password reset for:", userEmail);
    setSubmitted(true);
    // Add actual password reset logic here
  };

  const handleOfficeSubmit = (e) => {
    e.preventDefault();
    console.log("Office password reset for:", officeEmail);
    setSubmitted(true);
    // Add actual password reset logic here
  };

  return (
    <div className="forgot-password-page">
      <Container maxWidth="sm" className="forgot-password-container">
        <Paper elevation={3} className="forgot-password-paper">
          <Typography variant="h4" component="h1" align="center" gutterBottom className="forgot-password-title">
            Forgot Password
          </Typography>

          {/* Conditionally render Tabs only if not from LoginPage */}
          {!fromLogin && !fromLoginOffice && (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="forgot password tabs"
              className="forgot-password-tabs"
            >
              <Tab
                icon={<Person />}
                label={isMobile ? "" : "User"}
                iconPosition="start"
                id="forgot-tab-0"
                aria-controls="forgot-tabpanel-0"
              />
              <Tab
                icon={<Business />}
                label={isMobile ? "" : "Office"}
                iconPosition="start"
                id="forgot-tab-1"
                aria-controls="forgot-tabpanel-1"
              />
            </Tabs>
          )}

          {/* User Forgot Password Panel */}
          <TabPanel value={tabValue} index={0}>
            {!submitted ? (
              <form onSubmit={handleUserSubmit} className="forgot-password-form">
              
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
                <Button type="submit" fullWidth variant="contained" color="primary" className="submit-button">
                  Reset Password
                </Button>
              </form>
            ) : (
              <Box className="success-message">
                <Typography variant="h6" gutterBottom>
                  Password Reset Email Sent
                </Typography>
                <Typography variant="body1" paragraph>
                  We've sent a password reset link to {userEmail}. Please check your email and follow the instructions.
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Office Forgot Password Panel */}
          <TabPanel value={tabValue} index={1}>
            {!submitted ? (
              <form onSubmit={handleOfficeSubmit} className="forgot-password-form">
                
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
                <Button type="submit" fullWidth variant="contained" color="primary" className="submit-button">
                  Reset Password
                </Button>
              </form>
            ) : (
              <Box className="success-message">
                <Typography variant="h6" gutterBottom>
                  Password Reset Email Sent
                </Typography>
                <Typography variant="body1" paragraph>
                  We've sent a password reset link to {officeEmail}. Please check your email and follow the instructions.
                </Typography>
              </Box>
            )}
          </TabPanel>

          <Box mt={2} textAlign="center">
            <Link component={RouterLink} to="/login" className="back-to-login">
              <ArrowBack fontSize="small" style={{ marginRight: "5px" }} />
              Back to Login
            </Link>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};



export default ForgotPasswordPage

