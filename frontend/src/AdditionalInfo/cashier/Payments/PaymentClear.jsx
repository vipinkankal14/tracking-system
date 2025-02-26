import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";
 import { InputAdornment, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";
import '../css/CarBookings.scss';
import DoneAllIcon from '@mui/icons-material/DoneAll';
 
const PaymentClear = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  // Fetch car stock data from backend
  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers"); // API endpoint
        setCarStocks(response.data);
      } catch (err) {
        setError("Failed to load car stock data.");
        console.error("Error fetching car stocks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCarStocks();
  }, []);

  // Filter car stocks based on search query
  const filteredCarStocks = carStocks.filter(
    (stock) =>
      stock.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${stock.firstName} ${stock.middleName} ${stock.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <>
      <div style={{ marginTop: '-36px', color: '#071947' }}> <p className="text-md-start my-4"> PAYMENT CLEAR </p> </div>
      <div className="d-flex justify-content-center justify-content-md-start"> <div className="mb-4"> <TextField variant="outlined" placeholder="Search..." label="Search Car Bookings" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"> <SearchIcon /> </InputAdornment>), }} /> </div> </div>

      {loading && (<div className="text-center"> <Spinner animation="border" role="status"> <span className="visually-hidden">Loading...</span> </Spinner> </div>)}

      {error && (<div className="text-center text-danger"><p>{error}</p></div>)}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: '10px', fontSize: '10px' }} className="d-none d-sm-table-cell" >Customer Id</TableCell>
                <TableCell style={{ fontSize: '10px' }}>Full Name</TableCell>
                <TableCell className="d-none d-sm-table-cell" style={{ fontSize: '10px' }} >Phone</TableCell>
                <TableCell className="d-none d-sm-table-cell" style={{ fontSize: '10px' }} >Email</TableCell>
                <TableCell className="d-none d-sm-table-cell" style={{ fontSize: '10px' }} >Model</TableCell>
                <TableCell className="d-none d-sm-table-cell" style={{ fontSize: '10px' }} >Version</TableCell>
                <TableCell className="d-none d-sm-table-cell" style={{ fontSize: '10px' }} >Color</TableCell>
                <TableCell className="d-none d-sm-table-cell" style={{ fontSize: '10px' }} >Grand total</TableCell>
                <TableCell className="d-none d-sm-table-cell" style={{ fontSize: '10px' }}>Booking Amount</TableCell>
                <TableCell style={{ padding: '10px', fontSize: '10px' }}>Payment Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks
                  .filter(stock => stock.payment_status === "Paid")
                  .map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell className="d-none d-sm-table-cell" style={{ padding: '10px', fontSize: '11px' }}>{stock.customerId}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} >{`${stock.firstName} ${stock.middleName} ${stock.lastName}`}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.mobileNumber1}, {stock.mobileNumber2}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.email}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.model}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.variant}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.color}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.grand_total}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.customer_account_balance}</TableCell>
                      <TableCell style={{ padding: '8px', fontSize: '11px' }}>
                        {stock.payment_status}
                        <DoneAllIcon
                          style={{ marginLeft: "6px", color: '#1b1994', cursor: 'pointer' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow><TableCell colSpan="10" className="text-center"> No records found.</TableCell> </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </>
  );
};

export default PaymentClear;
