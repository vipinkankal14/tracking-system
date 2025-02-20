import React, { useState, useEffect } from "react";
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

const CarInfo = ({ personalInfo, data = {}, updateData }) => {
  const [carStocks, setCarStocks] = useState([]);
  const [open, setOpen] = useState(false); // State to control modal open/close status
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false); // State for success modal

  // Fetch car stocks data
  useEffect(() => {
    fetch("http://localhost:5000/api/showAllCarStocks")
      .then((response) => response.json())
      .then((data) => setCarStocks(data))
      .catch((error) => console.error("Error fetching car stocks:", error));
  }, []);


  // Reset confirmation when car selection changes
useEffect(() => {
  setConfirmationChecked(false);
}, [data.carType, data.model, data.version, data.color]); // <-- Add this new effect

  
  // Update prices when car details change
  useEffect(() => {
    const { carType, model, version, color } = data;

    if (carType && model && version && color) {
      const selectedCar = carStocks.find(
        (stock) =>
          stock.carType === carType &&
          stock.model === model &&
          stock.version === version &&
          stock.color === color
      );

      if (selectedCar) {
        if (data.exShowroomPrice !== selectedCar.exShowroomPrice) {
          updateData("exShowroomPrice", selectedCar.exShowroomPrice || "");
        }
        if (data.bookingAmount !== selectedCar.bookingAmount) {
          updateData("bookingAmount", selectedCar.bookingAmount || "");
        }
        if (data.cardiscount !== selectedCar.cardiscount) {
          updateData("cardiscount", selectedCar.cardiscount || "");
        }
      }
    }
  }, [data.carType, data.model, data.version, data.color, carStocks, updateData]);

  const handleChange = (name, value) => {
    updateData(name, value);
  };

  // Find the selected car details
  const selectedCar = carStocks.find(
    (stock) =>
      stock.carType === data.carType &&
      stock.model === data.model &&
      stock.version === data.version &&
      stock.color === data.color
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!personalInfo?.customerId) {
      alert("Please fill in your personal information before submitting the Car Coating Services.");
      return;
    }

    const payload = {
      customerId: personalInfo.customerId, 
      teamLeader: data.teamLeader,
      teamMember: data.teamMember,
      carType: data.carType,
      model: data.model,
      version: data.version,
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
      const response = await fetch("http://localhost:5000/api/submitCarSelection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      setSuccessModalOpen(true); // Open the success modal after submission
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
              <InputLabel id="teamLeader-label">Team Leader</InputLabel>
              <Select
                label="Team Leader"
                labelId="teamLeader-label"
                value={data.teamLeader}
                onChange={(e) => updateData("teamLeader", e.target.value)}
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
              <InputLabel id="teamMember-label">Team Member</InputLabel>
              <Select
                label="Team Member"
                labelId="teamMember-label"
                value={data.teamMember}
                onChange={(e) => updateData("teamMember", e.target.value)}
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
                  onChange={(e) => updateData("carType", e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="">Select Car Type</MenuItem>
                  {[...new Set(carStocks.map((stock) => stock.carType))].map((carType) => (
                    <MenuItem key={carType} value={carType}>
                      {carType}
                    </MenuItem>
                  ))}
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
                  onChange={(e) => updateData("model", e.target.value)}
                  disabled={!data.carType}
                  variant="outlined"
                >
                  <MenuItem value="">Select Model</MenuItem>
                  {carStocks
                    .filter((stock) => stock.carType === data.carType)
                    .map((stock) => (
                      <MenuItem key={stock.model} value={stock.model}>
                        {stock.model}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="version-label">Version</InputLabel>
                <Select
                  label="Version"
                  labelId="version-label"
                  value={data.version}
                  onChange={(e) => updateData("version", e.target.value)}
                  disabled={!data.model}
                  variant="outlined"
                >
                  <MenuItem value="">Select Version</MenuItem>
                  {carStocks
                    .filter((stock) => stock.carType === data.carType && stock.model === data.model)
                    .map((stock) => (
                      <MenuItem key={stock.version} value={stock.version}>
                        {stock.version}
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
                  onChange={(e) => updateData("color", e.target.value)}
                  disabled={!data.version}
                  variant="outlined"
                >
                  <MenuItem value="">Select Color</MenuItem>
                  {carStocks
                    .filter((stock) => stock.carType === data.carType && stock.model === data.model && stock.version === data.version)
                    .map((stock) => (
                      <MenuItem key={stock.color} value={stock.color}>
                        {stock.color}
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
        disabled={!data.carType || !data.model || !data.version || !data.color}
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
                  <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr" }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person />
                          <Typography variant="h6">Personal Information</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Information:
                          </Typography>
                          <Typography variant="body2">
                            Full Name: {personalInfo?.firstName} {personalInfo?.middleName} {personalInfo?.lastName}
                          </Typography>
                          <Typography variant="body2">
                            Email: {personalInfo?.email}
                          </Typography>
                          <Typography variant="body2">
                            Phone Number: {personalInfo?.mobileNumber1}, {personalInfo?.mobileNumber2}
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
                          Dealership Advisor: {data.teamMember} | {data.teamLeader}
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
                          {selectedCar.carType} | {selectedCar.model} | {selectedCar.version} | {selectedCar.color}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1, ml: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="body1">Ex-Showroom Price:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">{selectedCar.exShowroomPrice}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Booking Amount:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">{selectedCar.bookingAmount}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Discount:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">{selectedCar.cardiscount}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Fuel Type:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">{selectedCar.fuelType}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Transmission:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">{selectedCar.transmission}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">Mileage:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">{selectedCar.mileage} km</Typography>
                          </Grid>
                          
                          {selectedCar.fuelType === "Electric" ? (
                            <Grid item xs={6}>
                              <Typography variant="body1">Battery Capacity:</Typography>
                            </Grid>
                          ) : (
                            <Grid item xs={6}>
                              <Typography variant="body1">Engine Capacity:</Typography>
                            </Grid>
                          )}
                          {selectedCar.fuelType === "Electric" ? (
                            <Grid item xs={6}>
                              <Typography variant="body1">{selectedCar.batteryCapacity}</Typography>
                            </Grid>
                          ) : (
                            <Grid item xs={6}>
                              <Typography variant="body1">{selectedCar.engineCapacity} cc</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={confirmationChecked}
                          onChange={(e) => setConfirmationChecked(e.target.checked)}
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