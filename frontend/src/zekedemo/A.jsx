import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function Confirmation({ data }) {
  const [charges, setCharges] = useState({
    coating_amount: 0,
    fasttag_amount: 0,
    rto_amount: 0,
    insurance_amount: 0,
    extendedwarranty_amount: 0,
    autocard_amount: 0,
    Total_Charges: 0,
  });

  // Fetch charges from the backend
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/totalCharges?customerId=${data.personalInfo.customerId}`
        );
        setCharges(response.data);
      } catch (error) {
        console.error("Error fetching charges:", error);
        alert("Failed to fetch charges. Please try again later.");
      }
    };

    fetchCharges();
  }, [data.personalInfo.customerId]);

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("INR", "₹");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Buyer Details Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Buyer Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>customerId:</strong> {data.personalInfo.customerId}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {data.personalInfo.firstName}{" "}
              {data.personalInfo.middleName} {data.personalInfo.lastName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {data.personalInfo.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Address:</strong> {data.personalInfo.address},{" "}
              {data.personalInfo.city}, {data.personalInfo.state}{" "}
              {data.personalInfo.country}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Contact:</strong> {data.personalInfo.mobileNumber1},{" "}
              {data.personalInfo.mobileNumber2}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Car Datalist:</strong> {data.carInfo.model},{" "}
              {data.carInfo.version}, {data.carInfo.color}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Additional Charges Table */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Additional Charges
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Charges</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Amount (₹)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Coating</TableCell>
                <TableCell align="right">
                  {formatCurrency(charges.coating_amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>FastTag</TableCell>
                <TableCell align="right">
                  {formatCurrency(charges.fasttag_amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>RTO</TableCell>
                <TableCell align="right">
                  {formatCurrency(charges.rto_amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Insurance</TableCell>
                <TableCell align="right">
                  {formatCurrency(charges.insurance_amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Extended Warranty</TableCell>
                <TableCell align="right">
                  {formatCurrency(charges.extendedwarranty_amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Auto Card</TableCell>
                <TableCell align="right">
                  {formatCurrency(charges.autocard_amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Total Charges</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatCurrency(charges.Total_Charges)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}