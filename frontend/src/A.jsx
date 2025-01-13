import React, { useState, useEffect } from "react";
import { Table, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { Select, MenuItem, Checkbox } from "@mui/material";
import axios from "axios";
import "./scss/DiscountForCarAndAdditional.scss";

const DiscountForCarAndAdditional = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [carType, setCarType] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [version, setVersion] = useState("");
  const [selectedCars, setSelectedCars] = useState([]);
  const [discount, setDiscount] = useState("");
  const [cars, setCars] = useState([]); // State for cars
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Fetch cars from API on component mount
  const fetchCars = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('http://localhost:5000/api/showAllCarStocks'); // Fetch data from API
      setCars(response.data);
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching car data:', error);
      setError("Failed to load car data. Please try again."); // Set error message
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchCars(); // Call fetchCars when component mounts
  }, []); // Fetch cars on component mount

  const uniqueValues = (key) => [...new Set(cars.map((car) => car[key]))];

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedCars(selectAll ? [] : cars.map((car) => car.id));
  };

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setSelectAll(false);
  };

  const handleSelectCar = (vin) => {
    setSelectedCars((prevSelected) => 
      prevSelected.includes(vin) 
        ? prevSelected.filter((item) => item !== vin) // Deselect if already selected
        : [...prevSelected, vin] // Add to selection
    );
  };
  
  const filteredCars = cars.filter(
    (car) =>
      (carType ? car.type === carType : true) &&
      (model ? car.model === model : true) &&
      (color ? car.color === color : true) &&
      (version ? car.version === version : true)
  );

  const filteredModels = uniqueValues("model").filter(model =>
    cars.some(car => car.model === model && (carType ? car.type === carType : true))
  );

  const filteredVersions = uniqueValues("version").filter(version =>
    cars.some(car => car.version === version && (model ? car.model === model : true))
  );

  const filteredColors = uniqueValues("color").filter(color =>
    cars.some(car => car.color === color && (version ? car.version === version : true))
  );

  const selectedCount = filteredCars.reduce(
    (count, car) => (selectedCars.includes(car.id) ? count + 1 : count),
    0
  );

  const applyChanges = async () => {
    if (!discount || isNaN(discount)) {
      alert("Please enter a valid discount amount.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/updateDiscount", {
        selectedCars, // Make sure this is an array of VINs
        discount,
      });
  
      if (response.status === 200) {
        alert(`Applied a discount of ₹${discount} to ${selectedCars.length} cars.`);
        setDiscount("");
        setSelectedCars([]);
        fetchCars(); // Refresh the car list if necessary
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      alert("Failed to apply discount. Please try again.");
    }
  };
  
  return (
    <div className="discount-car-additional">
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
      {loading && <Spinner animation="border" />} {/* Show loading spinner */}
      <Row className="g-2 align-items-center">
        <Col xs={12} sm={4} md={4} className="d-flex align-items-center">
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            color="primary"
          />
          <span className="ms-2">Selected Cars: {selectedCount}</span>
        </Col>
        <Col xs={6} sm={2}>
          <Select
            value={carType}
            onChange={handleFilterChange(setCarType)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">All Car Types</MenuItem>
            {uniqueValues("type").map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Col>
        <Col xs={6} sm={2}>
          <Select
            value={model}
            onChange={handleFilterChange(setModel)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">All Models</MenuItem>
            {filteredModels.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </Col>
        <Col xs={6} sm={2}>
          <Select
            value={version}
            onChange={handleFilterChange(setVersion)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">All Versions</MenuItem>
            {filteredVersions.map((version) => (
              <MenuItem key={version} value={version}>
                {version}
              </MenuItem>
            ))}
          </Select>
        </Col>
        <Col xs={6} sm={2}>
          <Select
            value={color}
            onChange={handleFilterChange(setColor)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">All Colors</MenuItem>
            {filteredColors.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </Col>
      </Row>

      {filteredCars.length > 0 && (
        <div className="table-container mt-4">
          <Table bordered responsive hover>
            <thead>
              <tr>
                <th>Car Type</th>
                <th>Model</th>
                <th>Color</th>
                <th>Version</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.id}>
                  <td>{car.type}</td>
                  <td>{car.model}</td>
                  <td>{car.color}</td>
                  <td>{car.version}</td>
                  <td>
                    <Checkbox
                      checked={selectedCars.includes(car.id)}
                      onChange={() => handleSelectCar(car.id)}
                      color="primary"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mt-3">
            <input
              type="number"
              placeholder="Discount Amount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={applyChanges}
              disabled={selectedCars.length === 0}
              className="ms-2"
            >
              Apply Discount
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountForCarAndAdditional;



import React, { useState } from 'react';
import axios from 'axios';

const DiscountForCarAndAdditional = () => {
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [version, setVersion] = useState('');
  const [discount, setDiscount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset messages
    setMessage('');
    setError('');

    // Validate inputs
    if (!model || !color || !version || isNaN(discount)) {
      setError('All fields are required, and discount must be a number.');
      return;
    }

    // Prepare the data to send
    const data = {
      model,
      color,
      version,
      discount: parseInt(discount), // Ensure discount is a number
    };

    try {
      const response = await axios.post('http://localhost:5000/api/discountForCriteria', data);
      setMessage(response.data.message);
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.error : 'An error occurred while updating the discount.');
    }
  };

  return (
    <div>
      <h2>Update Car Discount</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Model:</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div>
          <label>Color:</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
        </div>
        <div>
          <label>Version:</label>
          <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} required />
        </div>
        <div>
          <label>Discount:</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} required />
        </div>
        <button type="submit">Update Discount</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DiscountForCarAndAdditional;
