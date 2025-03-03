import React, { useState, useEffect } from "react";
import { Table, Spinner, Dropdown, Badge } from "react-bootstrap";
import axios from "axios";
 import { useNavigate } from "react-router-dom";
 import { InputAdornment, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";
 import '../css/CarBookings.scss';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const CarBookingCancel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   
  const navigate = useNavigate(); // Create navigate instance

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

  // Filter car stocks based on search query (specific fields only)
  const filteredCarStocks = carStocks.filter(
    (stock) =>
      stock.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.mobileNumber2?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.mobileNumber1?.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const handleCancelClick = (vin) => {
    navigate(`/order-edit-and-confirmed/${vin}`);
  };

  return (
    <>
      <div style={{ marginTop: '-36px',color :'#071947'}}> <p className="text-md-start my-4">CAR BOOKINGS</p> </div>
      <div className="d-flex justify-content-center justify-content-md-start"> <div className="mb-4"> <TextField variant="outlined" placeholder="Search..." label="Search Car Bookings" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ), }} /> </div> </div>
 
      {loading && (<div className="text-center"> <Spinner animation="border" role="status"> <span className="visually-hidden">Loading...</span> </Spinner> </div>)}

      {error && ( <div className="text-center text-danger"><p>{error}</p></div> )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell  style={{ fontSize: '10px', padding: '10px' }} className="d-none d-sm-table-cell" >Customer Id</TableCell>
                <TableCell style={{ fontSize: '10px' }} >Full Name</TableCell>
                <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Phone</TableCell>
                <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Email</TableCell>
                <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Model | Version | Color</TableCell>
                <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Grand total</TableCell>
                 <TableCell  style={{ fontSize: '10px', padding: '10px' }} >Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks
                  .filter(stock => stock.status !== 'confirmed') // Filter out canceled orders
                  .map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell  style={{ fontSize: '10px', padding: '10px' }} className="d-none d-sm-table-cell">{stock.customerId}</TableCell>
                      <TableCell style={{ fontSize: '10px' }} >{`${stock.firstName} ${stock.middleName} ${stock.lastName}`}</TableCell>
                      <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">{stock.mobileNumber1}, {stock.mobileNumber2}</TableCell>
                      <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">{stock.email}</TableCell>
                      <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">{stock.model} | {stock.version} | {stock.color}</TableCell>
                      <TableCell  style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">{stock.grand_total}</TableCell>
                      <TableCell  style={{  padding: '10px' }} ><Badge bg="danger">{stock.status}</Badge><ManageAccountsIcon onClick={() => handleCancelClick(stock.customerId)} style={{ marginLeft: "12px", color: '#9c39e3', cursor: 'pointer' }} /></TableCell>
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

export default CarBookingCancel;
