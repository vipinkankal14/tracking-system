"use client"

import { useState, useEffect } from "react"
import { Spinner, Dropdown } from "react-bootstrap"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
  Paper,
  Table,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
  Divider,
  styled
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

// Import your SCSS file
import "../scss/CarStockShow.scss"

const CarStockShow = () => {
  const [carStocks, setCarStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCards, setExpandedCards] = useState({})
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

  const location = useLocation()
  const [initialFilters] = useState(location.state || {})

  // Initialize filters with received state
  const [modelFilter, setModelFilter] = useState(initialFilters.model || "")
  const [versionFilter, setVersionFilter] = useState(initialFilters.version || "")
  const [colorFilter, setColorFilter] = useState(initialFilters.color || "")
  const [fuelTypeFilter, setFuelTypeFilter] = useState(initialFilters.fuelType || "")
  const [targetCustomerId] = useState(initialFilters.customerId || "")

  // Unique filter options
  const [modelOptions, setModelOptions] = useState([])
  const [versionOptions, setVersionOptions] = useState([])
  const [colorOptions, setColorOptions] = useState([])
  const [fuelTypeOptions, setFuelTypeOptions] = useState([])

  // Fetch car stock data from backend
  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showAllCarStocks")
        setCarStocks(response.data)

        // Extract unique filter options
        const models = [...new Set(response.data.map((stock) => stock.model).filter(Boolean))]
        const versions = [...new Set(response.data.map((stock) => stock.version).filter(Boolean))]
        const colors = [...new Set(response.data.map((stock) => stock.color).filter(Boolean))]
        const fuelTypes = [...new Set(response.data.map((stock) => stock.fuelType).filter(Boolean))]

        setModelOptions(models)
        setVersionOptions(versions)
        setColorOptions(colors)
        setFuelTypeOptions(fuelTypes)
      } catch (err) {
        setError("Failed to load car stock data.")
        console.error("Error fetching car stocks:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCarStocks()
  }, [])

  // Filter car stocks based on selected filters
  const filteredCarStocks = carStocks.filter((stock) => {
    return (
      (!modelFilter || stock.model === modelFilter) &&
      (!versionFilter || stock.version === versionFilter) &&
      (!colorFilter || stock.color === colorFilter) &&
      (!fuelTypeFilter || stock.fuelType === fuelTypeFilter) &&
      !stock.customerId // Only show cars that are not allotted
    )
  })

  // Helper function to format date (removes time part)
  const formatDate = (dateString) => {
    return dateString ? dateString.slice(0, 10) : "N/A" // Slices "YYYY-MM-DD"
  }

  const handleCarAllotment = (vin) => {
    navigate(`/car-allotment/${vin}`, { 
      state: { 
        targetCustomerId: targetCustomerId // Pass the target customer ID
      }
    })
  }

  // Reset all filters
  const handleResetFilters = () => {
    setModelFilter("")
    setVersionFilter("")
    setColorFilter("")
    setFuelTypeFilter("")
  }

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1) // Go back to previous page
  }

  // Toggle card expansion for mobile view
  const toggleCardExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Render filter controls
  const renderFilterControls = () => (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="model-filter-label">Model</InputLabel>
            <Select
              labelId="model-filter-label"
              id="model-filter"
              value={modelFilter}
              label="Model"
              onChange={(e) => setModelFilter(e.target.value)}
            >
              <MenuItem value="">All Models</MenuItem>
              {modelOptions.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="version-filter-label">Version</InputLabel>
            <Select
              labelId="version-filter-label"
              id="version-filter"
              value={versionFilter}
              label="Version"
              onChange={(e) => setVersionFilter(e.target.value)}
            >
              <MenuItem value="">All Versions</MenuItem>
              {versionOptions.map((version) => (
                <MenuItem key={version} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="color-filter-label">Color</InputLabel>
            <Select
              labelId="color-filter-label"
              id="color-filter"
              value={colorFilter}
              label="Color"
              onChange={(e) => setColorFilter(e.target.value)}
            >
              <MenuItem value="">All Colors</MenuItem>
              {colorOptions.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="fuel-type-filter-label">Fuel Type</InputLabel>
            <Select
              labelId="fuel-type-filter-label"
              id="fuel-type-filter"
              value={fuelTypeFilter}
              label="Fuel Type"
              onChange={(e) => setFuelTypeFilter(e.target.value)}
            >
              <MenuItem value="">All Fuel Types</MenuItem>
              {fuelTypeOptions.map((fuelType) => (
                <MenuItem key={fuelType} value={fuelType}>
                  {fuelType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Reset Filters Button */}
      {(modelFilter || versionFilter || colorFilter || fuelTypeFilter) && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleResetFilters}
            sx={{ textTransform: 'none' }}
          >
            Reset Filters
          </Button>
        </Box>
      )}
    </Box>
  )

  // Render mobile card view
  const renderMobileView = () => (
    <Box sx={{ width: '100%' }}>
      {filteredCarStocks.length > 0 ? (
        filteredCarStocks.map((stock, index) => (
          <Card key={index} sx={{ mb: 2, borderRadius: 1 }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {stock.vin}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleCardExpand(stock.vin)}
                  aria-expanded={expandedCards[stock.vin]}
                  aria-label="show more"
                >
                  {expandedCards[stock.vin] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
              
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Model:</strong> {stock.model}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Color:</strong> {stock.color}
                </Typography>
                <Typography variant="body2">
                  <strong>Version:</strong> {stock.version}
                </Typography>
              </Box>
              
              <Collapse in={expandedCards[stock.vin]} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 1.5 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Chassis:</strong> {stock.chassisNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Engine:</strong> {stock.engineNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Fuel Type:</strong> {stock.fuelType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Mfg Date:</strong> {formatDate(stock.manufacturerDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Date In:</strong> {formatDate(stock.dateIn)}
                    </Typography>
                  </Grid>
                </Grid>
              </Collapse>
            </CardContent>
            
            <CardActions sx={{ pt: 0, pb: 1, px: 2, justifyContent: 'flex-end' }}>
              <IconButton 
                color="success" 
                onClick={() => handleCarAllotment(stock.vin)}
                size="small"
              >
                <AddTaskRoundedIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No records found.</Typography>
        </Paper>
      )}
    </Box>
  )

  // Render tablet view with simplified table
  const renderTabletView = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>VIN</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Fuel Type</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCarStocks.length > 0 ? (
            filteredCarStocks.map((stock, index) => (
              <TableRow key={index}>
                <TableCell>{stock.vin}</TableCell>
                <TableCell>{stock.model}</TableCell>
                <TableCell>{stock.version}</TableCell>
                <TableCell>{stock.color}</TableCell>
                <TableCell>{stock.fuelType}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="success" 
                    onClick={() => handleCarAllotment(stock.vin)}
                    size="small"
                  >
                    <AddTaskRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )

  // Render desktop view with full table
  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>VIN</TableCell>
            <TableCell>Chassis Number</TableCell>
            <TableCell>Engine Number</TableCell>
            <TableCell>Manufacturer Date</TableCell>
            <TableCell>Date In</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Fuel Type</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCarStocks.length > 0 ? (
            filteredCarStocks.map((stock, index) => (
              <TableRow key={index}>
                <TableCell>{stock.vin}</TableCell>
                <TableCell>{stock.chassisNumber}</TableCell>
                <TableCell>{stock.engineNumber}</TableCell>
                <TableCell>{formatDate(stock.manufacturerDate)}</TableCell>
                <TableCell>{formatDate(stock.dateIn)}</TableCell>
                <TableCell>{stock.model}</TableCell>
                <TableCell>{stock.version}</TableCell>
                <TableCell>{stock.color}</TableCell>
                <TableCell>{stock.fuelType}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="success" 
                    onClick={() => handleCarAllotment(stock.vin)}
                    size="small"
                  >
                    <AddTaskRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} align="center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <Box sx={{ p: 3 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackClick}
        sx={{ mb: 2 }}
        variant="text"
      >
        Back
      </Button>
      
      <Typography variant="h6" sx={{ mb: 3, color: "#071947" }}>
        CAR STOCK AVAILABLE
      </Typography>

      {/* Filter Controls */}
      {renderFilterControls()}

      {/* Loading Spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box sx={{ textAlign: 'center', color: 'error.main', p: 2 }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Responsive Content */}
      {!loading && !error && (
        <>
          {isMobile && renderMobileView()}
          {isTablet && renderTabletView()}
          {!isMobile && !isTablet && renderDesktopView()}
        </>
      )}
    </Box>
  )
}

export default CarStockShow