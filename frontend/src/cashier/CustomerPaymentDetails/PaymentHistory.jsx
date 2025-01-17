import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import '../css/PaymentHistory.scss';

const PaymentHistory = () => {
  const { customerId } = useParams(); // Extract customerId from the route params
  const [paymentDetails, setPaymentDetails] = useState(null); // State to store payment details
  const [error, setError] = useState(null); // State to store errors

  // Fetch payment details when the component mounts
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customers/${customerId}`);
        setPaymentDetails(response.data); // Update state with the fetched payment details
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching payment details:", error);
        if (error.response && error.response.status === 404) {
          setError("Customer not found.");
        } else {
          setError("An error occurred while fetching payment details. Please try again.");
        }
      }
    };

    fetchPaymentDetails();
  }, [customerId]);

  // Render error message if an error occurred
  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  // Show loading spinner while data is being fetched
  if (!paymentDetails) {
    return <div style={{ textAlign: "center" }}><CircularProgress /></div>;
  }

  // Render payment details
  return (
    <>
      <div className="payment-history">
        <div className="header">
          <Typography variant="h5">Payment History Details</Typography>

          <Button size="small">Small</Button>
        </div>

        <div className="details-container">
          {/* Customer Details */}
          <Paper className="details customer-details" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
            <Typography variant="h6" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px", color: "#030547" }}><strong>Customer Details</strong></Typography>
            <Typography>
              <strong>Customer ID:</strong> {customerId || 'N/A'}
            </Typography>
            <Typography>
              <strong>Customer Type:</strong> {paymentDetails.customerType || 'N/A'}
            </Typography>
            <Typography>
              <strong>Full Name:</strong>{' '}
              {`${paymentDetails.firstName || 'N/A'} ${paymentDetails.middleName || ''} ${paymentDetails.lastName || ''}`}
            </Typography>
            <Typography>
              <strong>Birth Date:</strong> {paymentDetails.birthDate || 'N/A'}
            </Typography>
            <Typography>
              <strong>Email:</strong> {paymentDetails.email || 'N/A'}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {paymentDetails.mobileNumber1 || 'N/A'}, {paymentDetails.mobileNumber2 || 'N/A'}
            </Typography>
            <Typography>
              <strong>Address:</strong>{' '}
              {`${paymentDetails.address || 'N/A'}, ${paymentDetails.city || 'N/A'}`}
            </Typography>
            <Typography>
              <strong>State:</strong> {`${paymentDetails.state || 'N/A'}, ${paymentDetails.country || 'N/A'}`}
            </Typography>
          </Paper>

          {/* Car Details */}
          <Paper className="details car-details" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
            <Typography variant="h6" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px", color: "#030547" }}><strong>Car Details</strong></Typography>
            <Typography> <strong>Car Model:</strong> {paymentDetails.model || 'N/A'} </Typography>
            <Typography> <strong>Car Variant:</strong> {paymentDetails.variant || 'N/A'} </Typography>
            <Typography> <strong>Car Color:</strong> {paymentDetails.color || 'N/A'} </Typography>
            <Typography> <strong>Team Member:</strong> {paymentDetails.team_Member || 'N/A'} </Typography>
            <Typography> <strong>Team Leader:</strong> {paymentDetails.team_Leader || 'N/A'} </Typography>
            <Typography> <strong>Booking Amount :</strong> {paymentDetails.booking_amount || 'N/A'} </Typography>  
            <Typography> <strong>On-Road Price :</strong> {paymentDetails.total_onroad_price || 'N/A'} </Typography>
            <Typography> <strong>Order Date :</strong> {paymentDetails.orderDate || 'N/A'} </Typography>
            <Typography> <strong>Pre Booking :</strong> {paymentDetails.prebooking || 'N/A'} </Typography>
          </Paper>

          {/* Additional Details */}
          <Paper className="details car-details" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
            <Typography variant="h6" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px", color: "#030547" }}><strong>Additional Details</strong></Typography>
            <Typography> <strong>Exchange:</strong> {paymentDetails.exchange || 'N/A'} </Typography>
            <Typography> <strong>Finance:</strong> {paymentDetails.finance || 'N/A'} </Typography>
            <Typography> <strong>Accessories:</strong> {paymentDetails.accessories || 'N/A'} </Typography>
            <Typography> <strong>Coating:</strong> {paymentDetails.coating || 'N/A'} </Typography>
            <Typography> <strong>Auto Card:</strong> {paymentDetails.auto_card || 'N/A'} </Typography>
            <Typography> <strong>Extended Warranty:</strong> {paymentDetails.extended_warranty || 'N/A'} </Typography>  
            <Typography> <strong>RTO Tax:</strong> {paymentDetails.rto_tax || 'N/A'} </Typography>
            <Typography> <strong>Fast Tag:</strong> {paymentDetails.fast_tag || 'N/A'} </Typography>
            <Typography> <strong>Insurance:</strong> {paymentDetails.insurance || 'N/A'} </Typography>  
          </Paper>

         
        </div>
     
        
        <div className="header">  
          <Typography variant="h6">History Lines</Typography>
        </div>
         <Paper className="lines">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Classification</TableCell>
                    <TableCell>Record Type</TableCell>
                    <TableCell>Record ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Currency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentDetails.historyLines && paymentDetails.historyLines.map((line, index) => (
                    <TableRow key={index}>
                      <TableCell>{line.classification}</TableCell>
                      <TableCell>{line.recordType}</TableCell>
                      <TableCell>{line.recordId}</TableCell>
                      <TableCell>{line.description}</TableCell>
                      <TableCell>${line.amount.toFixed(2)}</TableCell>
                      <TableCell>{line.currency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
       
      </div>
    </>
  );
};

export default PaymentHistory;
