import React, { useState } from "react";
import {
  Button,
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
  Card,
  CardHeader,
  CardContent,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object().shape({
  rcDocument: Yup.mixed().required("RC Document is required"),
  aadhaarDocument: Yup.mixed().required("Aadhaar Card is required"),
  panDocument: Yup.mixed().required("PAN Card is required"),
  passportPhoto: Yup.mixed().required("Passport Photo is required"),
});

export function FastTagModal({ open, onClose, personalInfo }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      rcDocument: null,
      aadhaarDocument: null,
      panDocument: null,
      passportPhoto: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!personalInfo?.customerId) {
        alert("Please fill in your personal information before submitting the Car FastTag Services.");
        return;
      }

      const formData = new FormData();
      formData.append("customerId", personalInfo.customerId);
      formData.append("rcDocument", values.rcDocument);
      formData.append("aadhaarDocument", values.aadhaarDocument);
      formData.append("panDocument", values.panDocument);
      formData.append("passportPhoto", values.passportPhoto);

      try {
        const response = await fetch("http://localhost:5000/api/submitCarFastTagRequest", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setConfirmationOpen(true);
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error submitting FastTag request:", error);
        alert("An error occurred while submitting the FastTag request.");
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
      <Modal open={open} onClose={handleClose}>
        <Box component={Paper} sx={{ width: "60vh", height: "99%", marginBottom: "4px" }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={1} sx={{ p: 1, maxWidth: 600, height: "100%", overflowY: "auto" }}>
              <Typography variant="h5" component="h1" textAlign="center">
                Car FastTag Services
              </Typography>
              <Stack spacing={2} sx={{ p: 1, m: 0.6, maxWidth: 600, height: "79vh", overflowY: "auto" }}>
                {/* File Upload Fields */}
                {["rcDocument", "aadhaarDocument", "panDocument", "passportPhoto"].map((field) => (
                  <Box key={field}>
                    <ListItem>
                      <ListItemText primary={field.replace(/([A-Z])/g, " $1").toUpperCase()} />
                      <Box display="flex" alignItems="center" gap={1}>
                        {formik.values[field] ? (
                          <>
                            <IconButton color="primary" onClick={() => handleFilePreview(formik.values[field])}>
                              <Visibility />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleFileRemove(field)}>
                              <Delete />
                            </IconButton>
                          </>
                        ) : (
                          <Button variant="outlined" component="label">
                            Upload
                            <input
                              type="file"
                              hidden
                              name={field}
                              onChange={(e) => handleFileChange(field, e)}
                            />
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                    {formik.touched[field] && formik.errors[field] && (
                      <Typography color="error" variant="caption">
                        {formik.errors[field]}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Dialog open={confirmationOpen} onClose={handleConfirmationClose}>
        <DialogTitle>Submission Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>Your FastTag form has been submitted successfully.</DialogContentText>
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
          <iframe title="File Preview" src={previewFile} width="100%" height="400px" style={{ border: "none" }} />
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