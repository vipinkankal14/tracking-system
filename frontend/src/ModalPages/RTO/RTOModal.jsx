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
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  DirectionsCar,
  Person,
  Visibility,
  Delete,
  CloudUpload,
} from "@mui/icons-material";
import { Shield } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object().shape({
  form20: Yup.mixed().required("Form 20 is required"),
  form21: Yup.mixed().required("Form 21 is required"),
  form22: Yup.mixed().required("Form 22 is required"),
  invoice: Yup.mixed().required("Invoice is required"),
  insurance: Yup.mixed().required("Insurance certificate is required"),
  puc: Yup.mixed().required("PUC certificate is required"),
  idProof: Yup.mixed().required("Identity & Address Proof is required"),
  roadTax: Yup.mixed().required("Road Tax Payment Receipt is required"),
  tempReg: Yup.mixed().nullable(),
  form34: Yup.mixed().nullable(),
});

export function RTOModal({ open, onClose, personalInfo, carInfo }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      form20: null,
      form21: null,
      form22: null,
      invoice: null,
      insurance: null,
      puc: null,
      idProof: null,
      roadTax: null,
      tempReg: null,
      form34: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!personalInfo?.customerId) {
        alert(
          "Please fill in your personal information before submitting the Car RTO Services."
        );
        return;
      }

      // Create FormData object for file uploads
      const formData = new FormData();
      formData.append("customerId", personalInfo.customerId);

      // Append files to FormData
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      });

      try {
        const response = await fetch("http://localhost:5000/api/submitRTORequest", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setConfirmationOpen(true); // Open confirmation modal
        } else {
          alert(result.message); // Handle error case
        }
      } catch (error) {
        console.error("Error submitting RTO request:", error);
        alert("An error occurred while submitting the RTO request.");
      }
    },
  });

  const handleFileChange = (field, event) => {
    const file = event.currentTarget.files[0];
    if (file.size > 600 * 1024) {
      alert(`File size should not exceed 600KB. File name: ${file.name}`);
      return;
    }
    console.log(file); // Log the file object for debugging
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
                  Car RTO Services
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
                  {/* Information Sections */}
                  <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr" }}>
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
                            <h6 style={{ fontSize: "12px" }}>
                              Full Name: {personalInfo?.firstName}{" "}
                              {personalInfo?.middleName} {personalInfo?.lastName}
                            </h6>
                            <h6 style={{ fontSize: "12px" }}>
                              Email: {personalInfo?.email}
                            </h6>
                            <h6 style={{ fontSize: "12px" }}>
                              Phone Number: {personalInfo?.mobileNumber1},
                              {personalInfo?.mobileNumber2}{" "}
                            </h6>
                          </List>
                        </Box>
                      </Stack>
                    </Paper>

                   <Paper variant="outlined" sx={{ p: 2 }}>
                                       <Stack spacing={2}>
                                         <Box display="flex" alignItems="center" gap={1}>
                                           <DirectionsCar />
                                           <Typography variant="h6">
                                             Vehicle Information
                                           </Typography>
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

                    {/* Documents Required for RTO Registration */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Shield />
                          <Typography variant="h6">
                            Documents Required for RTO Registration
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Documents:
                          </Typography>
                          <List dense>
                            {[
                              { name: "form20", label: "Form 20 – Application for vehicle registration" },
                              { name: "form21", label: "Form 21 – Sale certificate issued by the dealer" },
                              { name: "form22", label: "Form 22 – Roadworthiness certificate from the manufacturer" },
                              { name: "invoice", label: "Invoice of the Vehicle – Proof of purchase" },
                              { name: "insurance", label: "Insurance Certificate – Motor insurance is mandatory" },
                              { name: "puc", label: "Pollution Under Control (PUC) Certificate – Emission compliance" },
                              { name: "idProof", label: "Identity & Address Proof – Aadhaar, PAN, Passport, Voter ID, etc." },
                              { name: "roadTax", label: "Road Tax Payment Receipt – Paid at the RTO" },
                              { name: "tempReg", label: "Temporary Registration Certificate (if applicable)" },
                              { name: "form34", label: "Form 34 – If the vehicle is financed, this form is needed for hypothecation" },
                            ].map((doc) => (
                              <ListItem key={doc.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ListItemText primary={doc.label} />
                                <Box display="flex" alignItems="center" gap={1}>
                                  {formik.values[doc.name] ? (
                                    <>
                                      <IconButton
                                        color="primary"
                                        onClick={() => handleFilePreview(formik.values[doc.name])}
                                      >
                                        <Visibility />
                                      </IconButton>
                                      <IconButton
                                        color="error"
                                        onClick={() => handleFileRemove(doc.name)}
                                      >
                                        <Delete />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      startIcon={<CloudUpload />}
                                    >
                                      Upload
                                      <input
                                        type="file"
                                        hidden
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(doc.name, e)}
                                      />
                                    </Button>
                                  )}
                                </Box>
                                {formik.touched[doc.name] && formik.errors[doc.name] && (
                                  <Typography color="error" variant="caption">
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your RTO form has been submitted successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog */}
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