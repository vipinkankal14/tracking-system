"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Slider,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

const Sidebar = () => {
  const [priceRange, setPriceRange] = useState([10000, 50000])

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const makes = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi"]
  const years = ["2023", "2022", "2021", "2020", "2019", "2018"]
  const bodyTypes = ["Sedan", "SUV", "Coupe", "Truck", "Hatchback", "Convertible"]
  const features = ["Navigation", "Bluetooth", "Leather Seats", "Sunroof", "Backup Camera", "Heated Seats"]

  return (
    <Paper elevation={1} className="sidebar">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom className="sidebar-title">
          Find Your Dream Car
        </Typography>

        <TextField
          fullWidth
          placeholder="Search..."
          variant="outlined"
          size="small"
          className="search-field"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ minWidth: "36px", p: 0 }}
                  className="search-btn"
                >
                  <SearchIcon fontSize="small" />
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Accordion defaultExpanded className="filter-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="price-range-content" id="price-range-header">
            <Typography className="filter-title">Price Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 1 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="off"
                min={0}
                max={100000}
                step={1000}
                className="price-slider"
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[0].toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[1].toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion className="filter-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="make-content" id="make-header">
            <Typography className="filter-title">Make</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="checkbox-group">
              {makes.map((make) => (
                <FormControlLabel
                  key={make}
                  control={<Checkbox size="small" />}
                  label={make}
                  className="filter-checkbox"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion className="filter-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="year-content" id="year-header">
            <Typography className="filter-title">Year</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="checkbox-group">
              {years.map((year) => (
                <FormControlLabel
                  key={year}
                  control={<Checkbox size="small" />}
                  label={year}
                  className="filter-checkbox"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion className="filter-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="body-type-content" id="body-type-header">
            <Typography className="filter-title">Body Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="checkbox-group">
              {bodyTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={<Checkbox size="small" />}
                  label={type}
                  className="filter-checkbox"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion className="filter-accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="features-content" id="features-header">
            <Typography className="filter-title">Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="checkbox-group">
              {features.map((feature) => (
                <FormControlLabel
                  key={feature}
                  control={<Checkbox size="small" />}
                  label={feature}
                  className="filter-checkbox"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 3 }} className="filter-actions">
          <Button variant="contained" color="primary" fullWidth className="apply-btn">
            Apply Filters
          </Button>
          <Button variant="outlined" fullWidth sx={{ mt: 1 }} className="reset-btn">
            Reset Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default Sidebar

