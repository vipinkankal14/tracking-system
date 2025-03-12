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
import DescriptionIcon from "@mui/icons-material/Description";

const InsuranceRejected = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [insuranceReason, setInsuranceReason] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // Fetch customers with insurance data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/Insuranceshow"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to load customer data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle error icon click
  const handleErrorIconClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Handle insurance approval
  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/approval/update-status/${selectedCustomer.customerId}`,
        { status: "Approval" }
      );

      if (response.status === 200) {
        alert("Insurance approved successfully!");
        handleClose();
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/Insuranceshow");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(`Failed to approve insurance: ${err.response?.data?.error || err.message}`);
    }
  };

  // Handle insurance rejection
  const handleReject = async () => {
    if (!isConfirmed) {
      setError("Please confirm the insurance rejection.");
      return;
    }

    if (!insuranceReason) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/rejection/update-status/${selectedCustomer.customerId}`,
        {
          status: "Rejected",
          rejectionReason: insuranceReason,
        }
      );

      if (response.status === 200) {
        alert("Insurance rejected successfully!");
        handleClose();
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/Insuranceshow");
        setCustomers(newData.data.data);
      }
    } catch (err) {
      setError(`Failed to reject insurance: ${err.response?.data?.error || err.message}`);
    }
  };

  // Close all modals and reset state
  const handleClose = () => {
    setShowModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setInsuranceReason("");
    setError(null);
  };

  // Handle documents icon click
  const handleDocumentsIconClick = (customer, insurance) => {
    setSelectedCustomer(customer);
    setSelectedInsurance(insurance);
    setShowDocumentsModal(true);
  };

  // Extract document details from the file path
  const getDocumentDetails = (document_path) => {
    if (!document_path) return { customerId: null, fileName: null };

    const fullPath = document_path.replace(/\\/g, "/");
    const pathParts = fullPath.split("/");
    const customerId = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];

    return { customerId, fileName };
  };

  return (
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <p className="text-md-start my-4">INSURANCE REJECTED</p>
      </div>
      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4">
          <TextField
            variant="outlined"
            placeholder="Search..."
            label="Search Customers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
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
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: "10px", fontSize: "10px" }}>
                  Customer ID
                </TableCell>
                <TableCell style={{ fontSize: "10px" }}>Full Name</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Email</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Car Details</TableCell>
                 
                <TableCell style={{ fontSize: "10px" }}>
                  Insurance Amount
                </TableCell>
                <TableCell style={{ fontSize: "10px" }}>Status</TableCell>
                <TableCell style={{ fontSize: "10px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers
                  .filter(
                    (customer) =>
                      customer.insuranceRequests[0]?.status === "Rejected"
                  )
                  .map((customer) => (
                    <TableRow key={customer.customerId}>
                      <TableCell style={{ fontSize: "11px" }}>
                        {customer.customerId}
                      </TableCell>
                      <TableCell style={{ fontSize: "11px" }}>
                        {`${customer.firstName} ${customer.middleName || ""} ${
                          customer.lastName
                        }`}
                      </TableCell>
                      <TableCell style={{ fontSize: "11px" }}>
                        {customer.email}
                      </TableCell>
                      <TableCell
                                               sx={{
                                                 fontSize: "12px",
                                                 whiteSpace: "nowrap",
                                                 overflow: "hidden",
                                                 textOverflow: "ellipsis",
                                               }}
                                             >
                                               {`${customer.carBooking?.model || "N/A"} | ${
                                                 customer.carBooking?.version || "N/A"
                                               } | ${customer.carBooking?.color || "N/A"}`}
                                             </TableCell>
                      <TableCell style={{ fontSize: "11px" }}>
                        {customer.insuranceRequests[0]?.insurance_amount ||
                          "N/A"}
                      </TableCell>
                      <TableCell style={{ fontSize: "11px" }}>
                        <Badge bg="danger">
                          {customer.insuranceRequests[0]?.status || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ fontSize: "11px" }}>
                        <DescriptionIcon
                          style={{ cursor: "pointer", color: "#1b1994" }}
                          onClick={() =>
                            handleDocumentsIconClick(
                              customer,
                              customer.insuranceRequests[0]
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
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

      {/* Documents Modal */}
      <Modal
        show={showDocumentsModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Insurance Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInsurance && (
            <>
              <Typography style={{ fontSize: "12px" }} >
                <strong>Customer ID:</strong> {selectedCustomer.customerId}
              </Typography>
              <Typography style={{ fontSize: "12px" }} >
                <strong>Full Name:</strong>{" "}
                {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
              </Typography>
              <Typography style={{ fontSize: "12px" }} >
                <strong>Insurance Amount:</strong>{" "}
                {selectedInsurance.insurance_amount}
              </Typography>
              <Typography style={{ fontSize: "12px" }} >
                <strong>Created At:</strong>{" "}
                {new Date(selectedInsurance.createdAt).toLocaleString()}
              </Typography>
              <Typography style={{ fontSize: "12px" }} >
                <strong>Updated At:</strong>{" "}
                {new Date(selectedInsurance.updatedAt).toLocaleString()}
              </Typography>

              <Typography style={{ fontSize: "12px",color:'red' }} >
                <strong style={{color:'black'}} >Insurance Rejection Reason:</strong>{" "}
                {`${selectedInsurance.insuranceReason}`}
              </Typography>

              

              <TableContainer component={Paper} style={{ marginTop: "10px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: "12px" }}>
                        Document Name
                      </TableCell>
                      <TableCell style={{ fontSize: "12px" }}>
                        View Document
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { name: "RC Document", path: selectedInsurance.rcDocument },
                      { name: "Sales Invoice", path: selectedInsurance.salesInvoice },
                      { name: "Identity Proof", path: selectedInsurance.identityProof },
                      { name: "Address Proof", path: selectedInsurance.addressProof },
                      { name: "Form 21", path: selectedInsurance.form21 },
                      { name: "Form 22", path: selectedInsurance.form22 },
                      { name: "Temp Reg", path: selectedInsurance.tempReg },
                      { name: "PUC", path: selectedInsurance.puc },
                      { name: "Loan Documents", path: selectedInsurance.loanDocuments },
                    ].map((doc, index) => {
                      const { customerId, fileName } = getDocumentDetails(doc.path);
                      return (
                        <TableRow key={index}>
                          <TableCell style={{ fontSize: "12px" }}>
                            {doc.name}
                          </TableCell>
                          <TableCell style={{ fontSize: "12px" }}>
                            {fileName ? (
                              <a
                                href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
                                  fileName
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                              >
                                View Document
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
          <Button variant="success" onClick={handleApprove}>
            Approved
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InsuranceRejected;