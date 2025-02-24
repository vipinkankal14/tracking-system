import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Modal,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import '../scss/AddCarStock.scss';

const AddCarStock = () => {
  const [formData, setFormData] = useState({
    carType: '',
    mileage: '',
    batteryCapacity: '',
    vin: '',
    manufacturerDate: '',
    dateIn: '',
    model: '',
    color: '',
    fuelType: '',
    chassisNumber: '',
    engineNumber: '',
    version: '',
    groundClearance: '',
    engineCapacity: '',
    transmission: '',
    exShowroomPrice: '',
    bookingAmount: '',
  });

  const [errors, setErrors] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [modalVariant, setModalVariant] = useState('success');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.vin.length !== 17) {
      newErrors.vin = 'VIN must be exactly 17 characters.';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required.';
    }
    if (!formData.manufacturerDate) {
      newErrors.manufacturerDate = 'Manufacturer date is required.';
    }
    if (!formData.dateIn) {
      newErrors.dateIn = 'Date In is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/CarStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setModalMessage('Car stock data submitted successfully!');
        setModalVariant('success');
        setFormData({
          carType: '',
          mileage: '',
          batteryCapacity: '',
          vin: '',
          manufacturerDate: '',
          dateIn: '',
          model: '',
          color: '',
          fuelType: '',
          chassisNumber: '',
          engineNumber: '',
          version: '',
          groundClearance: '',
          engineCapacity: '',
          transmission: '',
          exShowroomPrice: '',
          bookingAmount: '',
        });
      } else {
        throw new Error(result.message || 'Duplicate VIN entry. This car stock already exists.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setModalMessage(error.message || 'An error occurred while submitting the data.');
      setModalVariant('error');
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  }
};

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <Container maxWidth="lg">
      <>
        <Typography variant="h4" align="center" gutterBottom>
          ADD CAR STOCK
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Grid container spacing={3}>
            {/* Car Type */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="carType-label">Car Type</InputLabel>
                <Select
                  labelId="carType-label"
                  name="carType"
                  value={formData.carType}
                  onChange={handleInputChange}
                  label="Car Type"
                  error={!!errors.carType}
                >
                  <MenuItem value="">Select Car Type</MenuItem>
                  <MenuItem value="Motorcycles">🔋 Electric Vehicles (EVs)</MenuItem>
                  <MenuItem value="Petrol">🚗 Sedans</MenuItem>
                  <MenuItem value="Diesel">🚙 Hatchbacks</MenuItem>
                  <MenuItem value="Electric">🚜 SUVs (Sports Utility Vehicles)</MenuItem>
                  <MenuItem value="Hybrid">🚐 MPVs (Multi-Purpose Vehicles) / Minivans</MenuItem>
                  <MenuItem value="Coupes">🚘 Coupes</MenuItem>
                  <MenuItem value="Convertibles">🏎 Convertibles</MenuItem>
                  <MenuItem value="Pickup Trucks">🚛 Pickup Trucks</MenuItem>
                  <MenuItem value="Vans">🚚 Vans</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* VIN Number */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="VIN Number"
                name="vin"
                value={formData.vin}
                onChange={handleInputChange}
                error={!!errors.vin}
                helperText={errors.vin}
                inputProps={{ maxLength: 17 }}
              />
            </Grid>

            {/* Chassis Number */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Chassis Number"
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Engine Number */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Engine Number"
                name="engineNumber"
                value={formData.engineNumber}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Manufacturer Date */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Manufacturer Date"
                name="manufacturerDate"
                type="date"
                value={formData.manufacturerDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.manufacturerDate}
                helperText={errors.manufacturerDate}
              />
            </Grid>

            {/* Date In */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Date In"
                name="dateIn"
                type="date"
                value={formData.dateIn}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateIn}
                helperText={errors.dateIn}
              />
            </Grid>

            {/* Fuel Type */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="fuelType-label">Fuel Type</InputLabel>
                <Select
                  labelId="fuelType-label"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  label="Fuel Type"
                >
                  <MenuItem value="">Select Fuel Type</MenuItem>
                  <MenuItem value="Petrol">⛽ Petrol (Gasoline) Cars</MenuItem>
                  <MenuItem value="Diesel">🛢 Diesel Cars</MenuItem>
                  <MenuItem value="Electric Vehicles (EVs)">⚡ Electric Vehicles (EVs)</MenuItem>
                  <MenuItem value="LPG">🚛 LPG (Liquefied Petroleum Gas) Cars</MenuItem>
                  <MenuItem value="CNG">🔥 CNG (Compressed Natural Gas) Cars</MenuItem>
                  <MenuItem value="Hybrid-Cars-DE">🔋⛽ Hybrid Cars (Diesel + Electric)</MenuItem>
                  <MenuItem value="Hybrid-Cars-PE">🔋⛽ Hybrid Cars (Petrol + Electric )</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Battery Capacity (Conditional) */}
            {formData.fuelType === 'Electric Vehicles (EVs)' && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Battery Capacity"
                  name="batteryCapacity"
                  type="number"
                  value={formData.batteryCapacity}
                  onChange={handleInputChange}
                  error={!!errors.batteryCapacity}
                  helperText={errors.batteryCapacity}
                />
              </Grid>
            )}

            <Box sx={{ width: '100%' }}></Box>

            {/* Model */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                error={!!errors.model}
                helperText={errors.model}
              />
            </Grid>

            {/* Version */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Version"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Color */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Mileage */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleInputChange}
                error={!!errors.mileage}
                helperText={errors.mileage}
              />
            </Grid>

            {formData.fuelType !== 'Electric Vehicles (EVs)' && (
              <>
                {/* Engine Capacity */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Engine Capacity"
                    name="engineCapacity"
                    type="number"
                    value={formData.engineCapacity}
                    onChange={handleInputChange}
                    error={!!errors.engineCapacity}
                    helperText={errors.engineCapacity}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ground Clearance"
                name="groundClearance"
                type="number"
                value={formData.groundClearance}
                onChange={handleInputChange}
                error={!!errors.groundClearance}
                helperText={errors.groundClearance}
              />
            </Grid>

            {/* Transmission Type */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="transmission-label">Transmission Type</InputLabel>
                <Select
                  labelId="transmission-label"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  label="Transmission Type"
                >
                  <MenuItem value="">Select Transmission Type</MenuItem>
                  <MenuItem value="Manual">Manual</MenuItem>
                  <MenuItem value="Automatic">Automatic</MenuItem>
                  <MenuItem value="Semi-Automatic">Semi-Automatic</MenuItem>
                  <MenuItem value="CVT">CVT (Continuously Variable Transmission)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Ex-Showroom Price */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ex-Showroom Price"
                name="exShowroomPrice"
                type="number"
                value={formData.exShowroomPrice}
                onChange={handleInputChange}
                error={!!errors.exShowroomPrice}
                helperText={errors.exShowroomPrice}
              />
            </Grid>

            {/* Booking Amount */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Booking Amount"
                name="bookingAmount"
                type="number"
                value={formData.bookingAmount}
                onChange={handleInputChange}
                error={!!errors.bookingAmount}
                helperText={errors.bookingAmount}
              />
            </Grid>
          </Grid>


            
          

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </>

      {/* Result Modal */}
      <Modal open={showModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {modalVariant === 'success' ? 'Success' : 'Error'}
          </Typography>
          <Typography sx={{ mt: 2 }}>{modalMessage}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleModalClose} variant="contained">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default AddCarStock;