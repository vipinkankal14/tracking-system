import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import "./scss/AddCarStock.scss";

const AddCarStock = () => {
  const [formData, setFormData] = useState({
    carType: "",
    mileage:"",
    batteryCapacity:"",
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
            carType: "",
            mileage:"",
            batteryCapacity:"",
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
        engineCapacity:"",
        transmission:"",
        exShowroomPrice:"",
        bookingAmount:"",
        carType: "",
        mileage:"",
        batteryCapacity: "",
        
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

        <p className="mb-3 noto-sans">

          <Row>
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="carType">
                <Form.Label style={{
                  marginTop: '10px',
                  fontSize: '16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Car Type
                </Form.Label>
                <Form.Control
                  as="select"
                  name="carType"
                  value={formData.carType}
                  onChange={handleInputChange}
                  isInvalid={!!errors.carType}
                >
                  <option value="">Select Car Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.carType}</Form.Control.Feedback>
              </Form.Group>
            </Col>



            {/* VIN Field */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="vin">
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>VIN Number</Form.Label>
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
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Chassis Number</Form.Label>
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
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Engine Number</Form.Label>
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
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Manufacturer Date</Form.Label>
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
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Date In</Form.Label>
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
          </Row>




          <Row>
            {/* Fuel Type Input */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="fuelType">
                <Form.Label
                  style={{
                    marginTop: '10px',
                    fontSize: '16px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Fuel Type
                </Form.Label>
                <Form.Select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric Vehicles (EVs)">Electric Vehicles (EVs)</option>
                  <option value="LPG">LPG</option>
                  <option value="CNG">CNG</option>
                  <option value="BIO-Diesel">BIO-Diesel</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Battery Capacity Input (conditionally rendered) */}
            {formData.fuelType === "Electric Vehicles (EVs)" && (
              <Col xs={12} sm={6} md={4}>
                <Form.Group controlId="batteryCapacity">
                  <Form.Label
                    style={{
                      marginTop: '10px',
                      fontSize: '16px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Battery Capacity
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="batteryCapacity"
                    value={formData.batteryCapacity}
                    onChange={handleInputChange}
                    isInvalid={!!errors.batteryCapacity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.batteryCapacity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}
          </Row>




          <Row>
            {/* Model */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="model">
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Model</Form.Label>
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
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Version</Form.Label>
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
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Color</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

          </Row>

          <Row>
            {/* Mileage Input */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="mileage">
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Mileage</Form.Label>
                <Form.Control
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  isInvalid={!!errors.mileage}
                  maxLength={10}
                />
                <Form.Control.Feedback type="invalid">{errors.mileage}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Engine Capacity Input */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="engineCapacity">
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Engine Capacity</Form.Label>
                <Form.Control
                  type="text"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                  isInvalid={!!errors.engineCapacity}
                  maxLength={10}
                />
                <Form.Control.Feedback type="invalid">{errors.engineCapacity}</Form.Control.Feedback>
              </Form.Group>
            </Col>

           {/* Transmission Type Input */}
          <Col xs={12} sm={6} md={4}>
            <Form.Group controlId="transmissionType">
              <Form.Label
                style={{
                  marginTop: '10px',
                  fontSize: '16px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Transmission Type
              </Form.Label>
              <Form.Select
                name="transmissionType"
                value={formData.transmissionType}
                onChange={handleInputChange}
              >
                <option value="">Select Transmission Type</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
                <option value="CVT">CVT (Continuously Variable Transmission)</option>
              </Form.Select>
            </Form.Group>
          </Col>

          </Row>

          <Row>
            {/* Ex-Showroom Price Input */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="exShowroomPrice">
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Ex-Showroom Price</Form.Label>
                <Form.Control
                  type="number"
                  name="exShowroomPrice"
                  value={formData.exShowroomPrice}
                  onChange={handleInputChange}
                  isInvalid={!!errors.exShowroomPrice}
                />
                <Form.Control.Feedback type="invalid">{errors.exShowroomPrice}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Booking Amount Input */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group controlId="bookingAmount">
                <Form.Label style={{ marginTop: '10px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >Booking Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="bookingAmount"
                  value={formData.bookingAmount}
                  onChange={handleInputChange}
                  isInvalid={!!errors.bookingAmount}
                />
                <Form.Control.Feedback type="invalid">{errors.bookingAmount}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>



        </p>

        <Row>
          <div className="d-flex justify-content-center justify-content-md-end">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Row>

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
