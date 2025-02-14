import React, { useState } from "react";
import {
  Button,
  List,
  Paper,
  Stack,
  Modal,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Person,
  DirectionsCar,
  Visibility,
  Delete,
  CreditCard,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object().shape({
  rcDocument: Yup.mixed().required("RC Document is required"),
  salesInvoice: Yup.mixed().required("Sales Invoice is required"),
  identityProof: Yup.mixed().required("Identity Proof is required"),
  addressProof: Yup.mixed().required("Address Proof is required"),
  form21: Yup.mixed().required("Form 21 is required"),
  form22: Yup.mixed().required("Form 22 is required"),
  tempReg: Yup.mixed().nullable(),
  puc: Yup.mixed().required("PUC Certificate is required"),
  loanDocuments: Yup.mixed().nullable(),
});

export function InsuranceModal({ open, onClose, personalInfo, carInfo }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      rcDocument: null,
      salesInvoice: null,
      identityProof: null,
      addressProof: null,
      form21: null,
      form22: null,
      tempReg: null,
      puc: null,
      loanDocuments: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!personalInfo?.customerId) {
        alert(
          "Please fill in your personal information before submitting the Car Insurance form."
        );
        return;
      }

      const insuranceData = {
        customerId: personalInfo.customerId,
        rcDocument: values.rcDocument,
        salesInvoice: values.salesInvoice,
        identityProof: values.identityProof,
        addressProof: values.addressProof,
        form21: values.form21,
        form22: values.form22,
        tempReg: values.tempReg,
        puc: values.puc,
        loanDocuments: values.loanDocuments,
      };

      try {
        const response = await fetch(
          "http://localhost:5000/api/submitInsuranceRequest",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(insuranceData),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setConfirmationOpen(true);
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error submitting insurance request:", error);
        alert("An error occurred while submitting the insurance request.");
      }
    },
  });

  const handleFileChange = (field, event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue(field, file);
    formik.setFieldTouched(field, true, false);
  };

  const handleFilePreview = (file) => {
    const fileURL = URL.createObjectURL(file);
    setPreviewFile(fileURL);
  };

  const handleFileRemove = (field) => {
    formik.setFieldValue(field, null);
    formik.setFieldTouched(field, true, false);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    handleClose();
  };

  const handlePreviewClose = () => {
    setPreviewFile(null);
  };

  return (
    <>
      <Modal
        open={open}
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
          <form onSubmit={formik.handleSubmit}>
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
                  width: "55vh",
                  justifyContent: "start",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Typography variant="h5" component="h1">
                  Car Insurance Services
                </Typography>
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
                  <Box
                    display="grid"
                    gap={3}
                    gridTemplateColumns={{ xs: "1fr" }}
                  >
                    {/* Personal Information */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person />
                          <Typography variant="h6">
                            Personal Information
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Information:
                          </Typography>
                          <List dense>
                            <Typography variant="body2">
                              Full Name: {personalInfo?.firstName}{" "}
                              {personalInfo?.middleName}{" "}
                              {personalInfo?.lastName}
                            </Typography>
                            <Typography variant="body2">
                              Email: {personalInfo?.email}
                            </Typography>
                            <Typography variant="body2">
                              Phone Number: {personalInfo?.mobileNumber1},{" "}
                              {personalInfo?.mobileNumber2}
                            </Typography>
                          </List>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Car Information */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DirectionsCar />
                          <Typography variant="h6">Car Information</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Information:
                          </Typography>
                          <List dense>
                            <Typography variant="body2">
                              Car Number: {carInfo?.carNumber}
                            </Typography>
                            <Typography variant="body2">
                              Car Model: {carInfo?.carModel}
                            </Typography>
                            <Typography variant="body2">
                              Car Make: {carInfo?.carMake}
                            </Typography>
                          </List>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Required Documents */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CreditCard />
                          <Typography variant="h6">
                            Required Documents
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Documents:
                          </Typography>
                          <List dense>
                            {[
                              {
                                name: "rcDocument",
                                label: "Car Registration Certificate (RC)",
                              },
                              {
                                name: "salesInvoice",
                                label: "Sales Invoice of the Car",
                              },
                              {
                                name: "identityProof",
                                label: "Identity Proof",
                              },
                              {
                                name: "addressProof",
                                label: "Address Proof",
                              },
                              {
                                name: "form21",
                                label: "Form 21 - Sale Certificate",
                              },
                              {
                                name: "form22",
                                label: "Form 22 - Roadworthiness Certificate",
                              },
                              {
                                name: "tempReg",
                                label: "Temporary Registration Number (if applicable)",
                              },
                              {
                                name: "puc",
                                label: "Pollution Under Control (PUC) Certificate",
                              },
                              {
                                name: "loanDocuments",
                                label: "Loan/Hypothecation Documents (if car is financed)",
                              },
                            ].map((doc) => (
                              <ListItem
                                key={doc.name}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <ListItemText primary={doc.label} />
                                <Box display="flex" alignItems="center" gap={1}>
                                  {formik.values[doc.name] ? (
                                    <>
                                      <IconButton
                                        color="primary"
                                        onClick={() =>
                                          handleFilePreview(
                                            formik.values[doc.name]
                                          )
                                        }
                                      >
                                        <Visibility />
                                      </IconButton>
                                      <IconButton
                                        color="error"
                                        onClick={() =>
                                          handleFileRemove(doc.name)
                                        }
                                      >
                                        <Delete />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <Button
                                      variant="outlined"
                                      component="label"
                                    >
                                      Upload
                                      <input
                                        type="file"
                                        hidden
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) =>
                                          handleFileChange(doc.name, e)
                                        }
                                      />
                                    </Button>
                                  )}
                                </Box>
                                {formik.touched[doc.name] &&
                                  formik.errors[doc.name] && (
                                    <Typography
                                      color="error"
                                      variant="caption"
                                    >
                                      {formik.errors[doc.name]}
                                    </Typography>
                                  )}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
              </Stack>

              <Box
                size="small"
                sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Dialog open={confirmationOpen}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your insurance form has been submitted successfully.
          </DialogContentText>
          <Typography variant="subtitle2">Uploaded Documents:</Typography>
          <List>
            {Object.entries(formik.values).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText primary={`${key}: ${value?.name}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(previewFile)} onClose={handlePreviewClose}>
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent>
          <iframe
            title="File Preview"
            src={previewFile}
            width="100%"
            height="400px"
            style={{ border: "none" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}