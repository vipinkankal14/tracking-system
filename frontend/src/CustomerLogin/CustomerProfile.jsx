"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Container, Typography, Button, Box, CircularProgress, Alert, Tabs, Tab } from "@mui/material"
import {
  Person,
  DirectionsCar,
  CreditCard,
  Inventory,
  Brush,
  Description,
  Receipt,
  Timeline,
} from "@mui/icons-material"
 
import ParticleBackground from "./effects/ParticleBackground"
 import "./styles/effects.css"
import GlassMorphism from "./effects/GlassMorphism"
import CustomerStatus from "./Components/CustomerStatus"
import ProfileHeader from "./Components/ProfileHeader"
import PersonalInfo from "./Components/PersonalInfo"
import CarDetails from "./Components/CarDetails"
import FinanceInfo from "./Components/FinanceInfo"
import AccessoriesInfo from "./Components/AccessoriesInfo"
import ServicesInfo from "./Components/ServicesInfo"
import DocumentsInfo from "./Components/DocumentsInfo"
import InvoiceInfo from "./Components/InvoiceInfo"

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
      <Box
        className="loading-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #2a2a72, #009ffd)",
        }}
      >
        <CircularProgress
          sx={{
            color: "white",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
        />
        <Typography variant="h6" sx={{ mt: 2, color: "white", textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}>
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
    <ParticleBackground
      particleColor="#ffffff"
      particleCount={50}
      particleSpeed={0.3}
      particleSize={1.5}
      className="customer-profile"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,rgb(218, 218, 218),rgb(218, 218, 218))",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ProfileHeader userData={userData} />

        <Box sx={{ mt: 4 }}>
          <CustomerStatus userData={userData} onViewDetails={(tabIndex) => setTabValue(tabIndex)} />
        </Box>

         

        <GlassMorphism intensity="medium" sx={{ mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="profile tabs"
            className="profile-tabs"
            sx={{
              "& .MuiTab-root": {
                color: "rgba(0, 0, 0, 0.7)",
                 
              },
              "& .MuiTabs-indicator": {
                background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
                height: 3,
                borderRadius: 1.5,
                boxShadow: "0 0 10px rgba(79, 70, 229, 0.7)",
              },
            }}
          >
            <Tab
              icon={<Person sx={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))" }} />}
              label="Personal"
              {...a11yProps(0)}
            />
            <Tab
              icon={<DirectionsCar sx={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))" }} />}
              label="Car"
              {...a11yProps(1)}
            />
            <Tab
              icon={<CreditCard sx={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))" }} />}
              label="Finance"
              {...a11yProps(2)}
            />
            <Tab
              icon={<Inventory sx={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))" }} />}
              label="Accessories"
              {...a11yProps(3)}
            />
            <Tab
              icon={<Brush sx={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))" }} />}
              label="Services"
              {...a11yProps(4)}
            />
            <Tab
              icon={<Description sx={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))" }} />}
              label="Documents"
              {...a11yProps(5)}
            />
            <Tab
              icon={<Receipt sx={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))" }} />}
              label="Invoice"
              {...a11yProps(6)}
            />
             
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
        
        </GlassMorphism>
      </Container>
    </ParticleBackground>
  )
}

export default CustomerProfile
