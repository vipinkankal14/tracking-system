import React, { useState } from "react";
import {
  Modal,
  Box,
  Paper,
  Stack,
  Typography,
  List,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Slider,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Person,
  DirectionsCar,
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

// documentLists

const documentLists = {
  Salaried: [
    "Aadhaar Card",
    "PAN Card",
    "Driving License",
    "Passport",
    "Voter ID",
    "Salary Slips (Last 3 months)",
    "Form 16 / Income Tax Returns",
    "Bank Statement (Last 6 months)",
    "Photograph & Signature Verification",
  ],
  "Self-Employed": [
    "Aadhaar Card",
    "PAN Card",
    "Driving License",
    "Passport",
    "Voter ID",
    "Business Registration Certificate or GST/MSME Certificate",
    "Income Tax Returns (Last 2 years)",
    "Audited Balance Sheet / Profit & Loss Statement",
    "Bank Statements (Last 6 months)",
    "Photograph & Signature Verification",
  ],
};

const calculateEMI = (loanAmount, interestRate, duration) => {
  const monthlyRate = interestRate / (12 * 100);
  const months = duration * 12;
  if (interestRate === 0) return loanAmount / months;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return emi.toFixed(2);
};

const FinanceModal = ({ open, onClose, personalInfo, carInfo }) => {
  const [employedType, setEmployedType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState(0);
  const [loanDuration, setLoanDuration] = useState(1);
  const [calculatedEMI, setCalculatedEMI] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleFileUpload = (event, doc) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFiles((prevFiles) => ({
        ...prevFiles,
        [doc]: file,
      }));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleFileRemove = (doc) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      delete newFiles[doc];
      return newFiles;
    });
  };

  const handleCalculateEMI = () => {
    if (loanAmount && interestRate && loanDuration) {
      const emi = calculateEMI(loanAmount, interestRate, loanDuration);
      setCalculatedEMI(emi);
    }
  };

  const handleSubmit = async () => {
    if (
      !personalInfo?.customerId ||
      !loanAmount ||
      !interestRate ||
      !loanDuration
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("customerId", personalInfo.customerId);
    formData.append("loanAmount", loanAmount);
    formData.append("interestRate", interestRate);
    formData.append("loanDuration", loanDuration);
    formData.append("calculatedEMI", calculatedEMI);
    formData.append("employedType", employedType);
    formData.append(
      "requiredDocuments",
      JSON.stringify(Object.keys(uploadedFiles))
    );

    // Append uploaded documents
    Object.values(uploadedFiles).forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await fetch("http://localhost:5000/api/loans", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Finance form submitted successfully");
        setConfirmationOpen(true);
      } else {
        const errorMessage = await response.json();
        console.error("Failed to submit finance form:", errorMessage);
        alert(`Error: ${errorMessage.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error submitting finance form:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleFilePreview = (file) => {
    if (file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } else {
      alert("File is not a PDF.");
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
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
              p: 2,
              maxWidth: 600,
              height: { xs: "100%", sm: "100%" },
              overflowY: "auto",
              borderRadius: 2,
            }}
          >
            <Box
              textAlign="center"
              sx={{
                p: 1,
                width: "55vh",
                justifyContent: "start",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Typography variant="h5" component="h1">
                Car Finance Services
              </Typography>
            </Box>
            <Stack
              spacing={1}
              sx={{
                m: 0.5,
                maxWidth: 600,
                height: "79vh",
                overflowY: "auto",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={4}>
                <Box display="grid" gap={1} gridTemplateColumns={{ xs: "1fr" }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person />
                        <Typography variant="h6">
                          Personal Information
                        </Typography>
                      </Box>
                      <List dense>
                        <Typography variant="body2">
                          Customer ID: {personalInfo?.customerId}
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
                      </List>
                    </Stack>
                  </Paper>

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
                </Box>

                {/* Loan Amount Input */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <TextField
                    label="Loan Amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    fullWidth
                    sx={{ maxWidth: 300 }}
                  />
                </Box>

                {/* EMI Calculation Result */}
                {calculatedEMI && (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="h6" color="primary">
                      Estimated Monthly EMI: ₹{calculatedEMI}
                    </Typography>
                  </Box>
                )}

                {/* Interest Rate and Loan Duration Sliders */}
                <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
                  <Box
                    sx={{
                      flex: 1,
                      mb: { xs: 2, sm: 0 },
                      mr: { xs: 4, sm: 2 },
                      ml: 2,
                    }}
                  >
                    <Typography gutterBottom>Interest Rate (%)</Typography>
                    <Slider
                      value={interestRate}
                      onChange={(e, newValue) => setInterestRate(newValue)}
                      min={0}
                      max={20}
                      step={0.1}
                      valueLabelDisplay="auto"
                    />
                    <Typography gutterBottom>{interestRate}%</Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      mb: { xs: 2, sm: 0 },
                      mr: { xs: 4, sm: 4 },
                      ml: 1,
                    }}
                  >
                    <Typography gutterBottom>Loan Duration (Years)</Typography>
                    <Slider
                      value={loanDuration}
                      onChange={(e, newValue) => setLoanDuration(newValue)}
                      min={1}
                      max={30}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                    <Typography gutterBottom>{loanDuration} Years</Typography>
                  </Box>
                </Box>

                {/* Calculate EMI Button */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleCalculateEMI}
                  >
                    Calculate EMI
                  </Button>
                </Box>

                {/* Employed Type Dropdown */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FormControl
                    sx={{ mt: 2, width: "100%", maxWidth: 300 }}
                    variant="outlined"
                  >
                    <InputLabel id="employed-type-label">
                      Select Employed Type
                    </InputLabel>
                    <Select
                      labelId="employed-type-label"
                      value={employedType}
                      onChange={(e) => setEmployedType(e.target.value)}
                      label="Select Employed Type"
                      sx={{ width: "100%" }}
                    >
                      {Object.keys(documentLists).map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Document Upload Section */}
                {employedType && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Documents Required for {employedType} Applicants
                    </Typography>
                    <Box
                      display="grid"
                      size="small"
                      gap={2}
                      gridTemplateColumns={{ xs: "1fr" }}
                    >
                      {documentLists[employedType].map((doc, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="body2">{doc}</Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <input
                              type="file"
                              accept=".pdf"
                              id={`upload-${doc}`}
                              style={{ display: "none" }}
                              onChange={(event) => handleFileUpload(event, doc)}
                            />
                            <label htmlFor={`upload-${doc}`}>
                              <IconButton color="primary" component="span">
                                <UploadFileIcon />
                              </IconButton>
                            </label>
                            {uploadedFiles[doc] && (
                              <>
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                  {uploadedFiles[doc].name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    ml: "auto",
                                  }}
                                >
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      handleFilePreview(uploadedFiles[doc])
                                    }
                                    sx={{ ml: 1 }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleFileRemove(doc)}
                                    sx={{ ml: 1 }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </>
                            )}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
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
            Your finance form has been submitted successfully.
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
};

export default FinanceModal;
