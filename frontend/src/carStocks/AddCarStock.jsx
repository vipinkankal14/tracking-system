import React, { useState } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import "./scss/AddCarStock.scss";

const AddCarStock = () => {
  const [formData, setFormData] = useState({
    vin: "",
    manufacturerDate: "",
    dateIn: "",
    make: "",
    model: "",
    color: "",
    fuelType: "",
  });

  const [errors, setErrors] = useState({});
  const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.vin.length !== 17) {
      newErrors.vin = "VIN must be exactly 17 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data Submitted:", formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="input-form">
      
      <h6>Add Car Stock</h6>
   

      <Row className="mb-3">

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="vin">
            <Form.Label  style={{ marginTop:'10px'}} >VIN Number</Form.Label>
            <Form.Control
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
              isInvalid={!!errors.vin}
              maxLength={17}
            />
            <Form.Control.Feedback type="invalid">{errors.vin}</Form.Control.Feedback>
          </Form.Group>
        </Col>


        <Col xs={6} sm={6} md={4}>
          <Form.Group controlId="manufacturerDate">
            <Form.Label  style={{ marginTop:'10px'}} >Manufacturer Date</Form.Label>
            <Form.Control
              type="date"
              name="manufacturerDate"
              value={formData.manufacturerDate}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={6} sm={6} md={4}>
          <Form.Group controlId="dateIn">
            <Form.Label  style={{ marginTop:'10px'}} >Date In</Form.Label>
            <Form.Control
              type="date"
              name="dateIn"
              value={formData.dateIn}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="make">
            <Form.Label style={{ marginTop:'10px'}} >Make</Form.Label>
            <Form.Control
              type="text"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="model">
            <Form.Label style={{ marginTop:'10px'}} >Model</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="color">
            <Form.Label style={{ marginTop:'10px'}}>Color</Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4} >
          <Form.Group controlId="fuelType">
            <Form.Label style={{ marginTop:'10px'}}>Fuel Type</Form.Label>
            <Form.Select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
            >
              <option value="">Select Fuel Type</option>
              {fuelOptions.map((fuel, index) => (
                <option key={index} value={fuel}>
                  {fuel}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

      </Row>

      <div className="d-flex gap-2">
        <Button variant="primary" size="sm">
          Small button
        </Button>

      </div>
    </Form>
  );
};

export default AddCarStock;
