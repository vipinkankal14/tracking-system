import React, { useEffect, useState } from "react";
import "./scss/page.scss";
import {
  Box,
  Button,
  Checkbox,
  Container,
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

const CarInfo = ({ personalInfo, data, updateData }) => {
  const [carStocks, setCarStocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  

// Derived available options - now filtered by fuelType first
const availableFuelTypes = [...new Set(carStocks.map(stock => stock.fuelType))];

const availableCarTypes = data.fuelType
  ? [...new Set(
      carStocks
        .filter(stock => stock.fuelType === data.fuelType)
        .map(stock => stock.carType)
    )]
  : [];

const availableModels = data.fuelType && data.carType
  ? [...new Set(
      carStocks
        .filter(stock => 
          stock.fuelType === data.fuelType && 
          stock.carType === data.carType
        )
        .map(stock => stock.model)
    )]
  : [];

const availableVersions = data.fuelType && data.carType && data.model
  ? [...new Set(
      carStocks
        .filter(stock => 
          stock.fuelType === data.fuelType &&
          stock.carType === data.carType && 
          stock.model === data.model
        )
        .map(stock => stock.version)
    )]
  : [];

const availableColors = data.fuelType && data.carType && data.model && data.version
  ? [...new Set(
      carStocks
        .filter(stock => 
          stock.fuelType === data.fuelType &&
          stock.carType === data.carType && 
          stock.model === data.model &&
          stock.version === data.version
        )
        .map(stock => stock.color)
    )]
  : [];

// Fetch car stocks data
useEffect(() => {
  let isMounted = true;

  fetch("http://localhost:5000/api/showAllCarStocks")
    .then((response) => response.json())
    .then((fetchedData) => {
      if (isMounted) {
        setCarStocks(fetchedData);
        // Validate initial values after data load
        const validateSelections = () => {
          const { fuelType, carType, model, version, color } = data;
          
          // Validate fuel type first
          if (fuelType && !fetchedData.some(stock => stock.fuelType === fuelType)) {
            updateData("fuelType", "");
            updateData("carType", "");
            updateData("model", "");
            updateData("version", "");
            updateData("color", "");
          }
          // Then validate car type
          else if (carType && !fetchedData.some(
            stock => stock.carType === carType && stock.fuelType === fuelType
          )) {
            updateData("carType", "");
            updateData("model", "");
            updateData("version", "");
            updateData("color", "");
          }
          // Then model
          else if (model && !fetchedData.some(
            stock => stock.model === model && 
                    stock.carType === carType && 
                    stock.fuelType === fuelType
          )) {
            updateData("model", "");
            updateData("version", "");
            updateData("color", "");
          }
          // Then version
          else if (version && !fetchedData.some(
            stock => stock.version === version && 
                    stock.model === model && 
                    stock.fuelType === fuelType
          )) {
            updateData("version", "");
            updateData("color", "");
          }
          // Finally color
          else if (color && !fetchedData.some(
            stock => stock.color === color && 
                    stock.version === version && 
                    stock.fuelType === fuelType
          )) {
            updateData("color", "");
          }
        };
        validateSelections();
      }
    })
    .catch((error) => console.error("Error fetching car stocks:", error));

  return () => {
    isMounted = false;
  };
}, []);


  // Rest of the useEffect for price updates remains the same
  useEffect(() => {
    const { fuelType,carType, model, version, color } = data;
    if (!fuelType || !carType || !model || !version || !color) return;

    const selectedCar = carStocks.find(
      (stock) =>
        stock.fuelType === fuelType &&
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
      if (data.fuelType !== selectedCar.fuelType) {
        updateData("fuelType", selectedCar.fuelType || "");
      }
    }
  }, [
    data.carType,
    data.model,
    data.version,
    data.color,
    data.fuelType,
    carStocks,
  ]);

  const handleChange = (name, value) => {
    // Reset all dependent fields when fuel type changes
    if (name === "fuelType") {
      updateData("carType", "");
      updateData("model", "");
      updateData("version", "");
      updateData("color", "");
    }
    // Existing reset logic for other fields
    else if (name === "carType") {
      updateData("model", "");
      updateData("version", "");
      updateData("color", "");
    } else if (name === "model") {
      updateData("version", "");
      updateData("color", "");
    } else if (name === "version") {
      updateData("color", "");
    }
    
    updateData(name, value);
  };

  // Find the selected car details
  const selectedCar = carStocks.find(
    (stock) =>
      stock.fuelType === data.fuelType &&
      stock.carType === data.carType &&
      stock.model === data.model &&
      stock.version === data.version &&
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
      team_Leader: data.teamLeader,
      bookingType: data.bookingType,
      team_Member: data.teamMember,
      carType: data.carType,
      model: data.model,
      version: data.version,
      color: data.color,
      exShowroomPrice: data.exShowroomPrice,
      bookingAmount: data.bookingAmount,
      cardiscount: data.cardiscount,
      fuelType: data.fuelType,
      transmission: selectedCar.transmission,
      mileage: selectedCar.mileage,
      engineCapacity: selectedCar.engineCapacity,
      batteryCapacity:selectedCar.batteryCapacity,
      groundClearance:selectedCar.groundClearance,
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
    <Container maxWidth="xl">
      <div className="space-y-4">
        <Typography variant="h6">Booking Type</Typography>
        <Typography gutterBottom variant="h6"></Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="bookingType-label">Booking Type</InputLabel>
              <Select
                label="BookingType"
                labelId="bookingType-label"
                value={data.bookingType}
                onChange={(e) => handleChange("bookingType", e.target.value)}
                version="outlined"
              >
                <MenuItem value="">Select Booking Type</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="DealershipAdvisor">
                  Dealership Advisor
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>

      <br />
      {data.bookingType === "DealershipAdvisor" && (
        <div className="space-y-4">
          <Typography variant="h6">Dealership Advisor</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="team_Leader-label">Team Leader</InputLabel>
                <Select
                  label="Team Leader"
                  labelId="team_Leader-label"
                  value={data.teamLeader || ""} // Ensure fallback to empty string
                  onChange={(e) => handleChange("teamLeader", e.target.value)}
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
                  value={data.teamMember || ""} // Ensure fallback to empty string
                  onChange={(e) => handleChange("teamMember", e.target.value)}
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
      )}

      <br />
      {/* Car Details */}
      <div className="row g-2">
        <div className="space-y-4">
          <Typography variant="h6">Choose Your Car</Typography>
          <Typography gutterBottom variant="h6"></Typography>

          <Grid container spacing={2}>
                     
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="carType-label">Car FuelType</InputLabel>
                <Select
                  label="Car fuel Type"
                  labelId="carfuelType-label"
                  value={
                    availableFuelTypes.includes(data.fuelType) ? data.fuelType : ""
                  }
                  onChange={(e) => handleChange("carfuelType", e.target.value)}
                >
                  <MenuItem value="">Select FuelType</MenuItem>
                  {availableFuelTypes.map((fuelType) => (
                    <MenuItem key={fuelType} value={fuelType}>
                      {fuelType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>



            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="carType-label">Car Type</InputLabel>
                <Select
                  label="Car Type"
                  labelId="carType-label"
                  value={
                    availableCarTypes.includes(data.carType) ? data.carType : ""
                  }
                  onChange={(e) => handleChange("carType", e.target.value)}
                >
                  <MenuItem value="">Select Car Type</MenuItem>
                  {availableCarTypes.map((carType) => (
                    <MenuItem key={carType} value={carType}>
                      {carType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Model Select */}
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="model-label">Model</InputLabel>
                <Select
                  label="Model"
                  labelId="model-label"
                  value={availableModels.includes(data.model) ? data.model : ""}
                  onChange={(e) => handleChange("model", e.target.value)}
                  disabled={!data.carType}
                >
                  <MenuItem value="">Select Model</MenuItem>
                  {availableModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Version Select */}
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="version-label">Version</InputLabel>
                <Select
                  label="Version"
                  labelId="version-label"
                  value={
                    availableVersions.includes(data.version) ? data.version : ""
                  }
                  onChange={(e) => handleChange("version", e.target.value)}
                  disabled={!data.model}
                >
                  <MenuItem value="">Select Version</MenuItem>
                  {availableVersions.map((version) => (
                    <MenuItem key={version} value={version}>
                      {version}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Color Select */}
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth>
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                  label="Color"
                  labelId="color-label"
                  value={availableColors.includes(data.color) ? data.color : ""}
                  onChange={(e) => handleChange("color", e.target.value)}
                  disabled={!data.version}
                >
                  <MenuItem value="">Select Color</MenuItem>
                  {availableColors.map((color) => (
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

      <br />

      <form onSubmit={handleSubmit}>
        <Box>
          {selectedCar && (
            <>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Car Booking Details
              </Typography>

              {/* Booking Type */}
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Booking Type:{" "}
                {data.bookingType === "DealershipAdvisor"
                  ? `DealershipAdvisor: ${data.teamMember} | ${data.teamLeader}`
                  : "Online"}
              </Typography>

              {/* Car Details */}
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontFamily: "Arial",
                  textAlign: "center",
                  color: "primary.main",
                }}
              >
                {selectedCar.carType} | {selectedCar.model} |{" "}
                {selectedCar.version} | {selectedCar.color}
              </Typography>

              {/* Specifications Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  {
                    label: "Ex-Showroom Price",
                    value: selectedCar.exShowroomPrice,
                  },
                  { label: "Booking Amount", value: selectedCar.bookingAmount },
                  { label: "Discount", value: selectedCar.cardiscount },
                  { label: "Fuel Type", value: selectedCar.fuelType },
                  { label: "Transmission", value: selectedCar.transmission },
                  { label: "Mileage", value: selectedCar.mileage },
                  {
                    label: "Ground Clearance",
                    value: selectedCar.groundClearance,
                  },
                  ...(selectedCar.fuelType === "Electric"
                    ? [
                        {
                          label: "Battery Capacity",
                          value: selectedCar.batteryCapacity,
                        },
                      ]
                    : [
                        {
                          label: "Engine Capacity",
                          value: selectedCar.engineCapacity,
                        },
                      ]),
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1,
                      }}
                    >
                      <Typography variant="body1">{item.label}:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Confirmation Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                    color="primary"
                    inputProps={{ "aria-label": "Confirm car selection" }}
                  />
                }
                label="I confirm the vehicle details are correct"
                sx={{ mb: 3 }}
              />
            </>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              type="submit"
              disabled={!confirmationChecked}
            >
              Confirm Order
            </Button>
          </Box>
        </Box>
      </form>

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
          <Typography version="h6" gutterBottom>
            Car selection submitted successfully!
          </Typography>
          <Button
            version="contained"
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
    </Container>
  );
};

export default CarInfo;
