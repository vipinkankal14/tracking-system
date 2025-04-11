import {
    Paper,
    Typography,
    Grid,
    Box,
    Divider,
    Chip,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
  } from "@mui/material"
  import { Receipt } from "@mui/icons-material"
  
  const InvoiceInfo = ({ userData }) => {
    const { invoiceInfo = {} } = userData
  
    const hasInvoice = invoiceInfo && invoiceInfo.invoice_id
  
    const getPaymentStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "paid":
          return "success"
        case "pending":
          return "warning"
        case "overdue":
          return "error"
        default:
          return "default"
      }
    }
  
    return (
      <Paper elevation={1} className="info-section">
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Invoice Information
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Details about your vehicle invoice and payment
          </Typography>
  
          {hasInvoice ? (
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" className="section-subtitle">
                  Invoice #{invoiceInfo.invoice_id}
                </Typography>
                <Chip
                  label={invoiceInfo.payment_status || "Not Specified"}
                  color={getPaymentStatusColor(invoiceInfo.payment_status)}
                  size="small"
                />
              </Box>
              <Divider sx={{ my: 1.5 }} />
  
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Invoice Date
                  </Typography>
                  <Typography variant="body2">
                    {invoiceInfo.invoice_date ? new Date(invoiceInfo.invoice_date).toLocaleDateString() : "N/A"}
                  </Typography>
                </Grid>
  
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Due Date
                  </Typography>
                  <Typography variant="body2">
                    {invoiceInfo.due_date ? new Date(invoiceInfo.due_date).toLocaleDateString() : "N/A"}
                  </Typography>
                </Grid>
  
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Account Balance
                  </Typography>
                  <Typography variant="body2">
                    ₹{invoiceInfo.customer_account_balance?.toLocaleString() || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
  
              <Box mt={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Invoice Summary
                </Typography>
                <TableContainer className="invoice-table">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>On-Road Price</TableCell>
                        <TableCell align="right">₹{invoiceInfo.total_on_road_price?.toLocaleString() || "0"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Additional Charges</TableCell>
                        <TableCell align="right">₹{invoiceInfo.total_charges?.toLocaleString() || "0"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Grand Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          ₹{invoiceInfo.grand_total?.toLocaleString() || "0"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }} icon={<Receipt />}>
              No invoice has been generated yet.
            </Alert>
          )}
        </Box>
      </Paper>
    )
  }
  
  export default InvoiceInfo
  