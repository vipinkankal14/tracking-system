"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Person,
  Business,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import "../styles/login.scss";
import Sidebar from "../Nav/sidebar/Sidebar";

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

const handleError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return "Invalid credentials";
      case 403:
        return "Account not authorized";
      case 429:
        return "Too many attempts. Try again later";
      case 500:
        return "Server error. Please try again later";
      default:
        return error.response.data?.message || "Login failed";
    }
  }
  return "Network error. Please try again";
};

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabValue, setTabValue] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [officeEmpid, setOfficeEmpid] = useState("");
  const [officePassword, setOfficePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usershowPassword, setUserShowPassword] = useState(false);



  // Check for existing valid session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && expiry && Date.now() < parseInt(expiry)) {
      navigate("/login");
    }
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/Customerlogin", {
        customerId,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        const decoded = jwtDecode(response.data.token);
        const expiresAt = decoded.exp * 1000;
        localStorage.setItem("tokenExpiry", expiresAt.toString());

        navigate("/customerProfile");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleOfficeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        emp_id: officeEmpid,
        password: officePassword,
      });

      if (response.data.success) {
        // Store authentication data
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        // Decode and store token expiration
        const decoded = jwtDecode(response.data.token);
        const expiresAt = decoded.exp * 1000;
        localStorage.setItem("tokenExpiry", expiresAt.toString());

        // Navigate to the path provided by backend
        navigate(`/${response.data.user.navigate}`);
      }
    } catch (err) {
      setError(handleError(err));
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
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

          {error && (
            <Alert severity="error" sx={{ margin: 2 }}>
              {error}
            </Alert>
          )}

          {/* User Login Panel */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleUserLogin} className="login-form">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user-email"
                label="Customer Id"
                name="CustomerId"
                autoComplete="CustomerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="user-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={usershowPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setUserShowPassword(!usershowPassword)}
                        edge="end"
                      >
                        {usershowPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="login-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
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
                id="office-empid"
                label="Employee ID"
                name="empid"
                autoComplete="empid"
                value={officeEmpid}
                onChange={(e) => setOfficeEmpid(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="office-password"
                autoComplete="current-password"
                value={officePassword}
                onChange={(e) => setOfficePassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="login-button"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Office Sign In"}
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
