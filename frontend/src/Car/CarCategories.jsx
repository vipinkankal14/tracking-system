"use client"

import { useState, useEffect, useMemo } from "react";
import { 
  Tabs, 
  Tab, 
  Typography, 
  Card, 
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
  Container
} from "@mui/material";
import "./CenteredTabs.scss";
import { useNavigate } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
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
  );
}

const CarCategories = () => {
  const [value, setValue] = useState(0);
  const [carStocks, setCarStocks] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Filter states
  const [sortOption, setSortOption] = useState("featured");
  const [modelFilter, setModelFilter] = useState("all");
  const [versionFilter, setVersionFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");

  // Memoized tab configuration
  const tabContent = useMemo(() => [
    {
      label: "Sedans",
      filterFn: (car) => car.carType === "Sedans",
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
      filterFn: (car) => car.fuelType === "Electric Vehicles (EVs)",
    },
  ], []);

  // Memoized filtered cars for current tab
  const currentTabCars = useMemo(() => 
    carStocks.filter(tabContent[value]?.filterFn || (() => true)),
  [carStocks, value, tabContent]);

  // Memoized unique values for filters
  const uniqueModels = useMemo(() => 
    [...new Set(currentTabCars.map(car => car.model))],
  [currentTabCars]);

  const uniqueVersions = useMemo(() => 
    [...new Set(currentTabCars.map(car => car.version))],
  [currentTabCars]);

  const uniqueColors = useMemo(() => 
    [...new Set(currentTabCars.map(car => car.color))],
  [currentTabCars]);

  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/carstocks");
        if (!response.ok) {
          throw new Error("Failed to fetch car stocks");
        }
        const data = await response.json();
        setCarStocks(data);
        setFilteredCars(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarStocks();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...currentTabCars];
    
    // Apply filters
    if (modelFilter !== "all") {
      result = result.filter(car => car.model === modelFilter);
    }
    
    if (versionFilter !== "all") {
      result = result.filter(car => car.version === versionFilter);
    }
    
    if (colorFilter !== "all") {
      result = result.filter(car => car.color === colorFilter);
    }
    
    // Apply sorting
    result = sortCars(result, sortOption);
    
    setFilteredCars(result);
  }, [currentTabCars, sortOption, modelFilter, versionFilter, colorFilter]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Reset filters when changing tabs
    setModelFilter("all");
    setVersionFilter("all");
    setColorFilter("all");
  };

  const handleViewDetails = (car) => {
    navigate(`/car/${encodeURIComponent(car.id)}`);
  };

  const handleBookNow = (car) => {
    navigate("/booking", { state: { carData: car } });
  };

  const sortCars = (cars, option) => {
    const sorted = [...cars];
    switch(option) {
      case "price-low":
        return sorted.sort((a, b) => a.exShowroomPrice - b.exShowroomPrice);
      case "price-high":
        return sorted.sort((a, b) => b.exShowroomPrice - a.exShowroomPrice);
      case "year-new":
        return sorted.sort((a, b) => b.year - a.year);
      case "year-old":
        return sorted.sort((a, b) => a.year - b.year);
      default:
        return sorted; // featured/default sorting
    }
  };

  const formatPrice = (price) => {
    const formatLakhCrore = (value, divisor, unit) => {
      const divided = value / divisor;
      return divided % 1 === 0 ? `${divided} ${unit}` : `${divided.toFixed(2)} ${unit}`;
    };

    if (typeof price === 'number') {
      if (price >= 10000000) {
        return formatLakhCrore(price, 10000000, 'Crore');
      } else if (price >= 100000) {
        return formatLakhCrore(price, 100000, 'Lakh');
      }
      return price.toLocaleString('en-IN');
    }
    
    if (typeof price === 'string') {
      const lowerPrice = price.toLowerCase();
      if (lowerPrice.includes('lakh') || lowerPrice.includes('crore')) {
        return price;
      }
      const numericValue = parseFloat(price.replace(/,/g, ''));
      if (!isNaN(numericValue)) {
        if (numericValue >= 10000000) {
          return formatLakhCrore(numericValue, 10000000, 'Crore');
        } else if (numericValue >= 100000) {
          return formatLakhCrore(numericValue, 100000, 'Lakh');
        }
        return numericValue.toLocaleString('en-IN');
      }
    }
    
    return price;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="car-tabs-container">
      <Typography variant="h4" align="center" gutterBottom className="car-tabs-title">
        Explore Car Categories
      </Typography>

      {/* Sorting and Filtering Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                label="Sort By"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price (Low to High)</MenuItem>
                <MenuItem value="price-high">Price (High to Low)</MenuItem>
                <MenuItem value="year-new">Year (Newest First)</MenuItem>
                <MenuItem value="year-old">Year (Oldest First)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select
                value={modelFilter}
                label="Model"
                onChange={(e) => setModelFilter(e.target.value)}
              >
                <MenuItem value="all">All Models</MenuItem>
                {uniqueModels.map(model => (
                  <MenuItem key={model} value={model}>{model}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Version</InputLabel>
              <Select
                value={versionFilter}
                label="Version"
                onChange={(e) => setVersionFilter(e.target.value)}
              >
                <MenuItem value="all">All Versions</MenuItem>
                {uniqueVersions.map(version => (
                  <MenuItem key={version} value={version}>{version}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={colorFilter}
                label="Color"
                onChange={(e) => setColorFilter(e.target.value)}
              >
                <MenuItem value="all">All Colors</MenuItem>
                {uniqueColors.map(color => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <div className="tabs-wrapper">
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant="scrollable" 
          scrollButtons="auto" 
          className="car-tabs"
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
      </div>

      <TabPanel value={value} index={value}>
        <div className="car-grid">
          {filteredCars.map((car) => (
            <div key={car.id} className="car-grid-item">
              <Card className="car-card">
                <CardContent className="car-card-content">
                  <div className="car-image"></div>
                  <div className="car-details">
                    <Typography variant="h6" className="car-name">
                      {car.model} {car.version} {car.color}
                    </Typography>
                    <Typography variant="body2" className="car-type">
                      {car.carType} • {car.year}
                    </Typography>

                    <Typography className="spec-text">
                      <span className="spec-icon">⚡</span>
                      {car.mileage} Mileage
                    </Typography>

                    <Typography className="spec-text">
                      <span className="spec-icon">🚀</span>
                      {car.engineCapacity} Engine
                    </Typography>

                    <Typography className="spec-text">
                      <span className="spec-icon">💺</span>
                      {car.seatingCapacity || 5} Seats
                    </Typography>

                    <Typography variant="h6" className="car-price">
                      Starting from ₹{formatPrice(car.exShowroomPrice)}
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
    </div>
  );
};

export default CarCategories;