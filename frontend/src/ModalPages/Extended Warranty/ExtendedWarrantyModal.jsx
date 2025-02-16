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

export function ExtendedWarrantyModal({
  open,
  onClose,
  personalInfo,
  carInfo,
}) {
  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [requestExtendedWarranty, setRequestExtendedWarranty] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Checkbox state:", requestExtendedWarranty); // Debugging

    if (!validateForm()) {
      return;
    }

    if (!personalInfo?.customerId) {
      alert(
        "Please fill in your personal information before submitting the Car Extended Warranty Services."
      );
      return;
    }

    const ExtendedWarrantyData = {
      customerId: personalInfo.customerId,
      requestExtendedWarranty, // Boolean value
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/submitExtendedWarrantyRequest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ExtendedWarrantyData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setConfirmationOpen(true); // Open confirmation modal
      } else {
        alert(result.message); // Handle error case
      }
    } catch (error) {
      console.error("Error submitting Extended Warranty request:", error);
      alert(
        "An error occurred while submitting the Extended Warranty request."
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!requestExtendedWarranty) {
      newErrors.requestExtendedWarranty =
        "You must agree to the terms to request an extended warranty.";
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
    setRequestExtendedWarranty(false);
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
                Car Extended Warranty Services
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
                  {/* Car Information */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DirectionsCar />
                        <Typography variant="h6">
                          Vehicle Information
                        </Typography>
                      </Box>
                      <List dense>
                        <Typography variant="body2">
                          Car Model: {carInfo?.model}
                        </Typography>
                        <Typography variant="body2">
                          Car Version: {carInfo?.version}
                        </Typography>
                        <Typography variant="body2">
                          Car Color: {carInfo?.color}
                        </Typography>
                      </List>
                    </Stack>
                  </Paper>

                  {/* Request Extended Warranty */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={requestExtendedWarranty}
                            onChange={(e) =>
                              setRequestExtendedWarranty(e.target.checked)
                            }
                          />
                        }
                        label="I acknowledge that I am requesting an extended warranty for my vehicle."
                      />
                      {errors.requestExtendedWarranty && (
                        <Typography color="error" variant="caption">
                          {errors.requestExtendedWarranty}
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
            Your Extended Warranty form has been submitted successfully.
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
