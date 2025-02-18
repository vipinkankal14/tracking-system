import { useState } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material"

export default function Confirmation({ data, onSubmit }) {
  const [formData, setFormData] = useState({
    payment: {
      type: "",
    },
  })

  // Constants for calculations
  const TOTAL_ON_ROAD = 1669800.0 // 16,69,800.00
  const TOTAL_CHARGES = 1669800.0 // 16,69,800.00
  const GRAND_TOTAL = TOTAL_ON_ROAD + TOTAL_CHARGES

  const handleInputChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }))
  }

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("INR", "₹")
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Buyer Details Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Buyer Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {data.personalInfo.firstName} {data.personalInfo.middleName}{" "}
                {data.personalInfo.lastName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {data.personalInfo.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Contact:</strong> {data.personalInfo.mobileNumber1}, {data.personalInfo.mobileNumber2}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Address:</strong> {data.personalInfo.address}, {data.personalInfo.city},{" "}
                {data.personalInfo.state} {data.personalInfo.country}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Car Datalist :</strong> {data.carInfo.model} ,{data.carInfo.version} ,{data.carInfo.color}.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Invoice Tables Section */}
      <Grid container spacing={3}>
        {/* Invoice Summary Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Summary
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Amount (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Ex-showroom Price</TableCell>
                    <TableCell align="right">23728327</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Accessories</TableCell>
                    <TableCell align="right">20,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Discount</TableCell>
                    <TableCell align="right">623487234</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell align="right">10,10,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GST (28%)</TableCell>
                    <TableCell align="right">2,82,800.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cess (20%)</TableCell>
                    <TableCell align="right">2,02,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Total On-Road Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      16,69,800.00
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Additional Charges Table */}
        <Grid item xs={12} md={6}>
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
                    <TableCell align="right">10,10,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FastTag</TableCell>
                    <TableCell align="right">2,82,800.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>RTO</TableCell>
                    <TableCell align="right">2,02,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Insurance</TableCell>
                    <TableCell align="right">1,20,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Extended Warranty</TableCell>
                    <TableCell align="right">15,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Auto Card</TableCell>
                    <TableCell align="right">40,000.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Total Charges</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      16,69,800.00
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={6}
        sx={{
          p: 2,
          mt: 2,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom align="center">
              Cost Summary
            </Typography>
            <Divider sx={{ my: 2, backgroundColor: "primary.contrastText" }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Total On-Road Price:</Typography>
                <Typography variant="h6">{formatCurrency(TOTAL_ON_ROAD)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Total Charges:</Typography>
                <Typography variant="h6">{formatCurrency(TOTAL_CHARGES)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Grand Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {formatCurrency(GRAND_TOTAL)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Payment Details Section */}
      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Payment Type</InputLabel>
              <Select
                value={formData.payment.type}
                label="Payment Type"
                onChange={(e) => handleInputChange("payment", "type", e.target.value)}
              >
                <MenuItem value="">Select Payment Type</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="creditCard">Credit Card</MenuItem>
                <MenuItem value="debitCard">Debit Card</MenuItem>
                <MenuItem value="bankTransfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Booking Amount (₹):</strong> {data.carInfo.bookingAmount}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

