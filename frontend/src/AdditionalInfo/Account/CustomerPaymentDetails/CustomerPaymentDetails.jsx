import React, { useState, useEffect } from "react";
import { Table, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, InputAdornment, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";
import '../css/CarBookings.scss';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const CustomerPaymentDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("all"); // State for payment filter

  const navigate = useNavigate();

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

  // Filter car stocks based on search query and payment status
  const filteredCarStocks = carStocks.filter((stock) => {
    const matchesSearchQuery =
      stock.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.mobileNumber2?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.mobileNumber1?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPaymentFilter =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && stock.payment_status === "Paid") ||
      (paymentFilter === "unpaid" && stock.payment_status === "Unpaid");

    return matchesSearchQuery && matchesPaymentFilter;
  });

  const handleCancelClick = (vin) => {
    navigate(`/payment-history/${vin}`);
  };

  return (
    <>
      <div style={{ marginTop: '-36px', color: '#071947' }}>
        <p className="text-md-start my-4">CUSTOMER PAYMENT DETAILS</p>
      </div>

      {/* Search Bar */}
      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4">
          <TextField
            variant="outlined"
            placeholder="Search..."
            label="Search Car Bookings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {/* Paid and Unpaid Buttons */}
      <div className="d-flex justify-content-center justify-content-md-end">
        <div className="mb-4 d-flex gap-2">
          <Button
            variant={paymentFilter === "paid" ? "contained" : "outlined"}
            color="success"
            style={{ marginRight: "8px", fontSize: '10px' }}
            onClick={() => setPaymentFilter("paid")}
            size="small"
          >
            Paid
          </Button>
          <Button
            variant={paymentFilter === "unpaid" ? "contained" : "outlined"}
            color="error"
            style={{ marginLeft: "8px", fontSize: '10px' }}
            onClick={() => setPaymentFilter("unpaid")}
            size="small"

          >
            Unpaid
          </Button>
          <Button
            variant={paymentFilter === "all" ? "contained" : "outlined"}
            color="primary"
            style={{ marginLeft: "8px" , fontSize: '10px'}}
            onClick={() => setPaymentFilter("all")}
            size="small"

          >
            All
          </Button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center text-danger">
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "10px", padding: '10px' }} className="d-none d-sm-table-cell">Customer Id</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Full Name</TableCell>
                <TableCell style={{ fontSize: "10px" }} className="d-none d-sm-table-cell">Phone</TableCell>
                <TableCell style={{ fontSize: "10px" }} className="d-none d-sm-table-cell">Email</TableCell>
                <TableCell style={{ fontSize: "10px" }} className="d-none d-sm-table-cell">Model | Version | Color</TableCell>
                <TableCell style={{ fontSize: "10px", padding: '10px' }}>Status</TableCell>
                <TableCell style={{ fontSize: "10px", padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ fontSize: "10px", padding: '10px' }} className="d-none d-sm-table-cell">{stock.customerId}</TableCell>
                    <TableCell style={{ fontSize: "10px" }}>{`${stock.firstName} ${stock.middleName} ${stock.lastName}`}</TableCell>
                    <TableCell style={{ fontSize: "10px" }} className="d-none d-sm-table-cell">{stock.mobileNumber1}, {stock.mobileNumber2}</TableCell>
                    <TableCell style={{ fontSize: "10px" }} className="d-none d-sm-table-cell">{stock.email}</TableCell>
                    <TableCell style={{ fontSize: "10px" }} className="d-none d-sm-table-cell">{stock.model} | {stock.variant} | {stock.color}</TableCell>
                    <TableCell style={{ padding: '10px' }}>
                      <Badge bg={stock.payment_status === "Paid" ? "success" : "danger"}>
                        {stock.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ padding: '10px' }}>
                      <ManageAccountsIcon
                        onClick={() => handleCancelClick(stock.customerId)}
                        style={{ marginLeft: "12px", color: '#9c39e3', cursor: 'pointer' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" className="text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default CustomerPaymentDetails;