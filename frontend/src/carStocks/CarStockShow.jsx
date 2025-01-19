import React, { useState, useEffect } from "react";
import { Table, Spinner, Dropdown } from "react-bootstrap";
import axios from "axios";
 
import "./scss/CarStockShow.scss";
import { useNavigate } from "react-router-dom";
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { InputAdornment, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";

const CarStockShow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const navigate = useNavigate(); // Create navigate instance

  // Fetch car stock data from backend
  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showAllCarStocks"); // API endpoint
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

 

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
  };

  // Helper function to format date (removes time part)
  const formatDate = (dateString) => {
    return dateString ? dateString.slice(0, 10) : "N/A"; // Slices "YYYY-MM-DD"
  };

  const handleCarAllotment = (vin) => {
    navigate(`/car-allotment/${vin}`);
  };

  return (
    <>
<div style={{ marginTop: '-36px',color :'#071947'}}>
  <p className="text-md-start my-4">CAR ALLOTMENT</p>
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
                <TableCell style={{ padding: '10px' }}>VIN</TableCell>
                <TableCell className="d-none d-sm-table-cell">Chassis Number</TableCell>
                <TableCell className="d-none d-sm-table-cell">Engine Number</TableCell>
                <TableCell className="d-none d-sm-table-cell">Manufacturer Date</TableCell>
                <TableCell className="d-none d-sm-table-cell">Date In</TableCell>
                <TableCell className="d-none d-sm-table-cell">Model</TableCell>
                <TableCell className="d-none d-sm-table-cell">Version</TableCell>
                <TableCell className="d-none d-sm-table-cell">Color</TableCell>
                <TableCell className="d-none d-sm-table-cell">Fuel Type</TableCell>
                <TableCell style={{ padding: '10px' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks.map((stock, index) => (
                  !stock.customerId && (
                    <TableRow key={index}>
                      <TableCell style={{ padding: '10px' }}>{stock.vin}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{stock.chassisNumber}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{stock.engineNumber}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{formatDate(stock.manufacturerDate)}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{formatDate(stock.dateIn)}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{stock.model}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{stock.version}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{stock.color}</TableCell>
                      <TableCell className="d-none d-sm-table-cell">{stock.fuelType}</TableCell>
                      <TableCell className="" style={{ padding: '10px' }}>
                        <>
                          <Dropdown.Toggle
                            id={`dropdown-${stock.id}`}
                            variant="secondary"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              boxShadow: 'none',
                              color: 'green'
                            }}
                            onClick={() => handleCarAllotment(stock.vin)}
                            bsPrefix="custom-dropdown-toggle"
                          >
                            <AddTaskRoundedIcon style={{ fontSize: '24px', color: 'inherit' }} />
                          
                          </Dropdown.Toggle>
                          
                        </>
                      </TableCell>
                    </TableRow>
                  )
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

export default CarStockShow;
