import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
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
  const [modalMessage, setModalMessage] = useState(""); // Message for modal
  const [modalVariant, setModalVariant] = useState(""); // Type of modal ("success" or "error")
  const [showModal, setShowModal] = useState(false); // Show/hide modal
  const [isLoading, setIsLoading] = useState(false); // Loading indicator

  const fuelOptions = ["Petrol", "Diesel", "Electric Vehicles (EVs)", "LPG", "CNG", "BIO-Diesel"];

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/CarStock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json(); // Parse JSON response
        if (response.ok) {
          setModalMessage("Car stock data submitted successfully!");
          setModalVariant("success");
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
        } else {
          throw new Error(result.message || "Duplicate VIN entry. This car stock already exists.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        setModalMessage(error.message || "An error occurred while submitting the data.");
        setModalVariant("error");
      } finally {
        setIsLoading(false);
        setShowModal(true); // Show modal regardless of success or error
      }
    }
  };
  

  const handleModalClose = () => {
    if (modalVariant === "success") {
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
    setShowModal(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="input-form" noValidate autoComplete="off">
        <h6 className="text-center">ADD CAR STOCK</h6>
        
        <Row className="mb-3 noto-sans">
          {/* VIN Field */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="vin">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}}>VIN Number</Form.Label>
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

          {/* Chassis Number */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="chassisNumber">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Chassis Number</Form.Label>
              <Form.Control
                type="text"
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          {/* Engine Number */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="engineNumber">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Engine Number</Form.Label>
              <Form.Control
                type="text"
                name="engineNumber"
                value={formData.engineNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          {/* Manufacturer Date */}
          <Col xs={6} sm={6} md={4}>
            <Form.Group controlId="manufacturerDate">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Manufacturer Date</Form.Label>
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

          {/* Date In */}
          <Col xs={6} sm={6} md={4}>
            <Form.Group controlId="dateIn">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Date In</Form.Label>
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

          {/* Fuel Type */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="fuelType">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Fuel Type</Form.Label>
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

          {/* Model */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="model">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Model</Form.Label>
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

          {/* Version */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="version">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Version</Form.Label>
              <Form.Control
                type="text"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          {/* Color */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="color">
              <Form.Label style={{ marginTop: '10px',    fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} >Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center justify-content-md-end">
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Form>

      {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered backdrop="static" keyboard={false} animation={false}> 
        <Modal.Header closeButton>
          <Modal.Title>{modalVariant === "success" ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Show VIN and the error message */}
          {modalVariant === "error" && <p><strong>VIN :</strong> {formData.vin}</p>}
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={modalVariant === "success" ? "primary" : "danger"} onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
};

export default AddCarStock;
