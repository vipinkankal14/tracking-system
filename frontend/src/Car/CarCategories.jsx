"use client"

import { useState, useEffect } from "react"
import { Tabs, Tab, Typography, Card, CardContent, Button } from "@mui/material"
import "./CenteredTabs.scss"
import { useNavigate } from "react-router-dom"

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className="tab-panel"
      {...other}
    >
      {value === index && <div className="tab-panel-content">{children}</div>}
    </div>
  )
}

const CenteredTabs = () => {
  const [value, setValue] = useState(0)
  const [carStocks, setCarStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/carstocks")
        if (!response.ok) {
          throw new Error("Failed to fetch car stocks")
        }
        const data = await response.json()
        setCarStocks(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCarStocks()
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleViewDetails = (car) => {
    navigate(`/car/${encodeURIComponent(car.id)}`)
  }

  const handleBookNow = (car) => {
    navigate("/booking", { state: { carData: car } })
  }

  const tabContent = [
    {
      label: "Sedans",
      content: carStocks.filter((car) => car.carType === "Sedans"),
    },
    {
      label: "SUVs",
      content: carStocks.filter((car) => car.carType === "SUVs (Sports Utility Vehicles)"),
    },
    {
      label: "Hatchbacks",
      content: carStocks.filter((car) => car.carType === "Hatchbacks"),
    },
    {
      label: "Electric",
      content: carStocks.filter((car) => car.fuelType === "Electric Vehicles (EVs)"),
    },
  ]

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography>Error: {error}</Typography>
  }

  return (
    <div className="car-tabs-container">
      <Typography variant="h4" align="center" gutterBottom className="car-tabs-title">
        Explore Car Categories
      </Typography>

      <div className="tabs-wrapper">
        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" className="car-tabs">
          {tabContent.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
              className="car-tab-item"
              sx={{
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            />
          ))}
        </Tabs>
      </div>

      {tabContent.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          <div className="car-grid">
            {tab.content.map((car, carIndex) => (
              <div key={carIndex} className="car-grid-item">
                <Card className="car-card">
                  <CardContent className="car-card-content">
                    <div className="car-image"></div>
                    <div className="car-details">
                      <Typography variant="h6" className="car-name">
                        {car.model} {car.version} {car.color}
                      </Typography>
                      <Typography variant="body2" className="car-type">
                        {car.carType}
                      </Typography>

                      <Typography className="spec-text">
                        {" "}
                        <span className="spec-icon">⚡</span>
                        {car.mileage} Mileage
                      </Typography>

                      <Typography className="spec-text">
                        {" "}
                        <span className="spec-icon">🚀</span>
                        {car.engineCapacity} Engine
                      </Typography>

                      <Typography className="spec-text">
                        <span className="spec-icon">💺</span>5 Seats
                      </Typography>

                      <Typography variant="h6" className="car-price">
                        Starting from ₹{car.exShowroomPrice}
                      </Typography>
                      <div className="car-actions">
                        <Button
                          variant="outlined"
                          color="primary"
                          className="view-details-btn"
                          onClick={() => handleViewDetails(car)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className="book-now-btn"
                          onClick={() => handleBookNow(car)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabPanel>
      ))}
    </div>
  )
}

export default CenteredTabs

