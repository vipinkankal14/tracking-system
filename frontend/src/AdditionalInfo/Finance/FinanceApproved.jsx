import React, { useState, useEffect } from "react";
import { Table, Spinner, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DescriptionIcon from "@mui/icons-material/Description"; // Icon for Finance documents

const FinanceApproved = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

   const [financeReason, setFinanceReason] = useState("");

  // New states for Finance documents modal
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [FinanceDocuments, setFinanceDocuments] = useState(null);

  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/showFinance"
        );

        // Ensure the response data is in the expected format
        if (response.data && Array.isArray(response.data.data)) {
          setCarStocks(response.data.data); // Use response.data.data
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
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
      stock.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.carMake?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleErrorIconClick = (stock) => {
    setSelectedStock(stock);
    setShowModal(true); // Show the cancellation modal
  };

  // Function to handle opening the Finance documents modal
  const handleDocumentsIconClick = (stock) => {
    setSelectedStock(stock);
    setFinanceDocuments({
      rcDocument: stock.rcDocument,
      insurancePolicy: stock.insurancePolicy,
      pucCertificate: stock.pucCertificate,
      identityProof: stock.identityProof,
      addressProof: stock.addressProof,
      loanClearance: stock.loanClearance,
      serviceHistory: stock.serviceHistory,
    });
    setShowDocumentsModal(true); // Show the documents modal
  };

  const handleRefundConfirmation = async () => {
    if (!isConfirmed) {
      setError("Please confirm the Finance.");
      return;
    }

   

    try {
      const response = await axios.put(
        `http://localhost:5000/api/rejected/update-status/${selectedStock.customerId}`,
        {
          status: "Rejected", //
          financeReason,
        }
      );

      if (response.status === 200) {
        alert("Finance status updated successfully!");
        setShowModal(false);
         setFinanceReason("");
        setIsConfirmed(false);
        setError(null);
      }
    } catch (err) {
      setError(
        `Failed to update Finance status: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  const handleClose = () => {
    setShowModal(false); // Close the cancellation modal
    setShowDocumentsModal(false); // Close the documents modal
    setIsConfirmed(false); // Reset confirmation checkbox
     setFinanceReason(""); // Reset Finance reason
    setError(null); // Reset error message
  };

  // Function to extract customerId and fileName from document path
  const getDocumentDetails = (documentPath) => {
    if (!documentPath) return { customerId: null, fileName: null };

    const fullPath = documentPath.replace(/\\/g, "/");
    const pathParts = fullPath.split("/");
    const customerId = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];

    return { customerId, fileName };
  };

  return (
    <>
      <div
        style={{
          marginTop: "0",
          color: "#071947",
          padding: "0px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Car Finance for Approved </Typography>
      </div>

      {/* Search Bar */}
      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4" style={{ width: "100%", maxWidth: "400px" }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            label="Search Car Finance"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
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
          <Typography>{error}</Typography>
        </div>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} style={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Customer ID
                </TableCell>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Full Name
                </TableCell>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Car Make | Car Model | Car Color
                </TableCell>

                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Car Registration
                </TableCell>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Car Year
                </TableCell>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  status
                </TableCell>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks.map((stock, index) => {
                  // Only render the row if the status is "Approved"
                  if (stock.status === "Approved") {
                    return (
                      <TableRow
                        key={index}
                        style={{
                          fontSize: "12px",
                          padding: "10px",
                        }}
                      >
                        <TableCell style={{ fontSize: "12px" }}>
                          {stock.customerId}
                        </TableCell>
                        <TableCell
                          style={{ fontSize: "12px", padding: "10px" }}
                        >
                          {stock.firstName} {stock.middleName} {stock.lastName}
                        </TableCell>
                        <TableCell
                          style={{ fontSize: "12px", padding: "10px" }}
                        >
                          {stock.carMake} | {stock.carModel} | {stock.carColor}
                        </TableCell>
                        <TableCell
                          style={{ fontSize: "12px", padding: "10px" }}
                        >
                          {stock.carRegistration}
                        </TableCell>
                        <TableCell
                          style={{ fontSize: "12px", padding: "10px" }}
                        >
                          {stock.carYear}
                        </TableCell>
                        <TableCell
                          style={{ fontSize: "12px", padding: "10px" }}
                        >
                          <Badge bg="success" style={{ cursor: "pointer" }}>
                            {" "}
                            {stock.status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "10px",
                            color: "#341047",
                          }}
                        >
                          <DescriptionIcon
                            style={{ cursor: "pointer", marginRight: "10px" }}
                            onClick={() => handleDocumentsIconClick(stock)}
                          />
                          <ErrorOutlineIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleErrorIconClick(stock)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    // Return null for rows that don't meet the condition
                    return null;
                  }
                })
              ) : (
                <TableRow>
                  <TableCell colSpan="9" className="text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Cancellation Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Typography>
            <strong>Finance Amount for:</strong>{" "}
            {selectedStock?.customerId || "N/A"}{" "}
            {selectedStock?.customerId && (
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
          <Typography fontSize={12}>
            {selectedStock && (
              <>
                 <Typography style={{fontSize: "12px"}} >
                  <strong>Full Name:</strong>{" "}
                  {`${selectedStock.firstName} ${selectedStock.middleName} ${selectedStock.lastName}`}
                </Typography>
                <Typography style={{fontSize: "12px"}} >
                  <strong>Current Finance Amount:</strong> ₹
                  {selectedStock.financeAmount || "N/A"}
                </Typography>
                <Typography style={{fontSize: "12px", color: "red"}}>
                  <strong style={{color:'black'}} >Finance Reason Approved :</strong>{" "}
                  {selectedStock.financeReason || "N/A"}
                </Typography>
              </>
            )}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "center",
              alignItems: "center", // Center horizontally
            }}
          >
          
            {/* Finance Reason Textarea */}
            <TextareaAutosize
              minRows={3}
              placeholder="Reason for Finance (optional)"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical", // Allow vertical resizing
              }}
              value={financeReason} 
              onChange={(e) => setFinanceReason(e.target.value)}
            />

            {/* Confirmation Checkbox */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-start", // Align checkbox to the left
              }}
            >
              <input
                type="checkbox"
                id="confirmCheckbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                style={{ cursor: "pointer" }} // Add pointer cursor
              />
              <label
                htmlFor="confirmCheckbox"
                style={{
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer", // Add pointer cursor
                }}
              >
                I confirm the Finance
              </label>
            </div>
          </div>
          {error && (
            <Typography
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "5px",
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <Button variant="outlined" size="small" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={!isConfirmed}
              onClick={handleRefundConfirmation}
            >
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Finance Documents Modal */}
      <Modal
        show={showDocumentsModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Typography fontSize={12}>
            <strong>Finance Documents for:</strong>{" "}
            {selectedStock?.customerId || "N/A"}{" "}
            {selectedStock?.customerId && (
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
          <Typography fontSize={12}>
            {selectedStock && (
              <>
                <Typography>
                  <strong>Full Name:</strong>{" "}
                  {`${selectedStock.firstName} ${selectedStock.middleName} ${selectedStock.lastName}`}
                </Typography>
              </>
            )}
          </Typography>
          {Object.entries(FinanceDocuments || {}).map(([key, value]) => {
            const { customerId, fileName } = getDocumentDetails(value);
            return (
              <Typography key={key}>
                <strong>{key}:</strong>
                {fileName ? (
                  <a
                    href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
                      fileName
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: "10px",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                  >
                    View Document
                  </a>
                ) : (
                  "N/A"
                )}
              </Typography>
            );
          })}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FinanceApproved;
