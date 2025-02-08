import React, { useState } from "react";
import {
  Modal,
  Box,
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Slider,
  InputAdornment,
} from "@mui/material";
import {
  Person,
  DirectionsCar,
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

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

  const handleFileUpload = (event, doc) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prevFiles) => ({
        ...prevFiles,
        [doc]: file,
      }));
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
    if (!personalInfo?.customerId) {
      alert("Please fill in your personal information before submitting the cart.");
      return;
    }
  
    if (!loanAmount || !interestRate || !loanDuration) {
      alert("Please fill in all required loan details.");
      return;
    }
  
    // Read uploaded files and convert them to Base64
    const files = [];
    for (const [docName, file] of Object.entries(uploadedFiles)) {
      const base64File = await readFileAsBase64(file);
      files.push({ docName, fileName: file.name, base64File });
    }
  
    const loanData = {
      customerId: personalInfo.customerId,
      loanAmount,
      interestRate,
      loanDuration,
      calculatedEMI,
      employedType,
      files,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loanData),
      });
  
      if (response.ok) {
        console.log("Finance form submitted successfully");
        onClose();
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
  
  // Helper function to read file as Base64
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 data
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFilePreview = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  return (
    <Modal
      open={open}
      sx={{ display: "flex", alignItems: "end", justifyContent: "end" }}
    >
      <Box component={Paper} sx={{ m: 0.5, width: { xs: "100vw", sm: "65vh" }, height: { xs: "150vw", sm: "99vh" }, p: 1 }}>
        <Stack spacing={2} sx={{ p: 1, maxWidth: 600, height: { xs: "79vh", sm: "89vh" }, overflowY: "auto", borderRadius: 2 }}>
        <p style={{ display: "flex", alignItems: "center",justifyContent:'center'}}>
                        Car Finance Services
                    </p>
          <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr" }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Person />
                  <Typography variant="h6">Personal Information</Typography>
                </Box>
                <List dense>
                  <Typography variant="body2">customerId: {personalInfo?.customerId}</Typography>
                  <Typography variant="body2">
                    Full Name: {personalInfo?.firstName} {personalInfo?.middleName} {personalInfo?.lastName}
                  </Typography>
                  <Typography variant="body2">Email: {personalInfo?.email}</Typography>
                  <Typography variant="body2">
                    Phone Number: {personalInfo?.mobileNumber1}, {personalInfo?.mobileNumber2}
                  </Typography>
                </List>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DirectionsCar />
                  <Typography variant="h6">Vehicle Information</Typography>
                </Box>
                <List dense>
                  <Typography variant="body2">Car Model: {carInfo?.model}</Typography>
                  <Typography variant="body2">Car Version: {carInfo?.version}</Typography>
                  <Typography variant="body2">Car Color: {carInfo?.color}</Typography>
                </List>
              </Stack>
            </Paper>
          </Box>

          <Box style={{ justifyContent: "center", alignItems: "center", display: "flex", width: "100%" }}>
            <TextField
              label="Loan Amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 300 }}
            />
          </Box>

          <Box style={{ justifyContent: "center", alignItems: "center", display: "flex", marginTop: "4px" }}>
            {calculatedEMI && (
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Estimated Monthly EMI: ₹{calculatedEMI}
              </Typography>
            )}
          </Box>

          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
            <Box sx={{ flex: 1, mb: { xs: 2, sm: 0 }, mr: { xs: 4, sm: 4 }, ml: 2 }}>
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

            <Box sx={{ flex: 1, mb: { xs: 2, sm: 0 }, mr: { xs: 4, sm: 4 }, ml: 2 }}>
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

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button size="small" variant="contained" onClick={handleCalculateEMI}>
              Calculate EMI
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <FormControl
              sx={{
                mt: 2,
                width: "100%",
                maxWidth: 300,
              }}
              variant="outlined"
            >
              <InputLabel id="employed-type-label">Select Employed Type</InputLabel>
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

          {employedType && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Documents Required for {employedType} Applicants
              </Typography>
              <Box display="grid" size="small" gap={2} gridTemplateColumns={{ xs: "1fr"}}>
                {documentLists[employedType].map((doc, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2">{doc}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                            <IconButton color="primary" onClick={() => handleFilePreview(uploadedFiles[doc])} sx={{ ml: 1 }}>
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleFileRemove(doc)} sx={{ ml: 1 }}>
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

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button size="small" variant="contained" color="secondary" onClick={onClose}>
            Close
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FinanceModal;
