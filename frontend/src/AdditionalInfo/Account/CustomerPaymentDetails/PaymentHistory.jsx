import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function PaymentHistory() {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [onRoadPriceSummary, setOnRoadPriceSummary] = useState({});
  const [chargesSummary, setChargesSummary] = useState({});
  const [invoiceSummary, setInvoiceSummary] = useState({}); // Initialize with default value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // State for editable fields
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [updatedOnRoadPrice, setUpdatedOnRoadPrice] = useState({
    ex_showroom_price: 0,
    accessories: 0,
    discount: 0,
    gst_rate: 0,
    cess_rate: 0,
    subtotal: 0,
    gst_amount: 0,
    cess_amount: 0,
    total_on_road_price: 0,
  });
  const [updatedCharges, setUpdatedCharges] = useState({
    coating: 0,
    fast_tag: 0,
    rto: 0,
    insurance: 0,
    extended_warranty: 0,
    auto_card: 0,
    total_charges: 0,
  });

  const [updatedInvoice, setUpdatedInvoice] = useState({
    grand_total: 0,
  });

  // Fetch customer data
  const fetchCustomerData = async () => {
    if (!customerId) {
      setError("Customer ID is undefined.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/PaymentHistory/${customerId}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching customer data: ${response.status}`);
      }
      const data = await response.json();

      // Set data from the API response
      setCustomerData(data.customer);
      setOnRoadPriceSummary(data.onRoadPriceDetails);
      setChargesSummary(data.additionalCharges);
      setInvoiceSummary(data.invoicesummary); // Ensure invoiceSummary is initialized

      // Initialize updated values with default values
      setUpdatedOnRoadPrice({
        ex_showroom_price: parseFloat(data.onRoadPriceDetails?.ex_showroom_price) || 0,
        accessories: parseFloat(data.onRoadPriceDetails?.accessories) || 0,
        discount: parseFloat(data.onRoadPriceDetails?.discount) || 0,
        gst_rate: parseFloat(data.onRoadPriceDetails?.gst_rate) || 0,
        cess_rate: parseFloat(data.onRoadPriceDetails?.cess_rate) || 0,
        subtotal: 0,
        gst_amount: 0,
        cess_amount: 0,
        total_on_road_price: 0,
      });
      setUpdatedCharges({
        coating: parseFloat(data.additionalCharges?.coating) || 0,
        fast_tag: parseFloat(data.additionalCharges?.fast_tag) || 0,
        rto: parseFloat(data.additionalCharges?.rto) || 0,
        insurance: parseFloat(data.additionalCharges?.insurance) || 0,
        extended_warranty: parseFloat(data.additionalCharges?.extended_warranty) || 0,
        auto_card: parseFloat(data.additionalCharges?.auto_card) || 0,
        total_charges: 0,
      });

      // Set grand total from invoiceSummary
      setUpdatedInvoice({
        grand_total: parseFloat(data.invoicesummary?.grand_total) || 0,
        customer_account_balance: parseFloat(data.invoicesummary?.customer_account_balance
        ) || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  // Handle edit start
  const handleEditStart = (section, field, value) => {
    setEditingField(`${section}.${field}`);
    setTempValue(value);
  };

  // Handle edit save
  const handleEditSave = (section, field) => {
    if (section === "onRoad") {
      setUpdatedOnRoadPrice((prev) => ({
        ...prev,
        [field]: parseFloat(tempValue) || 0,
      }));
    } else if (section === "charges") {
      setUpdatedCharges((prev) => ({
        ...prev,
        [field]: parseFloat(tempValue) || 0,
      }));
    }
    setEditingField(null);
    setTempValue("");
  };

  // Update invoice details
  const updateInvoiceDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-invoice/customer/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exShowroomPrice: updatedOnRoadPrice.ex_showroom_price,
            accessories: updatedOnRoadPrice.accessories,
            discount: updatedOnRoadPrice.discount,
            gstRate: updatedOnRoadPrice.gst_rate,
            cessRate: updatedOnRoadPrice.cess_rate,
            coating: updatedCharges.coating,
            fastTag: updatedCharges.fast_tag,
            rto: updatedCharges.rto,
            insurance: updatedCharges.insurance,
            extendedWarranty: updatedCharges.extended_warranty,
            autoCard: updatedCharges.auto_card,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating invoice: ${response.status}`);
      }

      const data = await response.json();
      setSnackbarMessage("Invoice updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to update invoice: " + err.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculate derived values
  const calculateDerivedValues = (onRoadPrice) => {
    const exShowroomPrice = parseFloat(onRoadPrice?.ex_showroom_price) || 0;
    const accessories = parseFloat(onRoadPrice?.accessories) || 0;
    const discount = parseFloat(onRoadPrice?.discount) || 0;
    const gstRate = parseFloat(onRoadPrice?.gst_rate) || 0;
    const cessRate = parseFloat(onRoadPrice?.cess_rate) || 0;

    const subtotal = exShowroomPrice + accessories - discount;
    const gst_amount = subtotal * (gstRate / 100);
    const cess_amount = subtotal * (cessRate / 100);
    const total_on_road_price = subtotal + gst_amount + cess_amount;

    return { subtotal, gst_amount, cess_amount, total_on_road_price };
  };

  const { subtotal, gst_amount, cess_amount, total_on_road_price } =
    calculateDerivedValues(updatedOnRoadPrice);

  const total_charges =
    (updatedCharges.coating || 0) +
    (updatedCharges.fast_tag || 0) +
    (updatedCharges.rto || 0) +
    (updatedCharges.insurance || 0) +
    (updatedCharges.extended_warranty || 0) +
    (updatedCharges.auto_card || 0);

  // Use grand_total from invoiceSummary
  const grand_total = invoiceSummary ? parseFloat(invoiceSummary.grand_total) || 0 : 0;

  // Editable TableCell component
  const EditableTableCell = ({ section, field, value }) => (
    <TableCell align="right">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "flex-end",
        }}
      >
        {editingField === `${section}.${field}` ? (
          <TextField
            type="number"
            variant="standard"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleEditSave(section, field)}
            autoFocus
            inputProps={{ style: { textAlign: "right", width: "100px" } }}
          />
        ) : (
          <>
            <IconButton
              size="small"
              onClick={() => handleEditStart(section, field, value)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            {formatCurrency(value)}
          </>
        )}
      </div>
    </TableCell>
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className="payment-history" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Payment History for {customerData?.firstName} {customerData?.lastName}
      </Typography>

      <Grid container spacing={3}>
        {/* On-Road Price Details Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              On-Road Price Details
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Amount (₹)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Ex-showroom Price</TableCell>
                    <EditableTableCell
                      section="onRoad"
                      field="ex_showroom_price"
                      value={updatedOnRoadPrice.ex_showroom_price || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>Accessories</TableCell>
                    <EditableTableCell
                      section="onRoad"
                      field="accessories"
                      value={updatedOnRoadPrice.accessories || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>Discount</TableCell>
                    <EditableTableCell
                      section="onRoad"
                      field="discount"
                      value={updatedOnRoadPrice.discount || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell align="right">{formatCurrency(subtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      GST ({updatedOnRoadPrice.gst_rate || 0}%)
                    </TableCell>
                    <TableCell align="right">{formatCurrency(gst_amount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Cess ({updatedOnRoadPrice.cess_rate || 0}%)
                    </TableCell>
                    <TableCell align="right">{formatCurrency(cess_amount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Total On-Road Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(total_on_road_price)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Additional Charges Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
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
                    <EditableTableCell
                      section="charges"
                      field="coating"
                      value={updatedCharges.coating || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>FastTag</TableCell>
                    <EditableTableCell
                      section="charges"
                      field="fast_tag"
                      value={updatedCharges.fast_tag || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>RTO</TableCell>
                    <EditableTableCell
                      section="charges"
                      field="rto"
                      value={updatedCharges.rto || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>Insurance</TableCell>
                    <EditableTableCell
                      section="charges"
                      field="insurance"
                      value={updatedCharges.insurance || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>Extended Warranty</TableCell>
                    <EditableTableCell
                      section="charges"
                      field="extended_warranty"
                      value={updatedCharges.extended_warranty || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>Auto Card</TableCell>
                    <EditableTableCell
                      section="charges"
                      field="auto_card"
                      value={updatedCharges.auto_card || 0}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Total Charges</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(total_charges)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Grand Total Section */}
      <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Grand Total
        </Typography>
        <Typography align="right" sx={{ fontWeight: "bold" }}>
          {formatCurrency(updatedInvoice.grand_total)}
        </Typography>

        <Typography variant="h6" gutterBottom>
        customer_account_balance
        </Typography>
        <Typography align="right" sx={{ fontWeight: "bold" }}>
          {formatCurrency(updatedInvoice.customer_account_balance)}
        </Typography>
      </Paper>

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={updateInvoiceDetails}
        sx={{ mt: 3 }}
      >
        Save Changes
      </Button>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PaymentHistory;