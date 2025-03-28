import {
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
 import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Modal } from "react-bootstrap";
import TextareaAutosize from "@mui/material/TextareaAutosize";

export const OrderEditAndConfirmed  = () => {
  const { customerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [carBookingData, setCarBookingData] = useState(null);
  const [additionalInfoData, setAdditionalInfoData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [ordersprebookingdate, setOrdersprebookingdate] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchCustomerData = async () => {
    if (!customerId) {
      setError("Customer ID is undefined.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/OrderEditAndCancel/${customerId}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching customer data: ${response.status}`);
      }
      const data = await response.json();

      // Set data from the API response
      setCustomerData(data.customer);
      setCarBookingData(data.carbooking);
      setAdditionalInfoData(data.additionalInfo);
      setOrdersprebookingdate(data.ordersprebookingdate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching customer data: {error}</div>;

  const {
    firstName = "N/A",
    middleName = "",
    lastName = "N/A",
    birthDate = "N/A",
    email = "N/A",
    mobileNumber1 = "N/A",
    mobileNumber2 = "",
    address = "N/A",
    city = "N/A",
    state = "N/A",
    country = "N/A",
    customertype = "N/A",
  } = customerData || {};

  const {
    exchange = "N/A",
    finance = "N/A",
    accessories = "N/A",
    coating = "N/A",
    auto_card = "N/A",
    extended_warranty = "N/A",
    rto_tax = "N/A",
    fast_tag = "N/A",
    insurance = "N/A",
  } = additionalInfoData || {};

  const {
    model = "N/A",
    variant = "N/A",
    color = "N/A",
    team_Member = "N/A",
    team_Leader = "N/A",
  } = carBookingData || {};

  const {
    prebooking = "N/A",
    prebooking_date = "N/A",
    delivery_date = "N/A",
    tentative_date = "N/A",
    preferred_date = "N/A",
    request_date = "N/A",
    order_date = "N/A",
  } = ordersprebookingdate || {};

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Cancel Order Handler
  const handleConfirmedOrder = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/confirmed-order', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel the order.');
        }

        const data = await response.json();
        alert(data.message);
        navigate('/car-booking-cancel');
    } catch (error) {
        console.error('Error:', error.message);
    }
};



  const handleBack = () => window.history.back();

  return (
    <div className="payment-history">
      <div className="header">
        <Typography
          variant="h6"
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          Booking for
          <IconButton style={{ marginLeft: "4px", padding: 0 }}>
            <AccountCircleRoundedIcon style={{ height: "20px" }} />
          </IconButton>
          <span
            style={{
              color: "#092e6b",
              marginLeft: "1px",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            {`${customerData.firstName || ""} ${customerData.lastName || ""}`}
          </span>
        </Typography>
      </div>

      <div className="details-container">
        {/* Customer Details */}
        <Paper className="details customer-details">
          <Typography
            variant="h6"
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>Customer Details</strong>
          </Typography>
          <Typography>
            <strong>Customer ID:</strong> {customerId || "N/A"}{" "}
            <VerifiedRoundedIcon
              style={{
                color: "#092e6b",
                fontSize: "15px",
                marginTop: "-3px",
                marginRight: "-4px",
              }}
            />
          </Typography>
          <Typography>
            <strong>Customer Type:</strong> {customertype || "N/A"}
          </Typography>
          <Typography>
            <strong>Full Name:</strong>{" "}
            {`${firstName || "N/A"} ${middleName || ""} ${lastName || ""}`}
          </Typography>
          <Typography>
            <strong>Birth Date:</strong> {birthDate || "N/A"}
          </Typography>
          <Typography>
            <strong>Email:</strong> {email || "N/A"}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {mobileNumber1 || "N/A"},{" "}
            {mobileNumber2 || "N/A"}
          </Typography>
          <Typography>
            <strong>Address:</strong> {`${address || "N/A"}, ${city || "N/A"}`}
          </Typography>
          <Typography>
            <strong>State:</strong> {`${state || "N/A"}, ${country || "N/A"}`}
          </Typography>
        </Paper>

        {/* Car Details */}
        <Paper className="details car-details">
          <Typography
            variant="h6"
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>Car Details</strong>
          </Typography>
          <Typography>
            <strong>Car Model:</strong> {model || "N/A"}
          </Typography>
          <Typography>
            <strong>Car Variant:</strong> {variant || "N/A"}
          </Typography>
          <Typography>
            <strong>Car Color:</strong> {color || "N/A"}
          </Typography>
          <Typography>
            <strong>Team Member:</strong> {team_Member || "N/A"}
          </Typography>
          <Typography>
            <strong>Team Leader:</strong> {team_Leader || "N/A"}
          </Typography>

          {prebooking === "YES" && (
            <>
              <Typography>
                <strong>Pre Booking:</strong> {prebooking || "N/A"}
              </Typography>
              <Typography>
                <strong>Prebooking date:</strong>{" "}
                {formatDate(prebooking_date || "N/A")}
              </Typography>
              <Typography>
                <strong>Delivery date:</strong>{" "}
                {formatDate(delivery_date || "N/A")}
              </Typography>
            </>
          )}

          {order_date === "YES" && (
            <>
              <Typography>
                <strong>Order Dates:</strong> {order_date || "N/A"}
              </Typography>
              <Typography>
                <strong>Tentative Date:</strong>{" "}
                {formatDate(tentative_date || "N/A")}
              </Typography>
              <Typography>
                <strong>Preferred Date:</strong>{" "}
                {formatDate(preferred_date || "N/A")}
              </Typography>
              <Typography>
                <strong>Request Date:</strong>{" "}
                {formatDate(request_date || "N/A")}
              </Typography>
            </>
          )}
        </Paper>

        {/* Additional Details */}
        <Paper className="details car-details">
          <Typography
            variant="h6"
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>Additional Details</strong>
          </Typography>
          <Typography>
            <strong>Exchange:</strong> {exchange || "N/A"}
          </Typography>
          <Typography>
            <strong>Finance:</strong> {finance || "N/A"}
          </Typography>
          <Typography>
            <strong>Accessories:</strong> {accessories || "N/A"}
          </Typography>
          <Typography>
            <strong>Coating:</strong> {coating || "N/A"}
          </Typography>
          <Typography>
            <strong>Auto Card:</strong> {auto_card || "N/A"}
          </Typography>
          <Typography>
            <strong>Extended Warranty:</strong> {extended_warranty || "N/A"}
          </Typography>
          <Typography>
            <strong>RTO Tax:</strong> {rto_tax || "N/A"}
          </Typography>
          <Typography>
            <strong>Fast Tag:</strong> {fast_tag || "N/A"}
          </Typography>
          <Typography>
            <strong>Insurance:</strong> {insurance || "N/A"}
          </Typography>
        </Paper>
      </div>

      {/* Buttons */}
      <div className="button-container">
        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
          <Button
            variant="contained"
            size="small"
            onClick={openModal}
            style={{
              color: "white",
              backgroundColor: "green",
              border: "1px solid green",
              width: isMobile ? "100%" : "auto", // Full width on mobile
            }}
          >
            Confirmed Order
          </Button>

          <Button
            variant="outlined"
            onClick={handleBack}
            size="small"
            style={{
              color: "blue",
              border: "1px solid blue",
              width: isMobile ? "100%" : "auto", // Full width on mobile
            }}
          >
            Back
          </Button>
        </Stack>
      </div>

      {/* Modal for Cancel Order */}
      <Modal
        show={isModalOpen}
        onHide={closeModal}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Typography>
            <strong>Confirmed Order for:</strong> {customerId || "N/A"}{" "}
            {customerId && (
              <VerifiedRoundedIcon
                style={{
                  color: "#092e6b",
                  fontSize: "15px",
                  marginTop: "-3px",
                  marginRight: "-4px",
                }}
              />
            )}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Typography>Are you sure you want to Confirmed the order?</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Reason for cancellation (optional)"
            style={{ width: "100%", marginTop: "10px" }}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
          <div style={{ marginTop: "10px" }}>
            <input
              type="checkbox"
              id="confirmCheckbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                margin: 0,
              }}
            />
            <label
              htmlFor="confirmCheckbox"
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginLeft: "5px",
                marginBottom: 0,
              }}
            >
              I confirm the cancellation
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile
            justifyContent: isMobile ? "flex-start" : "space-between", // Adjust alignment
            alignItems: "stretch", // Stretch buttons to full width in column mode
            gap: "10px", // Spacing between buttons
          }}
        >
          {/* Cancel Order Button */}
          <Button
            variant="contained"
            size="small"
            onClick={handleConfirmedOrder}
            style={{
              color: "white",
              backgroundColor: "green",
              border: "1px solid green",
              width: isMobile ? "100%" : "auto", // Full width on mobile
            }}
          >
            Confirmed Order
          </Button>

          {/* Back Button */}
          <Button
            variant="outlined"
            onClick={closeModal}
            size="small"
            style={{
              color: "blue",
              border: "1px solid blue",
              width: isMobile ? "100%" : "auto", // Full width on mobile
            }}
          >
            Back
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
