import React, { useState, useEffect } from "react";
import { Badge, Table, Spinner, Modal, Button, Dropdown } from "react-bootstrap";
import axios from "axios";
 import NoCrashIcon from '@mui/icons-material/NoCrash';
import DeleteIcon from '@mui/icons-material/Delete';

import "./scss/CarStockShow.scss";

const CarStockShow = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

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

  // Handle opening and closing the modal
  const handleShowDetails = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
  };

  // Helper function to format date (removes time part)
  const formatDate = (dateString) => {
    return dateString ? dateString.slice(0, 10) : "N/A"; // Slices "YYYY-MM-DD"
  };

  return (
    <div className="car-stock-show">
      <h4 className="text-center my-4">CAR STOCK DETAILS</h4>

      {/* Search Input */}
      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4 input-container">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search by VIN, Chassis Number, or Engine Number"
            aria-label="Search Car Stocks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Car Stocks Table */}
      {!loading && !error && (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>VIN</th>
              <th className="d-none d-sm-table-cell">Chassis Number</th>
              <th className="d-none d-sm-table-cell">Engine Number</th>
              <th className="d-none d-sm-table-cell">Manufacturer Date</th>
              <th className="d-none d-sm-table-cell">Date In</th>
              <th className="d-none d-sm-table-cell">Model</th>
              <th className="d-none d-sm-table-cell">Version</th>
              <th className="d-none d-sm-table-cell">Color</th>
              <th className="d-none d-sm-table-cell">Fuel Type</th>
              <th className="d-none d-sm-table-cell"></th>
              <th className="hide-desktop">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredCarStocks.length > 0 ? (
              filteredCarStocks.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.vin}</td>
                  <td className="d-none d-sm-table-cell">{stock.chassisNumber}</td>
                  <td className="d-none d-sm-table-cell">{stock.engineNumber}</td>
                  <td className="d-none d-sm-table-cell">{formatDate(stock.manufacturerDate)}</td>
                  <td className="d-none d-sm-table-cell">{formatDate(stock.dateIn)}</td>
                  <td className="d-none d-sm-table-cell">{stock.model}</td>
                  <td className="d-none d-sm-table-cell">{stock.version}</td>
                  <td className="d-none d-sm-table-cell">{stock.color}</td>
                  <td className="d-none d-sm-table-cell">{stock.fuelType}</td>
                  <td className="d-none d-sm-table-cell" style={{padding:'0px'}}>
                  <Dropdown>
                    <Dropdown.Toggle
                      as="div"
                      bsPrefix="dropdown-toggle-custom"
                      id={`dropdown-${stock.id}`}
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{fontSize:'9px',textAlign:'center'}}>
                      <Dropdown.Item>
                        <div style={{ display: 'flex', alignItems: 'center',fontWeight:'bold'}}>
                          <NoCrashIcon style={{ fontSize: '14px', color:'blue',marginRight:'8px'}} />Car Allotment
                        </div>
                      </Dropdown.Item>
                     
                      <Dropdown.Item>
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight:'bold' }}>
                        <DeleteIcon style={{ fontSize: '14px', color: 'red', marginRight: '8px' }} />
                        Delete
                      </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                  <td className="hide-desktop">
                    <Badge bg="primary" onClick={() => handleShowDetails(stock)} style={{ cursor: "pointer" }}>
                      Details
                    </Badge>
                  </td>
                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static" keyboard={false} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Car Stock Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStock ? (
            <div>
              <p><strong>VIN:</strong> {selectedStock.vin}</p>
              <p><strong>Chassis Number:</strong> {selectedStock.chassisNumber}</p>
              <p><strong>Engine Number:</strong> {selectedStock.engineNumber}</p>
              <p><strong>Manufacturer Date:</strong> {formatDate(selectedStock.manufacturerDate)}</p>
              <p><strong>Date In:</strong> {formatDate(selectedStock.dateIn)}</p>
              <p><strong>Model:</strong> {selectedStock.model}</p>
              <p><strong>Version:</strong> {selectedStock.version}</p>
              <p><strong>Color:</strong> {selectedStock.color}</p>
              <p><strong>Fuel Type:</strong> {selectedStock.fuelType}</p>
            </div>
          ) : (
            <p>No details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CarStockShow;
