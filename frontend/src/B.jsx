import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import '../css/PaymentHistory.scss';

const PaymentHistory = () => {
  const paymentDetails = {
    method: 'Cash',
    referenceId: 'CASH_20210615T1510188823Z325254',
    transactionId: 'RECT-2021-10006',
    receiptDate: '6/15/21',
    amountDue: 300.00,
    amountPaid: 405.88,
    currency: 'USD',
    lines: [
      { classification: 'PMT', recordType: 'PMTQACONTEST', recordId: 'ZPER-FEN-2021-00101', description: 'Application Fee', amount: 300.00, currency: 'USD' },
    ],
    drawerLines: [
      { lineNumber: 1, receiptNumber: 'RECT-2021-10006', method: 'Cash', amount: 50.00 },
      { lineNumber: 2, receiptNumber: 'RECT-2021-10006', method: 'Personal Check', amount: 100.00 },
      { lineNumber: 3, receiptNumber: 'RECT-2021-10006', method: 'Personal Check', amount: 255.88 },
    ],
  };

  return (
    <div className="payment-history">
      <div className="header">
        <Typography variant="h5">Payment History Details</Typography>
        <Button variant="outlined" className="cancel-button">Cancel</Button>
      </div>

      {/* Payment Details */}
      <Paper className="details">
        <Typography variant="h6">Payment Details</Typography>
        <Typography>Payment Method: {paymentDetails.method}</Typography>
        <Typography>Reference ID: {paymentDetails.referenceId}</Typography>
        <Typography>Transaction ID: {paymentDetails.transactionId}</Typography>
        <Typography>Receipt Date: {paymentDetails.receiptDate}</Typography>
        <Typography>Amount Due: ${paymentDetails.amountDue.toFixed(2)}</Typography>
        <Typography>Amount Paid: ${paymentDetails.amountPaid.toFixed(2)}</Typography>
        <Typography>Currency: {paymentDetails.currency}</Typography>
      </Paper>

      {/* Payment History Lines */}
      <Paper className="lines">
        <Typography variant="h6">Payment History Lines</Typography>
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
              {paymentDetails.lines.map((line, index) => (
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
  );
};

export default PaymentHistory;
