import React, { useState, useEffect } from 'react';
import { Table, Modal, Dropdown, Badge } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios'; // Import axios for API calls
import NoCrashIcon from '@mui/icons-material/NoCrash';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import CarRentalIcon from '@mui/icons-material/CarRental';

const CarAllotmentByCustomer = () => {
  // State for stocks and modal
  const [stocks, setStocks] = useState([]); // Stores car stock data
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/ShowCarStockWithCustomers'); // Ensure this matches your backend route
            setStocks(response.data); // Response should match the expected format
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };

    fetchStocks();
}, []);


  const handleShowModal = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <>
      <div className="car-stock-show">
        <h4 className="text-center my-4">CAR STOCK DETAILS</h4>

        {/* Car Stocks Table */}
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>VIN</th>
              <th className="d-none d-sm-table-cell">Customer ID</th>
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
            {stocks.map((stock, index) => (
              <tr key={index}>
                <td>{stock.vin}</td>
                <td className="d-none d-sm-table-cell">{stock.customerId}</td>
                <td className="d-none d-sm-table-cell">{stock.chassisNumber}</td>
                <td className="d-none d-sm-table-cell">{stock.engineNumber}</td>
                <td className="d-none d-sm-table-cell">{formatDate(stock.manufacturerDate)}</td>
                <td className="d-none d-sm-table-cell">{formatDate(stock.dateIn)}</td>
                <td className="d-none d-sm-table-cell">{stock.model}</td>
                <td className="d-none d-sm-table-cell">{stock.version}</td>
                <td className="d-none d-sm-table-cell">{stock.color}</td>
                <td className="d-none d-sm-table-cell">{stock.fuelType}</td>
                <td className="d-none d-sm-table-cell" style={{ padding: '0px' }}>
                  <Dropdown>
                    <Dropdown.Toggle
                      as="div"
                      bsPrefix="dropdown-toggle-custom"
                      id={`dropdown-${stock.id}`}
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ fontSize: '9px', textAlign: 'center' }}>
                      <Dropdown.Item>
                        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                          <NoCrashIcon style={{ fontSize: '14px', color: 'blue', marginRight: '8px' }} />
                          Allotment
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                          <CarCrashIcon style={{ fontSize: '14px', color: 'blue', marginRight: '8px' }} />
                          Not Allotment
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                          <CarRentalIcon style={{ fontSize: '14px', color: 'red', marginRight: '8px' }} />
                          Return Order
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td className="hide-desktop">
                  <Badge
                    bg="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleShowModal(stock)}
                  >
                    Details
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Details Modal */}
        {selectedStock && (
  <Modal show={showModal} onHide={handleCloseModal} centered>
    <Modal.Header closeButton>
      <Modal.Title>Car Booking Details</Modal.Title>
    </Modal.Header>
            <Modal.Body>
      <p><strong>customer Id:</strong> {selectedStock.customerId}</p>
      <p><strong>Full Name:</strong> {selectedStock.firstName} {selectedStock.middleName} {selectedStock.lastName}</p>
      <p><strong>VIN:</strong> {selectedStock.vin}</p>
      <p><strong>Chassis Number:</strong> {selectedStock.chassisNumber}</p>
      <p><strong>Engine Number:</strong> {selectedStock.engineNumber}</p>
      <p><strong>Manufacturer Date:</strong> {formatDate(selectedStock.manufacturerDate)}</p>
      <p><strong>Date In:</strong> {formatDate(selectedStock.dateIn)}</p>
      <p><strong>Model:</strong> {selectedStock.model}</p>
      <p><strong>Version:</strong> {selectedStock.version}</p>
      <p><strong>Color:</strong> {selectedStock.color}</p>
      <p><strong>Fuel Type:</strong> {selectedStock.fuelType}</p>
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-center gap-2">
      <Button variant="outline-primary" size="sm">Allotment</Button>
      <Button variant="outline-info" size="sm">Not Allotment</Button>
      <Button variant="outline-danger" size="sm">Return Order</Button>
    </Modal.Footer>
  </Modal>
)}

      </div>
    </>
  );
};

export default CarAllotmentByCustomer;
