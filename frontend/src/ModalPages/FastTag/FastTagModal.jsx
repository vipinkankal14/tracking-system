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
  Card,
  CardHeader,
  CardContent,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  CreditCard,
  Person,
  Visibility,
  Delete,
  DirectionsCar,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object().shape({
  rcDocument: Yup.mixed().required("RC Document is required"),
  aadhaarDocument: Yup.mixed().required("Aadhaar Card is required"),
  panDocument: Yup.mixed().required("PAN Card is required"),
  passportPhoto: Yup.mixed().required("Passport Photo is required"),
});

export function FastTagModal({ open, onClose, personalInfo, carInfo }) {
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
        alert(
          "Please fill in your personal information before submitting the Car FastTag Services."
        );
        return;
      }

      const FastTagData = {
        customerId: personalInfo.customerId,
        rcDocument: values.rcDocument,
        aadhaarDocument: values.aadhaarDocument,
        panDocument: values.panDocument,
        passportPhoto: values.passportPhoto,
      };

      try {
        const response = await fetch(
          "http://localhost:5000/api/submitFastTagRequest",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(FastTagData),
          }
        );

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
                  Car FastTag Services
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
                            <h6 style={{ fontSize: "12px" }}>
                              Car Number: {carInfo?.carNumber}
                            </h6>
                            <h6 style={{ fontSize: "12px" }}>
                              Car Model: {carInfo?.carModel}
                            </h6>
                            <h6 style={{ fontSize: "12px" }}>
                              Car Make: {carInfo?.carMake}
                            </h6>
                          </List>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* FASTag Guide */}
                    <Card sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
                      <CardHeader
                        title="Required Documents"
                        slotProps={{
                          title: {
                            variant: "h5",
                            align: "center",
                          },
                        }}
                      />
                      <CardContent>
                        <Box sx={{ mb: 4 }}>
                          <List dense>
                            {/* Vehicle RC */}
                            <Box sx={{ mb: 2 }}>
                              <ListItem
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <ListItemText primary="Vehicle Registration Certificate (RC)" />
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                >
                                  {formik.values.rcDocument ? (
                                    <>
                                      <IconButton
                                        color="primary"
                                        onClick={() =>
                                          handleFilePreview(
                                            formik.values.rcDocument
                                          )
                                        }
                                      >
                                        <Visibility />
                                      </IconButton>
                                      <IconButton
                                        color="error"
                                        onClick={() =>
                                          handleFileRemove("rcDocument")
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
                                        name="rcDocument"
                                        accept=".pdf"
                                        onChange={(e) => {
                                          handleFileChange("rcDocument", e);
                                        }}
                                      />
                                    </Button>
                                  )}
                                </Box>
                              </ListItem>
                              {formik.touched.rcDocument &&
                                formik.errors.rcDocument && (
                                  <Typography
                                    color="error"
                                    variant="caption"
                                    sx={{ ml: 2, display: "block" }}
                                  >
                                    {formik.errors.rcDocument}
                                  </Typography>
                                )}
                            </Box>

                            {/* KYC Documents */}
                            <Box sx={{ mb: 2 }}>
                              <ListItem sx={{ display: "block" }}>
                                <ListItemText primary="KYC Documents:" />
                                <List dense sx={{ pl: 2 }}>
                                  {/* Aadhaar Card */}
                                  <Box sx={{ mb: 1 }}>
                                    <ListItem
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <ListItemText primary="- Aadhaar Card" />
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                      >
                                        {formik.values.aadhaarDocument ? (
                                          <>
                                            <IconButton
                                              color="primary"
                                              onClick={() =>
                                                handleFilePreview(
                                                  formik.values.aadhaarDocument
                                                )
                                              }
                                            >
                                              <Visibility />
                                            </IconButton>
                                            <IconButton
                                              color="error"
                                              onClick={() =>
                                                handleFileRemove(
                                                  "aadhaarDocument"
                                                )
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
                                              name="aadhaarDocument"
                                              accept=".pdf"
                                              onChange={(e) => {
                                                handleFileChange(
                                                  "aadhaarDocument",
                                                  e
                                                );
                                              }}
                                            />
                                          </Button>
                                        )}
                                      </Box>
                                    </ListItem>
                                    {formik.touched.aadhaarDocument &&
                                      formik.errors.aadhaarDocument && (
                                        <Typography
                                          color="error"
                                          variant="caption"
                                          sx={{ ml: 2, display: "block" }}
                                        >
                                          {formik.errors.aadhaarDocument}
                                        </Typography>
                                      )}
                                  </Box>

                                  {/* PAN Card */}
                                  <Box sx={{ mb: 1 }}>
                                    <ListItem
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <ListItemText primary="- PAN Card" />
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                      >
                                        {formik.values.panDocument ? (
                                          <>
                                            <IconButton
                                              color="primary"
                                              onClick={() =>
                                                handleFilePreview(
                                                  formik.values.panDocument
                                                )
                                              }
                                            >
                                              <Visibility />
                                            </IconButton>
                                            <IconButton
                                              color="error"
                                              onClick={() =>
                                                handleFileRemove("panDocument")
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
                                              name="panDocument"
                                              accept=".pdf"
                                              onChange={(e) => {
                                                handleFileChange(
                                                  "panDocument",
                                                  e
                                                );
                                              }}
                                            />
                                          </Button>
                                        )}
                                      </Box>
                                    </ListItem>
                                    {formik.touched.panDocument &&
                                      formik.errors.panDocument && (
                                        <Typography
                                          color="error"
                                          variant="caption"
                                          sx={{ ml: 2, display: "block" }}
                                        >
                                          {formik.errors.panDocument}
                                        </Typography>
                                      )}
                                  </Box>
                                </List>
                              </ListItem>
                            </Box>

                            {/* Passport Photo */}
                            <Box sx={{ mb: 2 }}>
                              <ListItem
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <ListItemText primary="Vehicle Owner's Passport-size Photo" />
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                >
                                  {formik.values.passportPhoto ? (
                                    <>
                                      <IconButton
                                        color="primary"
                                        onClick={() =>
                                          handleFilePreview(
                                            formik.values.passportPhoto
                                          )
                                        }
                                      >
                                        <Visibility />
                                      </IconButton>
                                      <IconButton
                                        color="error"
                                        onClick={() =>
                                          handleFileRemove("passportPhoto")
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
                                        name="passportPhoto"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) => {
                                          handleFileChange(
                                            "passportPhoto",
                                            e
                                          );
                                        }}
                                      />
                                    </Button>
                                  )}
                                </Box>
                              </ListItem>
                              {formik.touched.passportPhoto &&
                                formik.errors.passportPhoto && (
                                  <Typography
                                    color="error"
                                    variant="caption"
                                    sx={{ ml: 2, display: "block" }}
                                  >
                                    {formik.errors.passportPhoto}
                                  </Typography>
                                )}
                            </Box>
                          </List>
                        </Box>
                      </CardContent>
                    </Card>
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
            Your FastTag form has been submitted successfully.
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
