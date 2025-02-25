import React, { useEffect, useState } from "react";
import "./scss/page.scss";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Person } from "@mui/icons-material";

const CarInfo = ({ personalInfo, data , updateData }) => {
  const [carStocks, setCarStocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Fetch car stocks data
  useEffect(() => {
    fetch("http://localhost:5000/api/showAllCarStocks")
      .then((response) => response.json())
      .then((data) => setCarStocks(data))
      .catch((error) => console.error("Error fetching car stocks:", error));
  }, []);

  // Reset dependent fields when carType changes
  useEffect(() => {
    if (data.carType) {
      updateData("model", "");
      updateData("variant", "");
      updateData("color", "");
    }
  }, [data.carType]);

  // Reset dependent fields when model changes
  useEffect(() => {
    if (data.model) {
      updateData("variant", "");
      updateData("color", "");
    }
  }, [data.model]);

  // Reset dependent fields when variant changes
  useEffect(() => {
    if (data.variant) {
      updateData("color", "");
    }
  }, [data.variant]);

  // Update prices when car details change
  useEffect(() => {
    const { carType, model, variant, color } = data;

    if (carType && model && variant && color) {
      const selectedCar = carStocks.find(
        (stock) =>
          stock.carType === carType &&
          stock.model === model &&
          stock.variant === variant &&
          stock.color === color
      );

      if (selectedCar) {
        updateData("exShowroomPrice", selectedCar.exShowroomPrice || "");
        updateData("bookingAmount", selectedCar.bookingAmount || "");
        updateData("cardiscount", selectedCar.cardiscount || "");
      }
    }
  }, [data.carType, data.model, data.variant, data.color, carStocks, updateData]);

  // Handle change for Select components
  const handleChange = (name, value) => {
    updateData(name, value);
  };

  // Find the selected car details
  const selectedCar = carStocks.find(
    (stock) =>
      stock.carType === data.carType &&
      stock.model === data.model &&
      stock.variant === data.variant &&
      stock.color === data.color
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!personalInfo?.customerId) {
      alert(
        "Please fill in your personal information before submitting the Car Coating Services."
      );
      return;
    }

    const payload = {
      customerId: personalInfo.customerId,
      team_Leader: data.team_Leader,
      team_Member: data.team_Member,
      carType: data.carType,
      model: data.model,
      variant: data.variant,
      color: data.color,
      exShowroomPrice: data.exShowroomPrice,
      bookingAmount: data.bookingAmount,
      cardiscount: data.cardiscount,
      fuelType: selectedCar.fuelType,
      transmission: selectedCar.transmission,
      mileage: selectedCar.mileage,
      engineCapacity: selectedCar.engineCapacity,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/submitCarSelection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit car selection. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Dealership Advisor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dealership Advisor</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="team_Leader-label">Team Leader</InputLabel>
              <Select
                label="Team Leader"
                labelId="team_Leader-label"
                value={data.team_Leader}
                onChange={(e) =>  handleChange("team_Leader", e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">Select Team Leader</MenuItem>
                <MenuItem value="leader1">Leader 1</MenuItem>
                <MenuItem value="leader2">Leader 2</MenuItem>
                <MenuItem value="leader3">Leader 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="team_Member-label">Team Member</InputLabel>
              <Select
                label="Team Member"
                labelId="team_Member-label"
                value={data.team_Member}
                onChange={(e) => handleChange("team_Member", e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">Select Team Member</MenuItem>
                <MenuItem value="member1">Member 1</MenuItem>
                <MenuItem value="member2">Member 2</MenuItem>
                <MenuItem value="member3">Member 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <br />
      {/* Car Details */}
      <div className="row g-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Your Car</h3>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="carType-label">Car Type</InputLabel>
                <Select
                  label="Car Type"
                  labelId="carType-label"
                  value={data.carType}
                  onChange={(e) => handleChange("carType", e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="">Select Car Type</MenuItem>
                  {[...new Set(carStocks.map((stock) => stock.carType))].map(
                    (carType) => (
                      <MenuItem key={carType} value={carType}>
                        {carType}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="model-label">Model</InputLabel>
                <Select
                  label="Model"
                  labelId="model-label"
                  value={data.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  disabled={!data.carType}
                  variant="outlined"
                >
                  <MenuItem value="">Select Model</MenuItem>
                  {[
                    ...new Set(
                      carStocks
                        .filter((stock) => stock.carType === data.carType)
                        .map((stock) => stock.model)
                    ),
                  ].map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="variant-label">variant</InputLabel>
                <Select
                  label="variant"
                  labelId="variant-label"
                  value={data.variant}
                  onChange={(e) => handleChange("variant", e.target.value)}
                  disabled={!data.model}
                  variant="outlined"
                >
                  <MenuItem value="">Select variant</MenuItem>
                  {[
                    ...new Set(
                      carStocks
                        .filter(
                          (stock) =>
                            stock.carType === data.carType &&
                            stock.model === data.model
                        )
                        .map((stock) => stock.variant)
                    ),
                  ].map((variant) => (
                    <MenuItem key={variant} value={variant}>
                      {variant}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                  label="Color"
                  labelId="color-label"
                  value={data.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  disabled={!data.variant}
                  variant="outlined"
                >
                  <MenuItem value="">Select Color</MenuItem>
                  {[
                    ...new Set(
                      carStocks
                        .filter(
                          (stock) =>
                            stock.carType === data.carType &&
                            stock.model === data.model &&
                            stock.variant === data.variant
                        )
                        .map((stock) => stock.color)
                    ),
                  ].map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </div>

      <br />
      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        disabled={!data.carType || !data.model || !data.variant || !data.color}
        sx={{ display: "block", margin: "0 auto" }}
      >
        View Choose Your Car
      </Button>

      <br />

      {/* Modal */}
      <Modal
        open={open}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Box
          component={Paper}
          sx={{
            width: { xs: "100%", sm: "60vh" },
            height: { xs: "100%", sm: "99%" },
            marginBottom: { sm: "4px" },
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={1}
              sx={{
                p: 1,
                maxWidth: 600,
                height: { xs: "100%", sm: "100%" },
                overflowY: "auto",
                borderRadius: 2,
              }}
            >
              <Box
                textAlign="center"
                sx={{
                  p: 2,
                  width: "55vh",
                  justifyContent: "start",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Typography variant="h5" component="h1">
                  Car AutoCard Services
                </Typography>
              </Box>
              <Stack
                spacing={2}
                sx={{
                  p: 1,
                  m: 0.6,
                  maxWidth: 600,
                  height: "79vh",
                  overflowY: "auto",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                }}
              >
                <Stack spacing={4}>
                  {/* Information Sections */}
                  <Box
                    display="grid"
                    gap={3}
                    gridTemplateColumns={{ xs: "1fr" }}
                  >
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person />
                          <Typography variant="h6">
                            Personal Information
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Information:
                          </Typography>
                 
                          <Typography variant="body2">
                            Full Name: {personalInfo?.firstName}{" "}
                            {personalInfo?.middleName} {personalInfo?.lastName}
                          </Typography>
                          <Typography variant="body2">
                            Email: {personalInfo?.email}
                          </Typography>
                          <Typography variant="body2">
                            Phone Number: {personalInfo?.mobileNumber1},{" "}
                            {personalInfo?.mobileNumber2}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {selectedCar && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          fontStyle={{
                            fontWeight: "italic",
                            fontSize: "12px",
                            color: "black",
                          }}
                        >
                          Dealership Advisor: {data.team_Member} |{" "}
                          {data.team_Leader}
                        </Typography>
                        <Typography
                          variant="h5"
                          gutterBottom
                          fontFamily={{
                            fontFamily: "Arial",
                            fontSize: "16px",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          {selectedCar.carType} | {selectedCar.model} |{" "}
                          {selectedCar.variant} | {selectedCar.color}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1, ml: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              Ex-Showroom Price:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              {selectedCar.exShowroomPrice}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              Booking Amount:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              {selectedCar.bookingAmount}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Discount:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              {selectedCar.cardiscount}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Fuel Type:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              {selectedCar.fuelType}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              Transmission:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              {selectedCar.transmission}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Mileage:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              {selectedCar.mileage} km
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="body1">
                              Ground Clearance:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">
                              {selectedCar.groundClearance} mm
                            </Typography>
                          </Grid>

                          {selectedCar.fuelType === "Electric" ? (
                            <Grid item xs={6}>
                              <Typography variant="body1">
                                Battery Capacity:
                              </Typography>
                            </Grid>
                          ) : (
                            <Grid item xs={6}>
                              <Typography variant="body1">
                                Engine Capacity:
                              </Typography>
                            </Grid>
                          )}
                          {selectedCar.fuelType === "Electric" ? (
                            <Grid item xs={6}>
                              <Typography variant="body1">
                                {selectedCar.batteryCapacity}
                              </Typography>
                            </Grid>
                          ) : (
                            <Grid item xs={6}>
                              <Typography variant="body1">
                                {selectedCar.engineCapacity} cc
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={confirmationChecked}
                          onChange={(e) =>
                            setConfirmationChecked(e.target.checked)
                          }
                          name="confirmation"
                          color="primary"
                        />
                      }
                      label="Are you sure you want to select this car?"
                    />
                  </Box>
                </Stack>
              </Stack>

              <Box
                size="small"
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!confirmationChecked}
                >
                  Order Now
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component={Paper}
          sx={{
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Car selection submitted successfully!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSuccessModalOpen(false);
              setOpen(false); // Close the main modal as well
            }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CarInfo;
