"use client"

import { useState, useEffect } from "react"
import { Container, Typography, Grid, Box, CircularProgress, Alert, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
 import { DirectionsCar, AccountBalance, Build, Brush, Toll, Security, Extension, CreditCard } from "@mui/icons-material"
import ServiceCard from "./ServiceCard"

const Services = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [services, setServices] = useState([])
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"))

  useEffect(() => {
    // Simulate data fetching
    const fetchServices = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const servicesData = [
            {
              id: 1,
              title: "Exchange Car",
              description: "Trade in your old car for a new one with our hassle-free exchange program.",
              icon: <DirectionsCar fontSize="large" />,
             },
            {
              id: 2,
              title: "Finance",
              description: "Get competitive rates and flexible payment options for your new vehicle purchase.",
              icon: <AccountBalance fontSize="large" />,
             },
            {
              id: 3,
              title: "Accessories",
              description: "Enhance your vehicle with our wide range of high-quality accessories.",
              icon: <Build fontSize="large" />,
             },
            {
              id: 4,
              title: "Coating",
              description: "Protect your car's paint with our premium coating services.",
              icon: <Brush fontSize="large" />,
             },
            {
              id: 5,
              title: "FastTag",
              description: "Skip the toll lines with our easy-to-install FastTag solutions.",
              icon: <Toll fontSize="large" />,
             },
            {
              id: 6,
              title: "RTO Insurance",
              description: "Comprehensive insurance coverage to protect your vehicle investment.",
              icon: <Security fontSize="large" />,
             },
            {
              id: 7,
              title: "Extended Warranty",
              description: "Extend your vehicle's warranty for additional peace of mind.",
              icon: <Extension fontSize="large" />,
             },
            {
              id: 8,
              title: "Auto Card",
              description: "Exclusive benefits and discounts with our membership auto card.",
              icon: <CreditCard fontSize="large" />,
             },
          ]
          setServices(servicesData)
          setLoading(false)
        }, 1500)
      } catch (err) {
        setError("Failed to load services. Please try again later.")
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const getGridSize = () => {
    if (isSmallScreen) return 12 // Full width on small screens
    if (isMediumScreen) return 6 // Two cards per row on medium screens
    return 4 // Three cards per row on large screens (changed from 3)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ my: 6 }}>
      <Box
        textAlign="center"
        mb={6}
        sx={{
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          padding: "40px 20px",
          borderRadius: "16px",
          color: "white",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Our Services
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
            opacity: 0.9,
          }}
        >
          We offer a comprehensive range of automotive services designed to enhance your vehicle ownership experience.
          From financing to maintenance, we've got you covered every step of the way.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={getGridSize()} key={service.id}>
            <ServiceCard
              title={service.title}
              description={service.description}
              icon={service.icon}
              actionText={service.actionText}
              colorIndex={index}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Services
