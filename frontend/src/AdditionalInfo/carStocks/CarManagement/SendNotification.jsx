import React, { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { Typography, TextField } from "@mui/material";
import axios from "axios";

const SendNotification = ({ customer, show, onHide, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  
  // Default message based on customer's car booking
  const defaultMessage = `Dear ${customer?.firstName || "Customer"},\n\nWe are pleased to inform you that we have received your booking request for a ${customer?.carBooking?.model || ""} ${customer?.carBooking?.version || ""} in ${customer?.carBooking?.color || ""} color with ${customer?.carBooking?.fuelType || ""} fuel type.\n\nOur team is currently checking stock availability and will get back to you shortly.\n\nThank you for choosing our services.\n\nBest regards,\nThe Car Dealership Team`;
  
  // Set default message when component mounts or customer changes
  React.useEffect(() => {
    if (customer) {
      setMessage(defaultMessage);
    }
  }, [customer]);
  
  const handleSend = async () => {
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }
    
    setIsSending(true);
    setError("");
    
    try {
      // Replace with your actual API endpoint for sending notifications
      await axios.post("http://localhost:5000/api/Customers/Request", {
        customerId: customer.customerId,
        message: message,
        type: "car_booking",
        metadata: {
          carDetails: customer.carBooking
        }
      });
      
      setIsSending(false);
      onSuccess();
    } catch (error) {
      console.error("Error sending notification:", error);
      setError("Failed to send notification. Please try again.");
      setIsSending(false);
    }
  };
  
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Send Notification to Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {customer && (
          <>
            <div className="mb-4">
              <Typography variant="subtitle1" className="mb-2">
                Customer Details
              </Typography>
              <div className="d-flex flex-wrap">
                <div className="me-4 mb-2">
                  <Typography variant="body2">
                    <strong>Name:</strong> {`${customer.firstName || ""} ${customer.lastName || ""}`}
                  </Typography>
                </div>
                <div className="me-4 mb-2">
                  <Typography variant="body2">
                    <strong>ID:</strong> {customer.customerId}
                  </Typography>
                </div>
                <div className="me-4 mb-2">
                  <Typography variant="body2">
                    <strong>Phone:</strong> {customer.mobileNumber1}
                  </Typography>
                </div>
                <div className="mb-2">
                  <Typography variant="body2">
                    <strong>Email:</strong> {customer.email || "N/A"}
                  </Typography>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <Typography variant="subtitle1" className="mb-2">
                Car Details
              </Typography>
              <div className="d-flex flex-wrap">
                <div className="me-4 mb-2">
                  <Typography variant="body2">
                    <strong>Model:</strong> {customer.carBooking?.model || "N/A"}
                  </Typography>
                </div>
                <div className="me-4 mb-2">
                  <Typography variant="body2">
                    <strong>Version:</strong> {customer.carBooking?.version || "N/A"}
                  </Typography>
                </div>
                <div className="me-4 mb-2">
                  <Typography variant="body2">
                    <strong>Color:</strong> {customer.carBooking?.color || "N/A"}
                  </Typography>
                </div>
                <div className="mb-2">
                  <Typography variant="body2">
                    <strong>Fuel Type:</strong> {customer.carBooking?.fuelType || "N/A"}
                  </Typography>
                </div>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Notification Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter notification message"
              />
            </Form.Group>
            
            {error && (
              <div className="text-danger mb-3">
                {error}
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSending}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Sending...
            </>
          ) : "Send Notification"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendNotification;