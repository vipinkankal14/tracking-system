import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Modal,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";

export default function Confirmation({ data, onSubmit }) {
  const [summaryData, setSummaryData] = useState({
    chargesSummary: { Total_Charges: 0 },
    onRoadPriceSummary: { Total_On_Road_Price: 0 },
    totalAmountForRoadPriceCharges: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/totalCharges?customerId=${data.personalInfo.customerId}`
        );
        setSummaryData({
          chargesSummary: response.data.ChargesSummary || { Total_Charges: 0 },
          onRoadPriceSummary: response.data.OnRoadPriceSummary || {
            Total_On_Road_Price: 0,
          },
          totalAmountForRoadPriceCharges:
            response.data.TotalAmountForRoadPriceCharges || 0,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message || "An error occurred while fetching data.");
        setOpenModal(true);
        console.error("Error fetching data:", error);
      }
    };

    fetchSummaryData();
  }, [data.personalInfo.customerId]);

  const formatCurrency = (amount) => {
    const safeAmount = Number(amount) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(safeAmount);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        customerId: data.personalInfo.customerId,
        invoice_date: new Date().toISOString().split("T")[0], // Current date
        due_date: new Date(new Date().setDate(new Date().getDate() + 30))
          .toISOString()
          .split("T")[0], // 30 days from now
        total_on_road_price: summaryData.onRoadPriceSummary.Total_On_Road_Price,
        total_charges: summaryData.chargesSummary.Total_Charges,
        grand_total: summaryData.totalAmountForRoadPriceCharges,
        on_road_price_details: {
          ex_showroom_price: summaryData.onRoadPriceSummary.exShowroomPrice,
          accessories: summaryData.onRoadPriceSummary.totalAmount,
          discount: summaryData.onRoadPriceSummary.cardiscount,
          subtotal: summaryData.onRoadPriceSummary.Subtotal,
          gst_rate: summaryData.onRoadPriceSummary.gstRate,
          gst_amount: summaryData.onRoadPriceSummary.GST_Amount,
          cess_rate: summaryData.onRoadPriceSummary.cessRate,
          cess_amount: summaryData.onRoadPriceSummary.Cess_Amount,
          total_on_road_price:
            summaryData.onRoadPriceSummary.Total_On_Road_Price,
        },
        additional_charges: {
          coating: summaryData.chargesSummary.coating_amount,
          fast_tag: summaryData.chargesSummary.fasttag_amount,
          rto: summaryData.chargesSummary.rto_amount,
          insurance: summaryData.chargesSummary.insurance_amount,
          extended_warranty: summaryData.chargesSummary.extendedwarranty_amount,
          auto_card: summaryData.chargesSummary.autocard_amount,
          total_charges: summaryData.chargesSummary.Total_Charges,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/submitInvoice",
        payload
      );
      console.log("Invoice submitted successfully:", response.data);
      onSubmit(); // Call the parent's onSubmit function if needed
    } catch (error) {
      setError(
        error.message || "An error occurred while submitting the invoice."
      );
      setOpenModal(true);
      console.error("Error submitting invoice:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="error-modal-title" variant="h6" component="h2">
            Error
          </Typography>
          <Typography id="error-modal-description" sx={{ mt: 2 }}>
            {error}
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* Buyer Details Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Buyer Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Customer ID:</strong> {data.personalInfo.customerId}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {data.personalInfo.firstName}{" "}
              {data.personalInfo.middleName} {data.personalInfo.lastName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {data.personalInfo.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Address:</strong> {data.personalInfo.address},{" "}
              {data.personalInfo.city}, {data.personalInfo.state}{" "}
              {data.personalInfo.country}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Contact:</strong> {data.personalInfo.mobileNumber1},{" "}
              {data.personalInfo.mobileNumber2}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Car Details:</strong> {data.carInfo.model},{" "}
              {data.carInfo.version}, {data.carInfo.color}
            </Typography>
            
          </Grid>
        </Grid>
      </Paper>

       {/* Invoice Tables Section */}
      <Grid container spacing={3}>
        {/* Invoice Summary Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Summary
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Amount (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Ex-showroom Price</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.onRoadPriceSummary?.exShowroomPrice
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Accessories</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.onRoadPriceSummary?.totalAmount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Discount</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.onRoadPriceSummary?.cardiscount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell align="right">
                      {formatCurrency(summaryData.onRoadPriceSummary?.Subtotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      GST ({" "}
                      <span
                        style={{
                          color:
                            typeof summaryData.onRoadPriceSummary?.gstRate ===
                            "number"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {summaryData.onRoadPriceSummary?.gstRate || 0}%
                      </span>
                      <span style={{ color: "red" }}> of Subtotal</span> )
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.onRoadPriceSummary?.GST_Amount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Cess ({" "}
                      <span
                        style={{
                          color:
                            typeof summaryData.onRoadPriceSummary?.cessRate ===
                            "number"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {summaryData.onRoadPriceSummary?.cessRate || 0}%
                      </span>
                      <span style={{ color: "red" }}> of Subtotal</span> )
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.onRoadPriceSummary?.Cess_Amount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total On-Road Price
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(
                        summaryData.onRoadPriceSummary?.Total_On_Road_Price
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Additional Charges Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Charges
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Charges</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Amount (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Coating</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.chargesSummary?.coating_amount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FastTag</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.chargesSummary?.fasttag_amount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>RTO</TableCell>
                    <TableCell align="right">
                      {formatCurrency(summaryData.chargesSummary?.rto_amount)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Insurance</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.chargesSummary?.insurance_amount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Extended Warranty</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.chargesSummary?.extendedwarranty_amount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Auto Card</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        summaryData.chargesSummary?.autocard_amount
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Charges
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(
                        summaryData.chargesSummary?.Total_Charges
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Cost Summary Section */}
      <Paper
        elevation={6}
        sx={{
          p: 2,
          mt: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom align="center">
              Cost Summary
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "primary.contrastText" }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Total On-Road Price:</Typography>
                <Typography variant="h6">
                  {formatCurrency(
                    summaryData.onRoadPriceSummary?.Total_On_Road_Price
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Total Charges:</Typography>
                <Typography variant="h6">
                  {formatCurrency(summaryData.chargesSummary?.Total_Charges)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Grand Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {formatCurrency(summaryData.totalAmountForRoadPriceCharges)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Submit Button */}
      <Box sx={{ mt: 2, textAlign: "end" }}>
        <Button color="secondary" onClick={handleSubmit}>
          Confirm Booking
        </Button>
      </Box>
    </Container>
  );
}
