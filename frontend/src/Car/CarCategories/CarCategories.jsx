"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Tabs,
  Tab,
  Typography,
  CardContent,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Chip,
  Stack,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Pagination } from "@mui/material"
 import ParticleBackground from "../effects/ParticleBackground"
import NeonText from "../effects/NeonText"
import HolographicBackground from "../effects/HolographicBackground"
import GlassMorphism from "../effects/GlassMorphism"
 import GlowingBorder from "../effects/GlowingBorder"
 

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

const CarCategories = () => {
  const [value, setValue] = useState(0)
  const [carStocks, setCarStocks] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Filter states
  const [sortOption, setSortOption] = useState("featured")
  const [modelFilter, setModelFilter] = useState("all")
  const [versionFilter, setVersionFilter] = useState("all")
  const [colorFilter, setColorFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)
  const [carsPerPage] = useState(25)

  // Calculate pagination
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  // Memoized tab configuration
  const tabContent = useMemo(
    () => [
      {
        label: "All Cars",
        filterFn: (car) => true,
      },
      {
        label: "Sedans",
        filterFn: (car) => car.carType === "Sedan",
      },
      {
        label: "SUVs",
        filterFn: (car) => car.carType === "SUVs (Sports Utility Vehicles)",
      },
      {
        label: "Hatchbacks",
        filterFn: (car) => car.carType === "Hatchbacks",
      },
      {
        label: "Electric",
        filterFn: (car) => car.fuelType === "Electric",
      },
    ],
    [],
  )

  // Memoized filtered cars for current tab
  const currentTabCars = useMemo(
    () => carStocks.filter(tabContent[value]?.filterFn || (() => true)),
    [carStocks, value, tabContent],
  )

  // Memoized unique values for filters
  const uniqueModels = useMemo(() => [...new Set(currentTabCars.map((car) => car.model))].sort(), [currentTabCars])

  const uniqueVersions = useMemo(() => [...new Set(currentTabCars.map((car) => car.version))].sort(), [currentTabCars])

  const uniqueColors = useMemo(() => [...new Set(currentTabCars.map((car) => car.color))].sort(), [currentTabCars])

  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await fetch("/api/carstocks")
        if (!response.ok) {
          throw new Error("Failed to fetch car stocks")
        }
        const data = await response.json()
        setCarStocks(data)
        setFilteredCars(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCarStocks()
  }, [])

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [sortOption, modelFilter, versionFilter, colorFilter, statusFilter, value])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...currentTabCars]

    // Apply filters
    if (modelFilter !== "all") {
      result = result.filter((car) => car.model === modelFilter)
    }

    if (versionFilter !== "all") {
      result = result.filter((car) => car.version === versionFilter)
    }

    if (colorFilter !== "all") {
      result = result.filter((car) => car.color === colorFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((car) => car.allotmentCarStatus === statusFilter)
    }

    // Apply sorting
    result = sortCars(result, sortOption)

    setFilteredCars(result)
  }, [currentTabCars, sortOption, modelFilter, versionFilter, colorFilter, statusFilter])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    // Reset filters when changing tabs
    setModelFilter("all")
    setVersionFilter("all")
    setColorFilter("all")
    setStatusFilter("all")
  }

  const handleViewDetails = (car) => {
    navigate(`/car/${car.id}`)
  }

  const handleBookNow = (car) => {
    navigate("/booking", { state: { carData: car } })
  }

  const sortCars = (cars, option) => {
    const sorted = [...cars]
    switch (option) {
      case "price-low":
        return sorted.sort((a, b) => a.exShowroomPrice - b.exShowroomPrice)
      case "price-high":
        return sorted.sort((a, b) => b.exShowroomPrice - a.exShowroomPrice)
      case "year-new":
        return sorted.sort((a, b) => new Date(b.manufacturerDate) - new Date(a.manufacturerDate))
      case "year-old":
        return sorted.sort((a, b) => new Date(a.manufacturerDate) - new Date(b.manufacturerDate))
      case "date-new":
        return sorted.sort((a, b) => new Date(b.dateIn) - new Date(a.dateIn))
      case "date-old":
        return sorted.sort((a, b) => new Date(a.dateIn) - new Date(b.dateIn))
      default:
        return sorted // featured/default sorting
    }
  }

  const formatPrice = (price) => {
    if (!price) return "Price on request"

    const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

    // For amounts in lakhs (1,00,000 to 99,99,999)
    if (numericPrice >= 100000 && numericPrice < 10000000) {
      const lakhs = (numericPrice / 100000).toFixed(2)
      return `₹${lakhs} Lakh`
    }
    // For amounts in crores (1,00,00,000 and above)
    else if (numericPrice >= 10000000) {
      const crores = (numericPrice / 10000000).toFixed(2)
      return `₹${crores} Crore`
    }
    // For amounts below 1 lakh
    else {
      const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })
      return formatter.format(numericPrice)
    }
  }

  const getCarImage = (car) => {
    // Use the first available image from image1-4
    return car.image1 || car.image2 || car.image3 || car.image4 || "/default-car.jpg"
  }

  if (loading) {
    return (
      <ParticleBackground
        particleColor="#4f46e5"
        particleCount={30}
        particleSpeed={0.5}
        style={{
          background: "linear-gradient(135deg, #1a1a3a, #0f0f2a)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress sx={{ color: "white" }} />
          <NeonText color="secondary" intensity="medium" style={{ marginTop: "20px" }}>
            <Typography variant="h6">Loading inventory...</Typography>
          </NeonText>
        </Box>
      </ParticleBackground>
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
    <ParticleBackground
      particleColor="#ffffff"
      particleCount={50}
      particleSpeed={0.3}
      particleSize={1.5}
      className="car-tabs-container"
    >
      <HolographicBackground intensity="low" style={{ padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
        <NeonText color="primary" intensity="medium">
          <Typography variant="h4" align="center" gutterBottom className="car-tabs-title">
            Explore Our Car Inventory
          </Typography>
        </NeonText>
      </HolographicBackground>

      {/* Sorting and Filtering Controls */}
      <GlassMorphism intensity="medium" className="filter-controls">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Sort By</InputLabel>
              <Select
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price (Low to High)</MenuItem>
                <MenuItem value="price-high">Price (High to Low)</MenuItem>
                <MenuItem value="year-new">Manufacture Date (Newest)</MenuItem>
                <MenuItem value="year-old">Manufacture Date (Oldest)</MenuItem>
                <MenuItem value="date-new">Arrival Date (Newest)</MenuItem>
                <MenuItem value="date-old">Arrival Date (Oldest)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Model</InputLabel>
              <Select
                value={modelFilter}
                label="Model"
                onChange={(e) => setModelFilter(e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                <MenuItem value="all">All Models</MenuItem>
                {uniqueModels.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Version</InputLabel>
              <Select
                value={versionFilter}
                label="Version"
                onChange={(e) => setVersionFilter(e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                <MenuItem value="all">All Versions</MenuItem>
                {uniqueVersions.map((version) => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Color</InputLabel>
              <Select
                value={colorFilter}
                label="Color"
                onChange={(e) => setColorFilter(e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                <MenuItem value="all">All Colors</MenuItem>
                {uniqueColors.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Allocated">Not Available</MenuItem>
                <MenuItem value="Not Allocated">Available</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </GlassMorphism>

      <GlassMorphism intensity="medium" className="tabs-wrapper">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          className="car-tabs"
          TabIndicatorProps={{
            style: {
              background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
              height: 3,
              borderRadius: 1.5,
              boxShadow: "0 0 10px rgba(79, 70, 229, 0.7)",
            },
          }}
        >
          {tabContent.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
              className="car-tab-item"
            />
          ))}
        </Tabs>
      </GlassMorphism>

      <TabPanel value={value} index={value}>
        {filteredCars.length === 0 ? (
          <GlassMorphism intensity="medium" style={{ padding: "20px", textAlign: "center" }}>
            <NeonText color="secondary" intensity="medium">
              <Typography variant="h6">No cars found matching your criteria</Typography>
            </NeonText>
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => {
                setModelFilter("all")
                setVersionFilter("all")
                setColorFilter("all")
                setStatusFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </GlassMorphism>
        ) : (
          <>
            <div className="car-grid">
              {currentCars.map((car) => (
                <div key={car.id} className="car-grid-item">
                     <GlowingBorder colors="blue" intensity="medium">
                      <GlassMorphism intensity="medium" className="car-card">
                        <CardContent className="car-card-content" sx={{ p: 1.5 }}>
                          <Box
                            component="img"
                            src={getCarImage(car)}
                            alt={`${car.model} ${car.version}`}
                            className="car-card-image"
                            sx={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              mb: 1,
                              borderRadius: 1,
                            }}
                          />

                          <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                            <Chip
                              label={car.allotmentCarStatus === "Allocated" ? "Out of Stock" : "Available"}
                              size="small"
                              color={car.allotmentCarStatus === "Allocated" ? "error" : "success"}
                              sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                boxShadow:
                                  car.allotmentCarStatus === "Allocated"
                                    ? "0 0 8px rgba(211, 47, 47, 0.5)"
                                    : "0 0 8px rgba(46, 125, 50, 0.5)",
                              }}
                            />
                            <Chip
                              label={car.fuelType}
                              size="small"
                              color="info"
                              sx={{
                                height: 20,
                                fontSize: "0.65rem",
                                boxShadow: "0 0 8px rgba(3, 169, 244, 0.5)",
                              }}
                            />
                          </Stack>

                          <NeonText color="secondary" intensity="low">
                            <Typography variant="subtitle1" sx={{ fontSize: "0.9rem", mb: 0.5 }}>
                              {car.model} {car.version}
                            </Typography>
                          </NeonText>

                          <Typography variant="body2" sx={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.7)" }}>
                            <strong>Color:</strong> {car.color}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="body2" sx={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.7)" }}>
                              {car.carType}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.7)" }}>
                              <strong>Mileage:</strong> {car.mileage}
                            </Typography>
                          </Box>

                          <NeonText color="primary" intensity="medium">
                            <Typography variant="subtitle2" sx={{ fontSize: "0.8rem", mb: 1 }}>
                              {formatPrice(car.exShowroomPrice)}
                            </Typography>
                          </NeonText>

                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              fullWidth
                              sx={{
                                fontSize: "0.7rem",
                                py: 0.5,
                                color: "white",
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                "&:hover": {
                                  borderColor: "white",
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                              }}
                              onClick={() => handleViewDetails(car)}
                            >
                              Details
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              fullWidth
                              sx={{
                                fontSize: "0.7rem",
                                py: 0.5,
                                background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
                                boxShadow: "0 0 10px rgba(79, 70, 229, 0.5)",
                                "&:hover": {
                                  background: "linear-gradient(90deg, #3730a3, #0891b2)",
                                  boxShadow: "0 0 15px rgba(79, 70, 229, 0.7)",
                                },
                              }}
                              disabled={car.allotmentCarStatus === "Allocated"}
                              onClick={() => handleBookNow(car)}
                            >
                              {car.allotmentCarStatus === "Allocated" ? "Out of Stock" : "Book Now"}
                            </Button>
                          </Box>
                        </CardContent>
                      </GlassMorphism>
                    </GlowingBorder>
                 </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <GlassMorphism intensity="low" style={{ padding: "10px", borderRadius: "10px" }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: { xs: "0.75rem", sm: "0.75rem" },
                        minWidth: { xs: 32, sm: 32 },
                        height: { xs: 32, sm: 32 },
                        margin: { xs: "0 2px", sm: "0 4px" },
                        color: "white",
                      },
                      "& .MuiPaginationItem-ellipsis": {
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        color: "white",
                      },
                      "& .Mui-selected": {
                        background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.7)",
                      },
                    }}
                  />
                </GlassMorphism>
              </Box>
            )}
          </>
        )}
      </TabPanel>
    </ParticleBackground>
  )
}

export default CarCategories
