import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
} from "@mui/material";

const UpDocument = () => {
  const [aadharFile, setAadharFile] = useState(null);
  const [panCardFile, setPanCardFile] = useState(null);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "aadharFile") {
      setAadharFile(files[0]);
    } else if (name === "panCardFile") {
      setPanCardFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (aadharFile || panCardFile) {
      console.log("Aadhar:", aadharFile);
      console.log("PAN Card:", panCardFile);
      alert("Files uploaded successfully!");
    } else {
      alert("Please upload at least one document.");
    }
  };

  return (
    <Box sx={{ padding: 4}}>
      
      <Grid container spacing={2}>
        {/* Aadhaar Card Upload */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom>
            Upload Aadhaar Card
          </Typography>
          <TextField
            type="file"
            name="aadharFile"
            
            // Small-sized input
            onChange={handleFileChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* PAN Card Upload */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom>
            Upload PAN Card
          </Typography>
          <TextField
            type="file"
            name="panCardFile"
             // Small-sized input
            onChange={handleFileChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          
          // Small-sized button
          sx={{
            textTransform: "none", // Prevents uppercase text
            padding: "6px 12px", // Adjust padding for smaller size
          }}
        >
          Upload Documents
        </Button>
      </Box>
    </Box>
  );
};

export default UpDocument;
