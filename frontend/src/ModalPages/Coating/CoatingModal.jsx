import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  Paper,
  Stack,
  Modal,
  Box,
  Typography,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DirectionsCar, Person } from "@mui/icons-material";
import { Shield } from "lucide-react";

const coatingOptions = [
  {
    label: "Ceramic Coating (Nano Coating) 🔥",
    value: "Ceramic Coating (Nano Coating) 🔥 ",
    protection: "High",
    durability: "2-5 years",
    pros: [
      "Long-lasting",
      "Protects against UV rays & minor scratches",
      "Deep glossy finish",
      "Water-repellent",
      "Reduces dirt buildup",
    ],
    cons: ["Expensive", "Requires professional application"],
    budget: 3,
    amount: "2000.00 Rs",
  },
  {
    label: "Graphene Coating 🛡",
    value: "Graphene Coating 🛡",
    protection: "Very High",
    durability: "3-7 years",
    pros: [
      "More durable than ceramic",
      "Better heat resistance",
      "Highly hydrophobic",
      "Reduces swirl marks",
    ],
    cons: ["Expensive but longer-lasting"],
    budget: 4,
    amount: "3000.00 Rs",
  },
  {
    label: "Teflon Coating (PTFE Coating) 🏎",
    value: "Teflon Coating (PTFE Coating) 🏎",
    protection: "Medium",
    durability: "6-12 months",
    pros: [
      "Affordable",
      "Protects against minor scratches",
      "Smooth glossy finish",
      "Water-repellent",
    ],
    cons: ["Short lifespan"],
    budget: 2,
    amount: "5400.00 Rs",
  },
  {
    label: "Paint Protection Film (PPF) 🎥",
    value: "Paint Protection Film (PPF) 🎥",
    protection: "Maximum",
    durability: "5-10 years",
    pros: [
      "Best protection against scratches",
      "Self-healing",
      "UV protection",
      "Gloss/matte options",
    ],
    cons: ["Very expensive", "Requires professional installation"],
    budget: 5,
    amount: "6700.00 Rs",
  },
  {
    label: "Wax Coating (Carnauba Wax) 🏁",
    value: "Wax Coating (Carnauba Wax) 🏁",
    protection: "Basic",
    durability: "1-3 months",
    pros: ["Budget-friendly", "Enhances shine", "Easy to apply"],
    cons: [
      "Requires frequent reapplication",
      "Less durable than other coatings",
    ],
    budget: 1,
    amount: "7000.00 Rs",
  },
  {
    label: "Glass Coating 🏆",
    value: "Glass Coating 🏆",
    protection: "High",
    durability: "Up to 3 years",
    pros: [
      "Extremely hydrophobic",
      "Deep glass-like shine",
      "UV & chemical resistant",
    ],
    cons: ["Expensive", "Less durable than ceramic"],
    budget: 3,
    amount: "9000.00 Rs",
  },
];

export function CoatingModal({ open, onClose, personalInfo, carInfo }) {
  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];

  const [formData, setFormData] = useState({
    coatingType: "",
    preferredDate: "",
    preferredTime: "",
    additionalNotes: "",
    amount: "",
    durability: "",
  });

  useEffect(() => {
    const selectedCoating = coatingOptions.find(
      (option) => option.value === formData.coatingType
    );
    if (selectedCoating) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        amount: selectedCoating.amount,
        durability: selectedCoating.durability,
      }));
    }
  }, [formData.coatingType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!personalInfo?.customerId) {
      alert(
        "Please fill in your personal information before submitting the Car Coating Services."
      );
      return;
    }

    const coatingData = {
      customerId: personalInfo.customerId,
      ...formData,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/submitCoatingRequest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coatingData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setConfirmationOpen(true); // Open confirmation modal
      } else {
        alert(result.message); // Handle error case
      }
    } catch (error) {
      console.error("Error submitting coating request:", error);
      alert("An error occurred while submitting the coating request.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.coatingType) {
      newErrors.coatingType = "Coating Type is required";
      isValid = false;
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred Date is required";
      isValid = false;
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Preferred Time is required";
      isValid = false;
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      isValid = false;
    }

    if (!formData.durability) {
      newErrors.durability = "Durability is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const selectedCoating = coatingOptions.find(
    (option) => option.value === formData.coatingType
  );

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    onClose();
  };

  return (
    <>
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
                Car Coating Services
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
                  {/* Personal Information */}
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
                        <List dense>
                          <h6 style={{ fontSize: "12px" }}>
                            Full Name: {personalInfo?.firstName}{" "}
                            {personalInfo?.middleName} {personalInfo?.lastName}
                          </h6>
                          <h6 style={{ fontSize: "12px" }}>
                            Email: {personalInfo?.email}
                          </h6>
                          <h6 style={{ fontSize: "12px" }}>
                            Phone Number: {personalInfo?.mobileNumber1},
                            {personalInfo?.mobileNumber2}{" "}
                          </h6>
                        </List>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Vehicle Information */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DirectionsCar />
                        <Typography variant="h6">
                          Vehicle Information
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Required Information:
                        </Typography>
                        <List dense>
                          <h6 style={{ fontSize: "12px" }}>
                            Car Model: {carInfo?.model}{" "}
                          </h6>
                          <h6 style={{ fontSize: "12px" }}>
                            Car Version: {carInfo?.version}{" "}
                          </h6>
                          <h6 style={{ fontSize: "12px" }}>
                            Car Color: {carInfo?.color}{" "}
                          </h6>
                        </List>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>

                {/* Service Details */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Shield />
                    <Typography variant="h6">Service Details</Typography>
                  </Box>
                  <Stack spacing={3}>
                    <FormControl fullWidth error={!!errors.coatingType}>
                      <InputLabel>Coating Type</InputLabel>
                      <Select
                        name="coatingType"
                        value={formData.coatingType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coatingType: e.target.value,
                          })
                        }
                        label="Coating Type"
                      >
                        {coatingOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.coatingType && (
                        <FormHelperText>{errors.coatingType}</FormHelperText>
                      )}
                    </FormControl>

                    {selectedCoating && (
                      <Box>
                        <Typography variant="subtitle1">
                          Protection: {selectedCoating.protection}
                        </Typography>
                        <Typography variant="subtitle1">
                          Durability: {selectedCoating.durability}
                        </Typography>
                        <Typography variant="subtitle1">Pros:</Typography>
                        <ul>
                          {selectedCoating.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                        <Typography variant="subtitle1">Cons:</Typography>
                        <ul>
                          {selectedCoating.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                        <Typography variant="subtitle1">
                          Amount: {selectedCoating.amount}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      display="grid"
                      gap={2}
                      gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                    >
                      <TextField
                        label="Preferred Date"
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredDate: e.target.value,
                          })
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors.preferredDate}
                        helperText={errors.preferredDate}
                      />
                      <FormControl fullWidth error={!!errors.preferredTime}>
                        <InputLabel>Preferred Time</InputLabel>
                        <Select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredTime: e.target.value,
                            })
                          }
                          label="Preferred Time"
                        >
                          {timeSlots.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.preferredTime && (
                          <FormHelperText>
                            {errors.preferredTime}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>

                    <Box
                      display="grid"
                      gap={2}
                      gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                    >
                      <TextField
                        label="Amount"
                        name="amount"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        fullWidth
                        error={!!errors.amount}
                        helperText={errors.amount}
                        size="small"
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <TextField
                        label="Durability"
                        name="durability"
                        value={formData.durability}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            durability: e.target.value,
                          })
                        }
                        fullWidth
                        error={!!errors.durability}
                        helperText={errors.durability}
                        size="small"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                    <TextField
                      label="Additional Notes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalNotes: e.target.value,
                        })
                      }
                      multiline
                      rows={3}
                      fullWidth
                      error={!!errors.additionalNotes}
                      helperText={errors.additionalNotes}
                      size="small"
                    />
                  </Stack>
                </Box>
              </Stack>
            </Stack>
            <Box
              size="small"
              sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Dialog open={confirmationOpen}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your Coating form has been submitted successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
