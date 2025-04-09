"use client"

import { useState } from "react"
import { Container, Paper, Typography, TextField, Button, Box, Tabs, Tab, Link, Alert } from "@mui/material"
import { Person, Business, ArrowBack } from "@mui/icons-material"
import { useNavigate, Link as RouterLink, useSearchParams } from "react-router-dom"
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
  const [searchParams] = useSearchParams();
  const fromLogin = searchParams.get("fromLogin") === "true";
  const fromLoginOffice = searchParams.get("fromLoginOffice") === "true";

  const initialTab = fromLogin ? 0 : fromLoginOffice ? 1 : 0;
  const [tabValue, setTabValue] = useState(initialTab);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [officeEmpId, setOfficeEmpId] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    if (!fromLogin && !fromLoginOffice) {
      setTabValue(newValue);
      resetForm();
    }
  };

  const resetForm = () => {
    setUserEmail("");
    setOfficeEmpId("");
    setOfficeEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setToken("");
    setStep(1);
    setError("");
    setSuccess("");
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:5000/api/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userEmail,
          type: 'user' 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      
      setSuccess('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfficeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:5000/api/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          emp_id: officeEmpId,
          email: officeEmail,
          type: 'office' 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      
      setSuccess('OTP sent to your office email');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const payload = tabValue === 0 
        ? { email: userEmail, type: 'user', otp }
        : { emp_id: officeEmpId, email: officeEmail, type: 'office', otp };

      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed');
      
      setToken(data.token);
      setSuccess('OTP verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const passwordRequirements = {
      minLength: newPassword.length >= 8,
      hasLowercase: /[a-z]/.test(newPassword),
      hasUppercase: /[A-Z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
    };

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (!token) {
        throw new Error('Session expired. Please start again.');
      }

      const response = await fetch('http://localhost:5000/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_password: newPassword })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password update failed');
      }

      setSuccess('Password updated successfully! Redirecting...');
      setToken("");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message.includes('token') ? 
        `${err.message} Please start again.` : err.message);
      if (err.message.includes('token')) setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={tabValue === 0 ? handleUserSubmit : handleOfficeSubmit}>
      {tabValue === 1 && (
        <TextField
          fullWidth
          label="Employee ID"
          value={officeEmpId}
          onChange={(e) => setOfficeEmpId(e.target.value)}
          margin="normal"
          required
        />
      )}
      <TextField
        fullWidth
        label={tabValue === 0 ? "Email Address" : "Office Email Address"}
        type="email"
        value={tabValue === 0 ? userEmail : officeEmail}
        onChange={(e) => tabValue === 0 
          ? setUserEmail(e.target.value) 
          : setOfficeEmail(e.target.value)}
        margin="normal"
        required
      />
      <Button 
        type="submit" 
        fullWidth 
        variant="contained" 
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP}>
      <Typography variant="body1" gutterBottom>
        OTP sent to {tabValue === 0 ? userEmail : officeEmail}
      </Typography>
      <TextField
        fullWidth
        label="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        inputProps={{ maxLength: 6 }}
        margin="normal"
        required
      />
      <Button 
        type="submit" 
        fullWidth 
        variant="contained" 
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handleUpdatePassword}>
      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        required
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.includes('requirements') ? (
            <Box component="ul" sx={{ pl: 2, mb: 0 }}>
              <li>Minimum 8 characters</li>
              <li>At least one lowercase letter</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </Box>
          ) : error}
        </Alert>
      )}
      <Button 
        type="submit" 
        fullWidth 
        variant="contained" 
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );

  return (
    <div className="forgot-password-page">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Password Recovery
          </Typography>

          {error && !error.includes('requirements') && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {!fromLogin && !fromLoginOffice && (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab label="User" icon={<Person />} disabled={step > 1} />
              <Tab label="Office" icon={<Business />} disabled={step > 1} />
            </Tabs>
          )}

          <TabPanel value={tabValue} index={0}>
            {step === 1 && renderEmailStep()}
            {step === 2 && renderOTPStep()}
            {step === 3 && renderPasswordStep()}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {step === 1 && renderEmailStep()}
            {step === 2 && renderOTPStep()}
            {step === 3 && renderPasswordStep()}
          </TabPanel>

          <Box textAlign="center" mt={3}>
            <Link component={RouterLink} to="/login" sx={{ display: 'flex', alignItems: 'center' }}>
              <ArrowBack fontSize="small" sx={{ mr: 1 }} />
              Back to Login
            </Link>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;