import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import DoneIcon from "@mui/icons-material/Done";
import { Box, Typography, Button, Paper, Divider, Grid } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css"; // Optional, if you still need Bootstrap

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  // Handle Print functionality
  const handlePrint = () => {
    if (!formData) {
      alert("No booking data available for printing");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const printDocument = iframe.contentWindow.document;
    const id = formData.personalInfo?.customerId || "N/A";

    // Format currency values
    const formatCurrency = (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(value || 0);

 printDocument.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Car Booking Receipt - AutoSales Pro</title>
      <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.4;
        color: #333;
        padding: 15px;
        max-width: 800px;
        margin: 0 auto;
      }

      .receipt {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
      }

      .receipt-header {
        background-color: #092e6b;
        color: white;
        padding: 15px;
        text-align: center;
      }

      .company-logo {
        width: 60px;
        height: 60px;
        background-color: white;
        border-radius: 50%;
        margin: 0 auto 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .company-logo span {
        font-size: 20px;
        font-weight: bold;
        color: #092e6b;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        padding: 15px;
      }

      .section {
        background: #f8f9fa;
        border-radius: 6px;
        padding: 12px;
      }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #092e6b;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 2px solid #092e6b;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        margin: 6px 0;
        font-size: 14px;
      }

      .detail-label {
        font-weight: 500;
        color: #555;
        min-width: 120px;
      }

      .receipt-footer {
        padding: 15px;
        text-align: center;
        background: #f1f3f5;
        border-top: 1px solid #ddd;
        font-size: 13px;
      }

      @media print {
        body {
        padding: 0;
        background: white;
        }
        
        .receipt {
        border: none;
        box-shadow: none;
        }
        
        .section {
        background: transparent;
        page-break-inside: avoid;
        }
        
        @page {
        margin: 0.5cm;
        }
      }
      </style>
    </head>
    <body>
      <div class="receipt">
      <div class="receipt-header">
        <div class="company-logo">
        <span>AP</span>
        </div>
        <h2 style="font-size: 20px; margin-bottom: 8px;">Car Booking Receipt</h2>
        <div style="font-size: 13px;">
        <p>AutoSales Pro • 123 Auto Street, Mumbai</p>
        <p>+91 98765 43210 • support@autosalespro.com</p>
        </div>
      </div>

      <div class="grid-container">
        <!-- Customer Details -->
        <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="detail-row">
          <span class="detail-label">Customer ID:</span>
          <span>${formData.personalInfo?.customerId || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span>${formData.personalInfo?.firstName} ${
        formData.personalInfo?.lastName
      }</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Contact:</span>
          <span>${formData.personalInfo?.mobileNumber1}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span>${formData.personalInfo?.email || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Address:</span>
          <span>${formData.personalInfo?.address}, ${
        formData.personalInfo?.city
      }</span>
        </div>
        </div>

        <!-- Vehicle Details -->
        <div class="section">
        <div class="section-title">Vehicle Information</div>
        <div class="detail-row">
          <span class="detail-label">Model:</span>
          <span>${formData.CarInfo?.model || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Variant:</span>
          <span>${formData.CarInfo?.version || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Color:</span>
          <span>${formData.CarInfo?.color || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Ex-Showroom:</span>
          <span>${formatCurrency(formData.CarInfo?.exShowroomPrice)}</span>
        </div>
        </div>
      </div>

      <!-- Additional Services -->
      <div class="grid-container">
        <div class="section">
          <div class="section-title">Additional Services</div>
          <div class="detail-row">
            <span class="detail-label">Exchange:</span>
            <span>No</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Finance:</span>
            <span>No</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Accessories:</span>
            <span>No</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Coating:</span>
            <span>No</span>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Additional Services</div>
          <div class="detail-row">
            <span class="detail-label">FastTag:</span>
            <span>No</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">RTO:</span>
            <span>No</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Insurance:</span>
            <span>No</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Extended Warranty:</span>
            <span>No</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Auto Card:</span>
            <span>No</span>
          </div>
        </div>
      </div>

      <!-- Payment Details -->
      <div class="section">
        <div class="section-title">Payment Details</div>
        <div class="detail-row">
          <span class="detail-label">Booking Amount:</span>
          <span>${formatCurrency(formData.payment?.amount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Method:</span>
          <span>${formData.payment?.method || "N/A"}</span>
        </div>
       
        <div class="detail-row">
          <span class="detail-label">Payment Date:</span>
          <span>${new Date().toLocaleDateString()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Amount:</span>
          <span>${formatCurrency(formData.payment?.totalAmount)}</span>
        </div>
      
      </div>

      <div class="receipt-footer">
        <p style="margin-bottom: 8px;">
        <strong>Booking ID:</strong> 
        ${
          id ||
          "AUTO" +
            Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, "0")
        }
        </p>
        <p>This is a computer-generated receipt • Valid without signature</p>
        <p style="margin-top: 8px;">Thank you for choosing AutoSales Pro!</p>
      </div>
      </div>
    </body>
    </html>
  `); 

    printDocument.close();

    // Trigger print after content loads
    iframe.contentWindow.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

    // Cleanup
    iframe.contentWindow.onafterprint = () => {
      document.body.removeChild(iframe);
    };
  };

  // Handle Done button click
  const handleDone = () => {
    navigate("/home"); // Navigate to the home page or another desired route
  };

  return (
    <Box sx={{ textAlign: "center", p: 5 }}>
      <Typography variant="h4" gutterBottom>
        Success!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Car booked successfully, {formData?.personalInfo?.firstName || "Guest"}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Customer ID:</strong>{" "}
        {formData?.personalInfo?.customerId || "N/A"}
      </Typography>

      {/* Printable Receipt Section */}
      <Paper
        elevation={3}
        sx={{ p: 3, mt: 4, display: "none", dPrintBlock: true }}
      >
        <Typography variant="h5" gutterBottom>
          Booking Receipt
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>
              <strong>Customer Name:</strong>{" "}
              {formData?.personalInfo?.firstName}{" "}
              {formData?.personalInfo?.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Customer ID:</strong>{" "}
              {formData?.personalInfo?.customerId || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Email:</strong> {formData?.personalInfo?.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Phone:</strong> {formData?.personalInfo?.phone}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Car Model:</strong> {formData?.carDetails?.model}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Car Color:</strong> {formData?.carDetails?.color}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Booking Date:</strong> {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="body1" align="center">
          Thank you for booking with us!
        </Typography>
      </Paper>

      {/* Buttons */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ mr: 2 }}
        >
          Print Receipt
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<DoneIcon />}
          onClick={handleDone}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default SuccessPage;
