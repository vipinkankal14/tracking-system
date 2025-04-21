import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Modal,
  Avatar,
} from "@mui/material";

const AddCarStock = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vin: "",
    manufacturerDate: "",
    dateIn: "",
    model: "",
    color: "",
    fuelType: "",
    chassisNumber: "",
    engineNumber: "",
    version: "",
    customerId: "",
    allotmentCarStatus: "Not Allocated",
    carType: "",
    engineCapacity: "",
    transmission: "",
    exShowroomPrice: "",
    bookingAmount: "",
    mileage: "",
    batteryCapacity: "",
    cardiscount: "",
    groundClearance: "",
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type and size
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/avif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Only JPG, JPEG, PNG,avif, or WEBP files are allowed",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "File size must be less than 5MB",
        }));
        return;
      }

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({
          ...prev,
          [fieldName]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      setImages((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalVariant === "success") {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate VIN length
    if (formData.vin.length !== 17) {
      setErrors((prev) => ({
        ...prev,
        vin: "VIN must be exactly 17 characters",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Append images
      Object.entries(images).forEach(([key, file]) => {
        if (file) formDataToSend.append(key, file);
      });

      const response = await axios.post(
        "http://localhost:5000/api/CarStock/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message) {
        setModalMessage("Car stock added successfully!");
        setModalVariant("success");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding car stock:", error);

      if (error.response) {
        if (error.response.status === 409) {
          setErrors((prev) => ({ ...prev, vin: error.response.data.error }));
        } else {
          setModalMessage(
            error.response.data.error ||
              "An error occurred while adding car stock"
          );
          setModalVariant("error");
          setShowModal(true);
        }
      } else {
        setModalMessage("Network error. Please try again.");
        setModalVariant("error");
        setShowModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl" style={{ marginTop: '-60px' }}  >
      <br />   <br />
      <Typography variant="h4" align="center" gutterBottom>
        ADD CAR STOCK
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Car Type */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="carType-label">Car Type</InputLabel>
              <Select
                labelId="carType-label"
                id="carType"
                name="carType"
                value={formData.carType}
                onChange={handleChange}
                label="Car Type"
                error={!!errors.carType}
              >
                <MenuItem value="">Select Car Type</MenuItem>
                <MenuItem value="Electric">🔋 Electric Vehicles (EVs)</MenuItem>
                <MenuItem value="Sedan">🚗 Sedans</MenuItem>
                <MenuItem value="Hatchback">🚙 Hatchbacks</MenuItem>
                <MenuItem value="SUV">
                  🚜 SUVs (Sports Utility Vehicles)
                </MenuItem>
                <MenuItem value="MPV">
                  🚐 MPVs (Multi-Purpose Vehicles)
                </MenuItem>
                <MenuItem value="Coupe">🚘 Coupes</MenuItem>
                <MenuItem value="Convertible">🏎 Convertibles</MenuItem>
                <MenuItem value="Pickup">🚛 Pickup Trucks</MenuItem>
                <MenuItem value="Van">🚚 Vans</MenuItem>
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
              onChange={handleChange}
              error={!!errors.vin}
              helperText={errors.vin}
              inputProps={{ maxLength: 17 }}
              required
            />
          </Grid>

          {/* Chassis Number */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Chassis Number"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
            />
          </Grid>

          {/* Engine Number */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Engine Number"
              name="engineNumber"
              value={formData.engineNumber}
              onChange={handleChange}
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
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
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
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Fuel Type */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="fuelType-label">Fuel Type</InputLabel>
              <Select
                labelId="fuelType-label"
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                label="Fuel Type"
              >
                <MenuItem value="">Select Fuel Type</MenuItem>
                <MenuItem value="Petrol">⛽ Petrol</MenuItem>
                <MenuItem value="Diesel">🛢 Diesel</MenuItem>
                <MenuItem value="Electric">⚡ Electric</MenuItem>
                <MenuItem value="LPG">🚛 LPG</MenuItem>
                <MenuItem value="CNG">🔥 CNG</MenuItem>
                <MenuItem value="Hybrid-Diesel">🔋⛽ Hybrid (Diesel)</MenuItem>
                <MenuItem value="Hybrid-Petrol">🔋⛽ Hybrid (Petrol)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Battery Capacity (Conditional) */}
          {formData.fuelType === "Electric" && (
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Battery Capacity (kWh)"
                name="batteryCapacity"
                type="text"
                value={formData.batteryCapacity}
                onChange={handleChange}
                error={!!errors.batteryCapacity}
                helperText={errors.batteryCapacity}
              />
            </Grid>
          )}

          {/* Model */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              error={!!errors.model}
              helperText={errors.model}
              required
            />
          </Grid>

          {/* Version */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Version"
              name="version"
              value={formData.version}
              onChange={handleChange}
            />
          </Grid>

          {/* Color */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </Grid>

          {/* Mileage */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mileage (kmpl or km/kWh)"
              name="mileage"
              type="text"
              value={formData.mileage}
              onChange={handleChange}
            />
          </Grid>

          {formData.fuelType !== "Electric" && (
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Engine Capacity (cc)"
                name="engineCapacity"
                type="text"
                value={formData.engineCapacity}
                onChange={handleChange}
              />
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ground Clearance (mm)"
              name="groundClearance"
              type="text"
              value={formData.groundClearance}
              onChange={handleChange}
            />
          </Grid>

          {/* Transmission Type */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="transmission-label">Transmission</InputLabel>
              <Select
                labelId="transmission-label"
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                label="Transmission"
              >
                <MenuItem value="">Select Transmission</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
                <MenuItem value="Automatic">Automatic</MenuItem>
                <MenuItem value="Semi-Automatic">Semi-Automatic</MenuItem>
                <MenuItem value="CVT">CVT</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Ex-Showroom Price */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ex-Showroom Price (₹)"
              name="exShowroomPrice"
              type="number"
              value={formData.exShowroomPrice}
              onChange={handleChange}
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          {/* Booking Amount */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Booking Amount (₹)"
              name="bookingAmount"
              type="number"
              value={formData.bookingAmount}
              onChange={handleChange}
              inputProps={{ step: "0.01" }}
            />
          </Grid>

          {/* Discount */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Discount (₹)"
              name="cardiscount"
              type="number"
              value={formData.cardiscount}
              onChange={handleChange}
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          {/* Discount */}
          <Grid item xs={12} md={4}>
             
          </Grid>

          {/* Image Uploads with Previews */}
          {[1, 2, 3, 4].map((num) => (
            <Grid
              item
              xs={12}
              md={4}
              key={`image-upload-${num}`}
              sx={{ py: 2 }}
            >
              {/* Preview Container */}
              <Box
                sx={{
                  mt: { xs: 0.5, md: 1 },
                  height: { xs: 200, md: 200 },
                  width: "100%",
                  maxWidth: 400,
                  mx: "auto",
                  border: imagePreviews[`image${num}`]
                    ? "1px solid #ddd"
                    : "1px dashed #ddd",
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  position: "relative",
                }}
              >
                {imagePreviews[`image${num}`] ? (
                  <img
                    src={imagePreviews[`image${num}`]}
                    alt={`Preview ${num}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                    }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    No image selected
                  </Typography>
                )}
              </Box>

              {/* Upload Button */}
              <Box sx={{ px: { xs: 1, md: 0 }, mt: { xs: 1, md: 1.5 } }}>
                <Button
                  variant="outlined"
                  component="label"
                  aria-label={`Upload Image ${num}`}
                  size="small"
                  fullWidth
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: "10px",
                    "&:active": {
                      transform: "scale(0.98)",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Upload
                  </Box>
                  #{num}
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg, image/jpg, image/png, image/webp, image/avif"
                    onChange={(e) => handleImageChange(e, `image${num}`)}
                  />
                </Button>
              </Box>

              {/* Error Message */}
              {errors[`image${num}`] && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    textAlign: "center",
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
                  }}
                >
                  {errors[`image${num}`]}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ px: 4 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ px: 4 }}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Submitting..." : "Add Car"}
          </Button>
        </Box>
      </Box>

      {/* Result Modal */}
      <Modal open={showModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            color={modalVariant === "success" ? "success.main" : "error.main"}
          >
            {modalVariant === "success" ? "Success" : "Error"}
          </Typography>
          <Typography sx={{ mt: 2 }}>{modalMessage}</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={handleModalClose} variant="contained">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      <br /> <hr /> <br />
    </Container>
  );
};

export default AddCarStock;
