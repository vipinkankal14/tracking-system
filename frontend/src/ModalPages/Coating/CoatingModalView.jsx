import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Paper,
  Stack,
  Typography,
  List,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Person, DirectionsCar } from "@mui/icons-material";
import FormatColorFillRoundedIcon from "@mui/icons-material/FormatColorFillRounded";

const CoatingModalView = ({
  open,
  onClose,
  personalInfo,
  carInfo,
  onShowCoating,
}) => {
  const [coatingData, setCoatingData] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (personalInfo?.customerId && open) {
      fetchCoatingRequests(personalInfo.customerId);
    }
  }, [personalInfo?.customerId, open]);

  const fetchCoatingRequests = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/coating-requests/${customerId}`
      );
      setCoatingData(response.data.coatingRequests[0]); // Assuming single request per customer
    } catch (error) {
      console.error("Error fetching coating requests:", error);
    }
  };

  const handleUpdateClick = () => {
    setShowWarning(true);
  };

  const handleWarningClose = () => {
    setShowWarning(false);
    onShowCoating();
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
              height: "100%",
              overflowY: "auto",
              borderRadius: 2,
            }}
          >
            <Box textAlign="center" sx={{ p: 2 }}>
              <Typography variant="h5">Car Coating Services</Typography>
            </Box>

            <Stack
              spacing={2}
              sx={{
                p: 1,
                maxWidth: 600,
                height: "79vh",
                overflowY: "auto",
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={2}>
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

                  {/* Coating Information */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <FormatColorFillRoundedIcon />
                        <Typography variant="h6">
                          Coating Information
                        </Typography>
                      </Box>
                      <List dense>
                        <Typography variant="body2">
                          Coating Type: {coatingData?.coatingType || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Amount: {coatingData?.coating_amount || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Durability: {coatingData?.durability || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Preferred Date:{" "}
                          {coatingData?.preferredDate
                            ? new Date(
                                coatingData.preferredDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Preferred Time: {coatingData?.preferredTime || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Additional Notes:{" "}
                          {coatingData?.additionalNotes || "N/A"}
                        </Typography>
                      </List>
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </Stack>

            <Box
              sx={{ p: 1, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="contained" color="primary" onClick={onClose}>
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

export default CoatingModalView;
