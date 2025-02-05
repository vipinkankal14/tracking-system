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
        [doc]: file.name,
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
    // Validate inputs before submitting
    if (!loanAmount || !interestRate || !loanDuration || !employedType || Object.keys(uploadedFiles).length === 0) {
      alert("Please fill in all fields and upload the required documents.");
      return;
    }
  
    const formData = new FormData();
    
    // Append personal info and car info
    formData.append("customerId", personalInfo.customerId);
    formData.append("loanAmount", loanAmount);
    formData.append("interestRate", interestRate);
    formData.append("loanDuration", loanDuration);
    formData.append("employedType", employedType);
    formData.append("calculatedEMI", calculatedEMI); // Add if applicable
  
    // Append uploaded files
    Object.keys(uploadedFiles).forEach((doc) => {
      const inputElement = document.getElementById(`upload-${doc}`);
      if (inputElement && inputElement.files.length > 0) {
        formData.append(doc, inputElement.files[0]);
      }
    });
  
    try {
      const response = await fetch("http://localhost:5000/submit-finance", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log("Form submitted successfully:", result);
      alert("Finance form submitted successfully!");
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };
  

  return (
    <Modal
      open={open}
      closeAfterTransition
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}
    >
      <Box component={Paper} sx={{ m: 0.5, height: "99vh", width: { xs: "100vw", sm: "85vh" }, p: 2 }}>
        <Box textAlign="center" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography id="modal-title" variant="h5">
            Car Finance Services
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ p: 1, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2 }}>
          <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Person />
                  <Typography variant="h6">Personal Information</Typography>
                </Box>
                <List dense>
                <Typography variant="body2">
                customerId: {personalInfo?.customerId}
                  </Typography>
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

          <Box
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              width: "100%", // Make Box take full width
            }}
          >
            <TextField
              label="Loan Amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
              variant="outlined"
              fullWidth // Ensures the TextField is full width
              sx={{ maxWidth: 300 }} // Optional: You can set a max width to avoid stretching too much on large screens
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

          <Button variant="contained" onClick={handleCalculateEMI}>
            Calculate EMI
          </Button>

          
          <Box
  style={{
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "100%",  
  }}
>
  <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
    <InputLabel id="employed-type-label">Select Employed Type</InputLabel>
    <Select
      labelId="employed-type-label"
      value={employedType}
      onChange={(e) => setEmployedType(e.target.value)}
      label="Select Employed Type"
      sx={{ maxWidth: 300}} // Ensures it takes full width on small screens
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
              <List>
                {documentLists[employedType].map((doc, index) => (
                  <ListItem key={index} divider>
                    <ListItemText primary={doc} />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                            {uploadedFiles[doc]}
                          </Typography>
                          <IconButton color="error" onClick={() => handleFileRemove(doc)} sx={{ ml: 1 }}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FinanceModal;
