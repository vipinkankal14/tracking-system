import React, { useState, useEffect } from "react";
import { Table, Spinner, Modal } from "react-bootstrap";
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

const AutocardApproved = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [financeAmount, setFinanceAmount] = useState("");
  const [financeReason, setFinanceReason] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/financeshow"
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

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleErrorIconClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleRefundConfirmation = async () => {
    if (!isConfirmed) {
      setError("Please confirm the finance approval.");
      return;
    }

    if (!financeAmount || isNaN(financeAmount) || financeAmount <= 0) {
      setError("Please enter a valid finance amount.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/finance/update-status/${selectedCustomer.customerId}`,
        {
          status: "Approved",
          financeAmount: parseFloat(financeAmount),
          financeReason,
        }
      );

      if (response.status === 200) {
        alert("Finance status updated successfully!");
        setShowModal(false);
        setFinanceAmount("");
        setFinanceReason("");
        setIsConfirmed(false);
        setError(null);
      }
    } catch (err) {
      setError(
        `Failed to update finance status: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setFinanceAmount("");
    setFinanceReason("");
    setError(null);
  };

  const handleDocumentsIconClick = (customer, loan) => {
    setSelectedCustomer(customer);
    setSelectedLoan(loan);
    setShowDocumentsModal(true);
  };

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
      <div
        style={{
          marginTop: "0",
          color: "#071947",
          padding: "0px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Car Finance Pending</Typography>
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
                  Email
                </TableCell>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Loans
                </TableCell>
                <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ fontSize: "12px" }}>
                      {customer.customerId}
                    </TableCell>
                    <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                      {customer.firstName} {customer.middleName}{" "}
                      {customer.lastName}
                    </TableCell>
                    <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                      {customer.email}
                    </TableCell>
                    <TableCell style={{ fontSize: "12px", padding: "10px" }}>
                      {customer.loans?.length > 0
                        ? customer.loans.map((loan, loanIndex) => (
                            <div key={loanIndex}>
                              <strong>Loan ID:</strong> {loan.id} <br />
                              <strong>Amount:</strong> {loan.loan_amount} <br />
                              <strong>Interest Rate:</strong>{" "}
                              {loan.interest_rate} <br />
                              <strong>Duration:</strong> {loan.loan_duration}{" "}
                              <br />
                              <strong>EMI:</strong> {loan.calculated_emi} <br />
                            </div>
                          ))
                        : "No loans"}
                    </TableCell>
                    <TableCell style={{ fontSize: "12px" }}>
                      {customer.loans?.length > 0
                        ? customer.loans.map((loan, loanIndex) => (
                            <DescriptionIcon
                              style={{
                                cursor: "pointer",
                                marginRight: "10px",
                              }}
                              onClick={() =>
                                handleDocumentsIconClick(customer, loan)
                              }
                            />
                          ))
                        : "No loans"}

                      <ErrorOutlineIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleErrorIconClick(customer)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Finance Approval Modal */}
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
            {selectedCustomer?.customerId || "N/A"}{" "}
            {selectedCustomer?.customerId && (
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
            {selectedCustomer && (
              <>
                <Typography>
                  <strong>Full Name:</strong>{" "}
                  {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
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
              alignItems: "center",
            }}
          >
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                label="Amount"
                type="number"
                value={financeAmount}
                onChange={(e) => setFinanceAmount(e.target.value)}
              />
            </FormControl>

            <TextareaAutosize
              minRows={3}
              placeholder="Reason for finance approval (optional)"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
              value={financeReason}
              onChange={(e) => setFinanceReason(e.target.value)}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <input
                type="checkbox"
                id="confirmCheckbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label
                htmlFor="confirmCheckbox"
                style={{
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                I confirm the finance approval
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
            {selectedCustomer?.customerId || "N/A"}{" "}
            {selectedCustomer?.customerId && (
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
            {selectedCustomer && (
              <>
                <Typography>
                  <strong>Full Name:</strong>{" "}
                  {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
                </Typography>
              </>
            )}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: "10px" }}>
                    Document Name
                  </TableCell>
                  <TableCell style={{ fontSize: "10px" }}>
                    View Document
                  </TableCell>
                  <TableCell style={{ fontSize: "10px" }}>
                    Uploaded At
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedLoan?.documents?.length > 0 ? (
                  selectedLoan.documents.map((document, index) => {
                    const { customerId, fileName } = getDocumentDetails(
                      document.document_path
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: "10px" }}>
                          {document.document_name}
                        </TableCell>
                        <TableCell style={{ fontSize: "10px" }}>
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
                        <TableCell style={{ fontSize: "10px" }}>
                          {new Date(document.uploaded_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

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

export default AutocardApproved;
