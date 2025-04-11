"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Container, Paper, Typography, Button, Box, CircularProgress, Alert, Tabs, Tab } from "@mui/material"
import { Person, DirectionsCar, CreditCard, Inventory, Brush, Description, Receipt, Logout } from "@mui/icons-material"
import ProfileHeader from "./Components/ProfileHeader"
import PersonalInfo from "./Components/PersonalInfo"
import CarDetails from "./Components/CarDetails"
import FinanceInfo from "./Components/FinanceInfo"
 import ServicesInfo from "./Components/ServicesInfo"
import DocumentsInfo from "./Components/DocumentsInfo"
import InvoiceInfo from "./Components/InvoiceInfo"
import AccessoriesInfo from "./Components/AccessoriesInfo"
 
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  }
}

const CustomerProfile = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tabValue, setTabValue] = useState(0)

  // Check authentication and fetch user data
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const expiry = localStorage.getItem("tokenExpiry")

    if (!token || !expiry || Date.now() >= Number.parseInt(expiry)) {
      navigate("/login")
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/get/CustomerProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUserData(response.data.user)
        localStorage.setItem("userData", JSON.stringify(response.data.user))
      } catch (err) {
        setError("Failed to fetch user data")
        console.error("Profile fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleLogout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("tokenExpiry")

    // Redirect to login page
    navigate("/login")
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile data...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}. Please try refreshing the page or logging in again.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Return to Login
        </Button>
      </Container>
    )
  }

  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          No user data found. Please log in again.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Return to Login
        </Button>
      </Container>
    )
  }

  return (
    <div className="customer-profile">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box className="profile-header-container" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" className="page-title">
            Customer Profile
          </Typography>
          <Button variant="outlined" color="primary" startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <ProfileHeader userData={userData} />

        <Paper sx={{ mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="profile tabs"
            className="profile-tabs"
          >
            <Tab icon={<Person />} label="Personal" {...a11yProps(0)} />
            <Tab icon={<DirectionsCar />} label="Car" {...a11yProps(1)} />
            <Tab icon={<CreditCard />} label="Finance" {...a11yProps(2)} />
            <Tab icon={<Inventory />} label="Accessories" {...a11yProps(3)} />
            <Tab icon={<Brush />} label="Services" {...a11yProps(4)} />
            <Tab icon={<Description />} label="Documents" {...a11yProps(5)} />
            <Tab icon={<Receipt />} label="Invoice" {...a11yProps(6)} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <PersonalInfo userData={userData} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CarDetails userData={userData} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <FinanceInfo userData={userData} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <AccessoriesInfo userData={userData} />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <ServicesInfo userData={userData} />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <DocumentsInfo userData={userData} />
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <InvoiceInfo userData={userData} />
          </TabPanel>
        </Paper>
      </Container>
    </div>
  )
}

export default CustomerProfile
