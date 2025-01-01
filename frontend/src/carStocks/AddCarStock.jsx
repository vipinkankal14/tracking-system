import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import "./scss/AddCarStock.scss";

const AddCarStock = () => {
  const [formData, setFormData] = useState({
    vin: "",
    manufacturerDate: "",
    dateIn: "",
    model: "",
    color: "",
    fuelType: "",
    chassisNumber: "",
    engineNumber: "",
    version: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "Other"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error for this field
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.vin.length !== 17) {
      newErrors.vin = "VIN must be exactly 17 characters.";
    }
    if (!formData.model.trim()) {
      newErrors.model = "Model is required.";
    }
    if (!formData.manufacturerDate) {
      newErrors.manufacturerDate = "Manufacturer date is required.";
    }
    if (!formData.dateIn) {
      newErrors.dateIn = "Date In is required.";
    }
    console.log("Validation Errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data Submitted:", JSON.stringify(formData, null, 2));
      setSuccessMessage("Car stock data submitted successfully!");
      setFormData({
        vin: "",
        manufacturerDate: "",
        dateIn: "",
        model: "",
        color: "",
        fuelType: "",
        chassisNumber: "",
        engineNumber: "",
        version: "",
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="input-form">
      <h6 className="text-center">ADD CAR STOCK</h6>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}

      <Row className="mb-3">
        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="vin">
            <Form.Label style={{ marginTop: '10px' }}>VIN Number</Form.Label>
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

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="chassisNumber">
            <Form.Label style={{ marginTop: '10px' }}>Chassis Number</Form.Label>
            <Form.Control
              type="text"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="engineNumber">
            <Form.Label style={{ marginTop: '10px' }}>Engine Number</Form.Label>
            <Form.Control
              type="text"
              name="engineNumber"
              value={formData.engineNumber}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={6} sm={6} md={4}>
          <Form.Group controlId="manufacturerDate">
            <Form.Label style={{ marginTop: '10px' }}>Manufacturer Date</Form.Label>
            <Form.Control
              type="date"
              name="manufacturerDate"
              value={formData.manufacturerDate}
              onChange={handleInputChange}
              isInvalid={!!errors.manufacturerDate}
            />
            <Form.Control.Feedback type="invalid">{errors.manufacturerDate}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={6} sm={6} md={4}>
          <Form.Group controlId="dateIn">
            <Form.Label style={{ marginTop: '10px' }}>Date In</Form.Label>
            <Form.Control
              type="date"
              name="dateIn"
              value={formData.dateIn}
              onChange={handleInputChange}
              isInvalid={!!errors.dateIn}
            />
            <Form.Control.Feedback type="invalid">{errors.dateIn}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="fuelType">
            <Form.Label style={{ marginTop: '10px' }}>Fuel Type</Form.Label>
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

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="model">
            <Form.Label style={{ marginTop: '10px' }}>Model</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              isInvalid={!!errors.model}
            />
            <Form.Control.Feedback type="invalid">{errors.model}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="version">
            <Form.Label style={{ marginTop: '10px' }}>Version</Form.Label>
            <Form.Control
              type="text"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="color">
            <Form.Label style={{ marginTop: '10px' }}>Color</Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-center">
        <Button variant="primary" size="sm" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default AddCarStock;
