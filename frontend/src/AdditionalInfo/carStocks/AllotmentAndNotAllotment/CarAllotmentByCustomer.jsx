import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";
import { InputAdornment, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";
import '../scss/CarStockShow.scss';

const CarAllotmentByCustomer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch car stock data from backend
  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showAllCarStocksWithCustomers");
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
      stock.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.chassisNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.engineNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to format date (removes time part)
  const formatDate = (dateString) => {
    return dateString ? dateString.slice(0, 10) : "N/A"; // Slices "YYYY-MM-DD"
  };

  return (
    <>
      <div style={{ marginTop: '0', color: '#071947', padding: '0px', display: 'flex', justifyContent: 'center' }}>
        <p>Allocated</p>
      </div>

      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4">
          <TextField
            variant="outlined"
            placeholder="Search..."
            label="Search Car Stocks"
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

      {/* Car Stock Table */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '10px', padding: '10px' }} className="d-none d-sm-table-cell">VIN</TableCell>
                <TableCell style={{ fontSize: '10px', padding: '10px' }}>Full Name</TableCell>
                <TableCell style={{ fontSize: '10px', padding: '10px' }}>Booking Id</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Chassis Number</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Engine Number</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Manufacturer Date</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Date In</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Model</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Version</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Color</TableCell>
                <TableCell style={{ fontSize: '10px' }} className="d-none d-sm-table-cell">Fuel Type</TableCell>
                <TableCell style={{ fontSize: '10px', padding: '10px' }}>Allotment Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks.map((stock, index) => (
                  stock.customerId && stock.allotmentCarStatus === "Allocated" && (
                    <TableRow key={index} style={{ fontSize: '11px', padding: '10px', justifyContent: 'space-between' }}>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.vin}</TableCell>
                      <TableCell style={{ fontSize: '11px', padding: '10px' }}>{stock.firstName} {stock.middleName} {stock.lastName}</TableCell>
                      <TableCell style={{ fontSize: '11px', padding: '10px' }}>{stock.customerId}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.chassisNumber}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.engineNumber}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{formatDate(stock.manufacturerDate)}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{formatDate(stock.dateIn)}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.model}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.version}</TableCell>
                      <TableCell style={{ fontSize: '11px' }} className="d-none d-sm-table-cell">{stock.color}</TableCell>
                      <TableCell style={{ fontSize: '11px', padding: '10px' }} className="d-none d-sm-table-cell">{stock.fuelType}</TableCell>
                      <TableCell style={{ fontSize: '11px', padding: '10px' }}>
                        {stock.allotmentCarStatus}
                      </TableCell>
                    </TableRow>
                  )
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="12" className="text-center">
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

export default CarAllotmentByCustomer;