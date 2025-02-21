import React, { useState } from "react";
import {
  Button,
  List,
  Paper,
  Stack,
  Modal,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DirectionsCar, Person } from "@mui/icons-material";

export function AutoCardModal({ open, onClose, personalInfo, carInfo }) {
  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmBenefits, setConfirmBenefits] = useState(false);
  const [autocard_amount, setautocard_amount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const AutoCardData = {
      customerId: personalInfo.customerId,
      autocard_amount
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/submitAutoCardRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(AutoCardData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setConfirmationOpen(true); // Open confirmation modal
      } else {
        alert(result.message); // Handle error case
      }
    } catch (error) {
      console.error("Error submitting AutoCard request:", error);
      alert("An error occurred while submitting the AutoCard request.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!confirmBenefits) {
      newErrors.confirmBenefits = "You must confirm the benefits to proceed.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    onClose();
  };

  const handleClose = () => {
   
    setConfirmBenefits(false);
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
                            <Typography variant="body2">
                              Full Name: {personalInfo?.firstName}{" "}
                              {personalInfo?.middleName}{" "}
                              {personalInfo?.lastName}
                            </Typography>
                            <Typography variant="body2">
                              Email: {personalInfo?.email}
                            </Typography>
                            <Typography variant="body2">
                              Phone Number: {personalInfo?.mobileNumber1},{" "}
                              {personalInfo?.mobileNumber2}
                            </Typography>
                          </List>
                        </Box>
                      </Stack>
                    </Paper>
                    {/* Car Information */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DirectionsCar />
                          <Typography variant="h6">Car Information</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Information:
                          </Typography>
                          <List dense>
                            <Typography variant="body2">
                              Car Make: {carInfo?.make}
                            </Typography>
                            <Typography variant="body2">
                              Car Model: {carInfo?.model}
                            </Typography>
                            <Typography variant="body2">
                              Car Year: {carInfo?.year}
                            </Typography>
                            <Typography variant="body2">
                              Car Registration: {carInfo?.registration}
                            </Typography>
                          </List>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Benefits of Auto Card */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6">
                            Benefits of Auto Card
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Benefits:
                          </Typography>
                          <List dense>
                            <Typography variant="body2">
                              ✅ Free/Discounted Car Services
                            </Typography>
                            <Typography variant="body2">
                              <ul>
                                <li>
                                  Free car washes, interior cleaning, and
                                  exterior polishing.
                                </li>
                                <li>
                                  Special discounts on periodic maintenance.
                                </li>
                              </ul>
                            </Typography>
                            <Typography variant="body2">
                              ✅ Extended Warranty Offers
                            </Typography>
                            <Typography variant="body2">
                              <ul>
                                <li>
                                  Special pricing on extended warranty plans.
                                </li>
                                <li>Hassle-free claim process for repairs.</li>
                              </ul>
                            </Typography>
                            <Typography variant="body2">
                              ✅ Roadside Assistance (RSA)
                            </Typography>
                            <Typography variant="body2">
                              <ul>
                                <li>24/7 emergency towing services.</li>
                                <li>
                                  Battery jumpstart, fuel delivery, flat tire
                                  assistance.
                                </li>
                              </ul>
                            </Typography>
                            <Typography variant="body2">
                              ✅ Exclusive Discounts on Spare Parts &
                              Accessories
                            </Typography>
                            <Typography variant="body2">
                              <ul>
                                <li>
                                  Savings on genuine spare parts and car
                                  accessories.
                                </li>
                                <li>
                                  Special offers on premium add-ons like alloy
                                  wheels, seat covers, and infotainment systems.
                                </li>
                              </ul>
                            </Typography>
                            <Typography variant="body2">
                              ✅ Insurance & Renewal Benefits
                            </Typography>
                            <Typography variant="body2">
                              <ul>
                                <li>
                                  Discounts on insurance renewals and add-on
                                  covers.
                                </li>
                                <li>
                                  Hassle-free cashless claim settlement at
                                  partner garages.
                                </li>
                              </ul>
                            </Typography>
                            <Typography variant="body2">
                              ✅ Loyalty Rewards & Cashback
                            </Typography>
                            <Typography variant="body2">
                              <ul>
                                <li>
                                  Earn reward points on each service & purchase.
                                </li>
                                <li>
                                  Redeem points for car services, fuel, and
                                  accessories.
                                </li>
                              </ul>
                            </Typography>
                            <Typography variant="body2">
                              ✅ Faster Service Appointments & Priority Handling
                            </Typography>
                            <Typography variant="body2">
                              <ul>
                                <li>
                                  Skip waiting times with priority service
                                  slots.
                                </li>
                                <li>
                                  Faster claim processing for repairs &
                                  maintenance.
                                </li>
                              </ul>
                            </Typography>
                            <Typography variant="body2">
                              ✅ Free Vehicle Pick-up & Drop
                            </Typography>
                            <Typography variant="body2">
                              Complimentary pick-up and drop-off for servicing.
                            </Typography>
                          </List>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Confirmation Checkbox */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={confirmBenefits}
                              onChange={(e) =>
                                setConfirmBenefits(e.target.checked)
                              }
                            />
                          }
                          label="I acknowledge the benefits of the Auto Card and confirm my request."
                        />
                        {errors.confirmBenefits && (
                          <Typography color="error" variant="caption">
                            {errors.confirmBenefits}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
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
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Dialog open={confirmationOpen}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your AutoCard form has been submitted successfully.
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
