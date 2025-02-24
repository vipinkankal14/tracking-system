import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';


import '../css/PaymentHistory.scss';


function PaymentHistory() {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomerData = async () => {
    if (!customerId) {
      setError('Customer ID is undefined.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/PaymentHistory/${customerId}`);
      if (!response.ok) {
        throw new Error(`Error fetching customer data: ${response.status}`);
      }
      const data = await response.json();

      if (data.length > 0) {
        setCustomerData(data[0]);
        setPayments(
          data.map(item => ({
            id: item.PaymentID,
            debitedAmount: Number(item.debitedAmount) || 0,
            creditedAmount: Number(item.creditedAmount) || 0,
            paymentDate: item.paymentDate,
            transactionType: item.transactionType,
            paymentType: item.paymentType,
          }))
        );
      } else {
        setError('No payments found for this customer.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching customer data: {error}</div>;

  
  const {
    firstName = 'N/A',
    middleName = '',
    lastName = 'N/A',
    customerType = 'N/A',
    birthDate = 'N/A',
    email = 'N/A',
    mobileNumber1 = 'N/A',
    mobileNumber2 = '',
    address = 'N/A',
    city = 'N/A',
    state = 'N/A',
    country = 'N/A',
    model = 'N/A',
    variant = 'N/A',
    color = 'N/A',
    team_Member = 'N/A',
    team_Leader = 'N/A',
    booking_amount = 'N/A',
    total_onroad_price = 'N/A',
    orderDate = 'N/A',
    prebooking = 'N/A',
    exchange = 'N/A',
    finance = 'N/A',
    accessories = 'N/A',
    coating = 'N/A',
    auto_card = 'N/A',
    extended_warranty = 'N/A',
    rto_tax = 'N/A',
    fast_tag = 'N/A',
    insurance = 'N/A',
    customer_account_balance = 'N/A',
  } = customerData || {};

  return (
    <div className="payment-history">
    
            <div className="header">
              <Typography variant="h6">
                Payment History for <span className=" " style={{color:'red'}}>{`${customerData.firstName || ''} ${customerData.lastName || ''}`}</span>
              </Typography>
            </div>

            <div className="details-container">
                <Paper className="details customer-details" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
                  <Typography variant="h6" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px", color: "#030547" }}><strong>Customer Details</strong></Typography>
                  <Typography>
                    <strong>Customer ID:</strong> {customerId || 'N/A'}{' '}
                    {customerId && (
                      <VerifiedRoundedIcon style={{ color: '#092e6b', fontSize: '15px',marginTop:'-3px',marginRight:'-4px'}} />
                    )}
                  </Typography>            
                  <Typography>
                    <strong>Customer Type:</strong> {customerType || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Full Name:</strong>{' '}
                    {`${firstName || 'N/A'} ${middleName || ''} ${lastName || ''}`}
                  </Typography>
                  <Typography>
                    <strong>Birth Date:</strong> {birthDate || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {email || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Phone:</strong> {mobileNumber1 || 'N/A'}, {mobileNumber2 || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Address:</strong>{' '}
                    {`${address || 'N/A'}, ${city || 'N/A'}`}
                  </Typography>
                  <Typography>
                    <strong>State:</strong> {`${state || 'N/A'}, ${country || 'N/A'}`}
                  </Typography>
                </Paper>
             
                  {/* Car Details */}
                <Paper className="details car-details" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
                  <Typography variant="h6" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px", color: "#030547" }}><strong>Car Details</strong></Typography>
                  <Typography> <strong>Car Model:</strong> {model || 'N/A'} </Typography>
                  <Typography> <strong>Car Variant:</strong> {variant || 'N/A'} </Typography>
                  <Typography> <strong>Car Color:</strong> {color || 'N/A'} </Typography>
                  <Typography> <strong>Team Member:</strong> {team_Member || 'N/A'} </Typography>
                  <Typography> <strong>Team Leader:</strong> {team_Leader || 'N/A'} </Typography>
                  <Typography> <strong>Booking Amount :</strong> {booking_amount || 'N/A'} </Typography>  
                  <Typography> <strong>On-Road Price :</strong> {total_onroad_price || 'N/A'} </Typography>
                  <Typography> <strong>Order Date :</strong> {orderDate || 'N/A'} </Typography>
                  <Typography> <strong>Pre Booking :</strong> {prebooking || 'N/A'} </Typography>
                </Paper>
     
                  {/* Additional Details */}
                <Paper className="details car-details" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px" }}>
                  <Typography variant="h6" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "10px", color: "#030547" }}><strong>Additional Details</strong></Typography>
                  <Typography> <strong>Exchange:</strong> {exchange || 'N/A'} </Typography>
                  <Typography> <strong>Finance:</strong> {finance || 'N/A'} </Typography>
                  <Typography> <strong>Accessories:</strong> {accessories || 'N/A'} </Typography>
                  <Typography> <strong>Coating:</strong> {coating || 'N/A'} </Typography>
                  <Typography> <strong>Auto Card:</strong> {auto_card || 'N/A'} </Typography>
                  <Typography> <strong>Extended Warranty:</strong> {extended_warranty || 'N/A'} </Typography>  
                  <Typography> <strong>RTO Tax:</strong> {rto_tax || 'N/A'} </Typography>
                  <Typography> <strong>Fast Tag:</strong> {fast_tag || 'N/A'} </Typography>
                  <Typography> <strong>Insurance:</strong> {insurance || 'N/A'} </Typography>  
                </Paper>
             
            </div>

      
            <div className="header">  
                <Typography variant="body1">Payment History</Typography>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
  {/* Debited Details */}
  <Paper className="lines" style={{ flex: 1 }}>
    <Typography
      style={{
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
        marginBottom: '10px',
        color: '#030547',
        padding: '10px',
      }}
    >
      <strong>Debited Details</strong>
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Payment ID</TableCell>
            <TableCell>Debited Amount</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Payment Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length > 0 ? (
            <>
              {payments
                .filter(payment => payment.debitedAmount && payment.debitedAmount > 0)
                .map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.debitedAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(payment.paymentDate).toLocaleString()}</TableCell>
                    <TableCell>{payment.transactionType}</TableCell>
                    <TableCell>{payment.paymentType}</TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={1} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell colSpan={4}>
                  {payments
                    .filter(payment => payment.debitedAmount && payment.debitedAmount > 0)
                    .reduce((total, payment) => total + payment.debitedAmount, 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No debited payments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>

  {/* Credited Details */}
  <Paper className="lines" style={{ flex: 1 }}>
    <Typography
      style={{
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
        marginBottom: '10px',
        color: '#030547',
        padding: '10px',
      }}
    >
      <strong>Credited Details</strong>
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Payment ID</TableCell>
            <TableCell>Credited Amount</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Payment Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length > 0 ? (
            <>
              {payments
                .filter(payment => payment.creditedAmount && payment.creditedAmount > 0)
                .map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.creditedAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(payment.paymentDate).toLocaleString()}</TableCell>
                    <TableCell>{payment.transactionType}</TableCell>
                    <TableCell>{payment.paymentType}</TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell colSpan={1} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell colSpan={4}>
                  {payments
                    .filter(payment => payment.creditedAmount && payment.creditedAmount > 0)
                    .reduce((total, payment) => total + payment.creditedAmount, 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No credited payments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
        
        <Paper className="lines" style={{ flex: 1 }}>
          <Typography
            style={{
              borderBottom: '1px solid #ccc',
              paddingBottom: '10px',
              marginBottom: '10px',
              color: '#030547',
              padding: '10px',
            }}
          >
            <>Upadted Amount</>
          </Typography>

          <Typography
           style={{
               paddingBottom: '10px',
              marginBottom: '10px',
              color: '#030547',
              padding: '10px',
            }}
          ><strong>Customer Account Balance: {customer_account_balance || 'N/A'} </strong></Typography>
        </Paper>
        

</div>




            <div style={{ textAlign: 'end', marginTop: '20px' }}><Button size="small" variant="contained" color="primary" onClick={() => window.history.back()}>Back</Button></div>

    </div>
  );
}

export default PaymentHistory;
