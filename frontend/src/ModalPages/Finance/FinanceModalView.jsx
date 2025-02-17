import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Paper,
  Stack,
  Typography,
  List,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Person, DirectionsCar } from "@mui/icons-material";
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded";
import "../Accessorie/AccessoriesModal.css";

const fetchLoanAndDocuments = async (customerId) => {
  try {
    const response = await fetch(`http://localhost:5000/loans/${customerId}`);
    if (!response.ok) throw new Error("Failed to fetch loans");
    return response.json();
  } catch (error) {
    console.error("Error fetching loan and documents:", error);
    return { loans: [] };
  }
};

const FinanceModalView = ({
  open,
  onClose,
  personalInfo,
  carInfo,
  onShowFinance,
}) => {
  const [loanData, setLoanData] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (personalInfo?.customerId) {
      fetchLoanAndDocuments(personalInfo.customerId).then(({ loans }) => {
        setLoanData(loans);
      });
    }
  }, [personalInfo?.customerId]);

  const handleUpdateClick = () => {
    setShowWarning(true);
  };

  const handleWarningClose = () => {
    setShowWarning(false);
    onShowFinance();
  };

  return (
    <>
      <Modal
        open={open}
        closeAfterTransition
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Box
          component={Paper}
          sx={{
            width: { xs: "100%", sm: "60vh" },
            height: { xs: "100%", sm: "99%" },
            marginBottom: { sm: "4px" },
          }}
        >
          <Stack
            spacing={1}
            sx={{
              p: 1,
              maxWidth: 600,
              height: { xs: "100%", sm: "100%" },
              overflowY: "auto",
              borderRadius: 2,
            }}
          >
            <Box
              textAlign="center"
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">Car Finance Services</Typography>
            </Box>

            <Stack
              spacing={2}
              sx={{
                p: 1,
                m: 0.6,
                maxWidth: 600,
                height: "79vh",
                overflowY: "auto",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={4}>
                {/* Personal Information */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person />
                      <Typography variant="h6">Personal Information</Typography>
                    </Box>
                    <List dense>
                      <Typography variant="body2">
                        Customer ID: {personalInfo?.customerId}
                      </Typography>
                      <Typography variant="body2">
                        Full Name: {personalInfo?.firstName}{" "}
                        {personalInfo?.middleName} {personalInfo?.lastName}
                      </Typography>
                      <Typography variant="body2">
                        Email: {personalInfo?.email}
                      </Typography>
                      <Typography variant="body2">
                        Phone: {personalInfo?.mobileNumber1},{" "}
                        {personalInfo?.mobileNumber2}
                      </Typography>
                    </List>
                  </Stack>
                </Paper>

                {/* Vehicle Information */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DirectionsCar />
                      <Typography variant="h6">Vehicle Information</Typography>
                    </Box>
                    <List dense>
                      <Typography variant="body2">
                        Car Model: {carInfo?.model}
                      </Typography>
                      <Typography variant="body2">
                        Car Version: {carInfo?.version}
                      </Typography>
                      <Typography variant="body2">
                        Car Color: {carInfo?.color}
                      </Typography>
                    </List>
                  </Stack>
                </Paper>

                {loanData.map((loan, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CreditScoreRoundedIcon />
                        <Typography variant="h6">
                          Loan Information {index + 1}
                        </Typography>
                      </Box>
                      <List dense>
                        <Typography variant="body2">
                          Loan Amount: {loan.loan_amount}
                        </Typography>
                        <Typography variant="body2">
                          Interest Rate: {loan.interest_rate}%
                        </Typography>
                        <Typography variant="body2">
                          Loan Duration: {loan.loan_duration} year
                        </Typography>
                        <Typography variant="body2">
                          EMI: {loan.calculated_emi} months
                        </Typography>
                        <Typography variant="body2">
                          Employment Type:{" "}
                          {loan.documents[0]?.employment_type || "N/A"}
                        </Typography>
                      </List>
                    </Stack>
                  </Paper>
                ))}

                {/* Loan Documents */}
                <Grid container spacing={1}>
                  {loanData.map((loan, index) =>
                    loan.documents.map((doc, docIndex) => {
                      const fullPath =
                        doc.uploaded_file?.replace(/\\/g, "/") || "";
                      const pathParts = fullPath.split("/");
                      const customerId = pathParts[pathParts.length - 2];
                      const fileName = pathParts[pathParts.length - 1];

                      return (
                        <Grid item xs={12} sm={6} key={`${index}-${docIndex}`}>
                          <Card sx={{ maxWidth: "100%", height: "100%" }}>
                            <CardActionArea>
                              <CardContent>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {doc.document_name}
                                </Typography>

                                <iframe
                                  src={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
                                    fileName
                                  )}`}
                                  width="100%"
                                  height="200px"
                                  title={doc.document_name}
                                  onError={(e) => {
                                    e.target.src =
                                      "path/to/fallback/document_name_or_error_page.png";
                                    console.error(
                                      "Failed to load document:",
                                      doc.document_name
                                    );
                                  }}
                                />
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      );
                    })
                  )}
                </Grid>
                <br />
              </Stack>
            </Stack>

            {/* Action Buttons */}
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onClose}
                size="small"
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateClick}
                size="small"
              >
                Update
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Dialog
        open={showWarning}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Please re-enter your data"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            All finest details need to be re-entered.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarning(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleWarningClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  
};

export default FinanceModalView;
