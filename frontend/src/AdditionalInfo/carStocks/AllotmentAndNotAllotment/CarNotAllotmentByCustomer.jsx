import React, { useState, useEffect } from "react";
import { Table, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import { Button, InputAdornment, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Typography } from "@mui/material";
import { SearchIcon } from "lucide-react";
import '../scss/CarStockShow.scss';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

const CarAllotmentByCustomer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const filteredCarStocks = carStocks.filter(
    (stock) =>
      stock.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.chassisNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.engineNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleErrorIconClick = (stock) => {
    setSelectedStock(stock);
    setShowModal(true); // Show the modal
  };

  const handleAllotment = async (status) => {
    if (selectedStock) {
      try {
        const response = await axios.put(`http://localhost:5000/api/car/update/${selectedStock.vin}`, {
          customerId: selectedStock.customerId,
          allotmentCarStatus: status,
          cancellationReason: cancellationReason, // Include cancellation reason
        });

        // Update the local state
        setCarStocks((prevStocks) =>
          prevStocks.map((stock) =>
            stock.vin === selectedStock.vin
              ? { ...stock, allotmentCarStatus: status }
              : stock
          )
        );

        setError(''); // Clear any errors
        setShowModal(false); // Close the modal
      } catch (error) {
        setError(error.response?.data?.message || 'Error updating allotment status');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false); // Close the modal
    setCancellationReason(""); // Reset cancellation reason
    setIsConfirmed(false); // Reset confirmation checkbox
  };

  const formatDate = (dateString) => {
    return dateString ? dateString.slice(0, 10) : "N/A";
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

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <div className="text-center text-danger">
          <p>{error}</p>
        </div>
      )}

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
                <TableCell style={{ fontSize: '10px', padding: '10px' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks.map((stock, index) => (
                  stock.customerId && stock.allotmentCarStatus === "Not Allocated" && (
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
                      <TableCell style={{ fontSize: '11px', padding: '10px' }}><Button variant="outlined" color="error" size="small">{stock.allotmentCarStatus}</Button></TableCell>
                      <TableCell style={{ fontSize: '11px', padding: '10px', color: '#341047' }}>
                        <ErrorOutlineIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleErrorIconClick(stock)}
                        />
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

      <Modal show={showModal} onHide={handleClose} centered backdrop="static" keyboard={false} animation={false}>
        <Modal.Header closeButton>
          <Typography>
            <strong>Cancel Order for:</strong> {selectedStock?.customerId || 'N/A'}{' '}
            {selectedStock?.customerId && <VerifiedRoundedIcon style={{ color: '#092e6b', fontSize: '15px', marginTop: '-3px', marginRight: '-4px' }} />}
            {selectedStock && (
              <>
                <p>
                  <strong>Full Name:</strong> {`${selectedStock.firstName} ${selectedStock.middleName} ${selectedStock.lastName}`}
                </p>
              </>
            )}
          </Typography>
        </Modal.Header>

        <Modal.Body>
          <Typography>Are you sure you want to cancel the order?</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Reason for cancellation (optional)"
            style={{ width: '100%', marginTop: '10px' }}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="confirmCheckbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              style={{ marginRight: '5px' }} // Add margin to separate checkbox and label
            />
            <label htmlFor="confirmCheckbox">I confirm the cancellation</label>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={async () => {
              if (isConfirmed) {
                await handleAllotment('Allocated');
              } else {
                setError("Please confirm the cancellation.");
              }
            }}
          >
            Allotment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CarAllotmentByCustomer;