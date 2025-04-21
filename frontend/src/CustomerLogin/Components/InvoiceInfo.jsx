"use client"

import React from "react"

import { useState } from "react"
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
  TableHead,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from "@mui/material"
import { Receipt, ExpandMore, ExpandLess, Info } from "@mui/icons-material"


const InvoiceInfo = ({ userData }) => {
  const { invoiceInfo = {}, account_management = {} } = userData
  const [expandedSections, setExpandedSections] = useState({
    priceDetails: false,
    additionalCharges: false,
    refunds: false,
    transactions: false,
  })

  // Use Material-UI's useMediaQuery hook for responsive design
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))

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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Responsive table cell component
  const ResponsiveTableCell = ({ label, value, align = "left" }) => {
    if (isMobile) {
      return (
        <Box mb={1}>
          <Typography variant="caption" color="textSecondary" display="block">
            {label}
          </Typography>
          <Typography variant="body2" align={align}>
            {value}
          </Typography>
        </Box>
      )
    }
    return (
      <>
        <TableCell>{label}</TableCell>
        <TableCell align={align}>{value}</TableCell>
      </>
    )
  }

  // Responsive section header
  const SectionHeader = ({ title, sectionKey }) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: 1,
        backgroundColor: theme.palette.action.hover,
        p: isMobile ? 1 : 1.5,
        borderRadius: 1,
      }}
    >
      <Typography variant={isMobile ? "body1" : "subtitle2"} fontWeight="medium">
        {title}
      </Typography>
      <IconButton size={isMobile ? "small" : "medium"} onClick={() => toggleSection(sectionKey)}>
        {expandedSections[sectionKey] ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </Box>
  )

  return (
    <Paper
      elevation={1}
      className="info-section"
      sx={{
        overflow: "hidden",
        mx: isMobile ? 1 : "auto",
        maxWidth: isDesktop ? 1400 : "100%",
      }}
    >
      <Box p={isMobile ? 2 : 3}>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: "medium" }}>
          Invoice Information
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph sx={{ mb: isMobile ? 2 : 3 }}>
          Details about your vehicle invoice and payment
        </Typography>

        {hasInvoice ? (
          (
            <Box mt={isMobile ? 1 : 2}>
            <Box 
              display="flex" 
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between" 
              alignItems={isMobile ? "flex-start" : "center"}
              mb={1}
            >
              <Typography 
                variant={isMobile ? "subtitle2" : "subtitle1"} 
                className="section-subtitle"
                sx={{ mb: isMobile ? 1 : 0 }}
              >
                Invoice #{invoiceInfo.invoice_id}
              </Typography>
              <Chip
                label={invoiceInfo.payment_status || "Not Specified"}
                color={getPaymentStatusColor(invoiceInfo.payment_status)}
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            <Divider sx={{ my: isMobile ? 1 : 1.5 }} />

            {/* Basic Invoice Info - Responsive Grid */}
            <Grid container spacing={isMobile ? 2 : 3} mt={isMobile ? 0 : 1}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Invoice Date
                </Typography>
                <Typography variant="body2">
                  {invoiceInfo.invoice_date
                    ? new Date(invoiceInfo.invoice_date).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Due Date
                </Typography>
                <Typography variant="body2">
                  {invoiceInfo.due_date
                    ? new Date(invoiceInfo.due_date).toLocaleDateString()
                    : "N/A"}
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

            {/* On Road Price Details Section */}
            <Box mt={isMobile ? 3 : 4}>
              <SectionHeader 
                title="On Road Price Breakdown" 
                sectionKey="priceDetails" 
              />
              <Collapse in={expandedSections.priceDetails}>
                {isMobile ? (
                  // Mobile view - Cards instead of table
                  <Box>
                    {invoiceInfo.OnRoadPriceDetails?.map((detail, index) => (
                      <Card variant="outlined" sx={{ mb: 2 }} key={index}>
                        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                          <Grid container spacing={1}>
                            <Grid item xs={7}>
                              <Typography variant="body2">Ex-Showroom Price</Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography variant="body2" align="right">
                                ₹{detail.ex_showroom_price?.toLocaleString() || "0"}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={7}>
                              <Typography variant="body2">Accessories</Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography variant="body2" align="right">
                                ₹{detail.accessories?.toLocaleString() || "0"}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={7}>
                              <Typography variant="body2">Discount</Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography variant="body2" align="right">
                                -₹{detail.discount?.toLocaleString() || "0"}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={7}>
                              <Typography variant="body2">Subtotal</Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography variant="body2" align="right">
                                ₹{detail.subtotal?.toLocaleString() || "0"}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={7}>
                              <Typography variant="body2">GST ({detail.gst_rate}%)</Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography variant="body2" align="right">
                                ₹{detail.gst_amount?.toLocaleString() || "0"}
                              </Typography>
                            </Grid>
                            
                            {detail.cess_rate > 0 && (
                              <>
                                <Grid item xs={7}>
                                  <Typography variant="body2">CESS ({detail.cess_rate}%)</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography variant="body2" align="right">
                                    ₹{detail.cess_amount?.toLocaleString() || "0"}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            
                            <Grid item xs={7}>
                              <Typography variant="body2" fontWeight="bold">Total On Road Price</Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography variant="body2" fontWeight="bold" align="right">
                                ₹{detail.total_on_road_price?.toLocaleString() || "0"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  // Tablet and Desktop view - Table
                  <TableContainer className="invoice-table">
                    <Table size={isTablet ? "small" : "medium"}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Component</TableCell>
                          <TableCell align="right">Amount (₹)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoiceInfo.OnRoadPriceDetails?.map((detail, index) => (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>Ex-Showroom Price</TableCell>
                              <TableCell align="right">
                                {detail.ex_showroom_price?.toLocaleString() || "0"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Accessories</TableCell>
                              <TableCell align="right">
                                {detail.accessories?.toLocaleString() || "0"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Discount</TableCell>
                              <TableCell align="right">
                                -{detail.discount?.toLocaleString() || "0"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Subtotal</TableCell>
                              <TableCell align="right">
                                {detail.subtotal?.toLocaleString() || "0"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>GST ({detail.gst_rate}%)</TableCell>
                              <TableCell align="right">
                                {detail.gst_amount?.toLocaleString() || "0"}
                              </TableCell>
                            </TableRow>
                            {detail.cess_rate > 0 && (
                              <TableRow>
                                <TableCell>CESS ({detail.cess_rate}%)</TableCell>
                                <TableCell align="right">
                                  {detail.cess_amount?.toLocaleString() || "0"}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow sx={{ "& td": { fontWeight: "bold" } }}>
                              <TableCell>Total On Road Price</TableCell>
                              <TableCell align="right">
                                {detail.total_on_road_price?.toLocaleString() || "0"}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Collapse>
            </Box>

            {/* Additional Charges Section */}
            <Box mt={isMobile ? 2 : 3}>
              <SectionHeader 
                title="Additional Charges" 
                sectionKey="additionalCharges" 
              />
              <Collapse in={expandedSections.additionalCharges}>
                {isMobile ? (
                  // Mobile view - Cards instead of table
                  <Box>
                    {invoiceInfo.AdditionalCharges?.map((charge, index) => (
                      <Card variant="outlined" sx={{ mb: 2 }} key={index}>
                        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                          <Grid container spacing={1}>
                            {charge.coating > 0 && (
                              <>
                                <Grid item xs={7}>
                                  <Typography variant="body2">Coating</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography variant="body2" align="right">
                                    ₹{charge.coating?.toLocaleString() || "0"}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            
                            {charge.fast_tag > 0 && (
                              <>
                                <Grid item xs={7}>
                                  <Typography variant="body2">Fast Tag</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography variant="body2" align="right">
                                    ₹{charge.fast_tag?.toLocaleString() || "0"}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            
                            {charge.rto > 0 && (
                              <>
                                <Grid item xs={7}>
                                  <Typography variant="body2">RTO</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography variant="body2" align="right">
                                    ₹{charge.rto?.toLocaleString() || "0"}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            
                            {charge.insurance > 0 && (
                              <>
                                <Grid item xs={7}>
                                  <Typography variant="body2">Insurance</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography variant="body2" align="right">
                                    ₹{charge.insurance?.toLocaleString() || "0"}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            
                            {charge.extended_warranty > 0 && (
                              <>
                                <Grid item xs={7}>
                                  <Typography variant="body2">Extended Warranty</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography variant="body2" align="right">
                                    ₹{charge.extended_warranty?.toLocaleString() || "0"}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            
                            {charge.auto_card > 0 && (
                              <>
                                <Grid item xs={7}>
                                  <Typography variant="body2">Auto Card</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                  <Typography variant="body2" align="right">
                                    ₹{charge.auto_card?.toLocaleString() || "0"}
                                  </Typography>
                                </Grid>
                              </>
                            )}
                            
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            
                            <Grid item xs={7}>
                              <Typography variant="body2" fontWeight="bold">Total Additional Charges</Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <Typography variant="body2" fontWeight="bold" align="right">
                                ₹{charge.total_charges?.toLocaleString() || "0"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  // Tablet and Desktop view - Table
                  <TableContainer className="invoice-table">
                    <Table size={isTablet ? "small" : "medium"}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Service</TableCell>
                          <TableCell align="right">Amount (₹)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoiceInfo.AdditionalCharges?.map((charge, index) => (
                          <React.Fragment key={index}>
                            {charge.coating > 0 && (
                              <TableRow>
                                <TableCell>Coating</TableCell>
                                <TableCell align="right">
                                  {charge.coating?.toLocaleString() || "0"}
                                </TableCell>
                              </TableRow>
                            )}
                            {charge.fast_tag > 0 && (
                              <TableRow>
                                <TableCell>Fast Tag</TableCell>
                                <TableCell align="right">
                                  {charge.fast_tag?.toLocaleString() || "0"}
                                </TableCell>
                              </TableRow>
                            )}
                            {charge.rto > 0 && (
                              <TableRow>
                                <TableCell>RTO</TableCell>
                                <TableCell align="right">
                                  {charge.rto?.toLocaleString() || "0"}
                                </TableCell>
                              </TableRow>
                            )}
                            {charge.insurance > 0 && (
                              <TableRow>
                                <TableCell>Insurance</TableCell>
                                <TableCell align="right">
                                  {charge.insurance?.toLocaleString() || "0"}
                                </TableCell>
                              </TableRow>
                            )}
                            {charge.extended_warranty > 0 && (
                              <TableRow>
                                <TableCell>Extended Warranty</TableCell>
                                <TableCell align="right">
                                  {charge.extended_warranty?.toLocaleString() || "0"}
                                </TableCell>
                              </TableRow>
                            )}
                            {charge.auto_card > 0 && (
                              <TableRow>
                                <TableCell>Auto Card</TableCell>
                                <TableCell align="right">
                                  {charge.auto_card?.toLocaleString() || "0"}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow sx={{ "& td": { fontWeight: "bold" } }}>
                              <TableCell>Total Additional Charges</TableCell>
                              <TableCell align="right">
                                {charge.total_charges?.toLocaleString() || "0"}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Collapse>
            </Box>

            {/* Invoice Summary */}
            <Box mt={isMobile ? 2 : 3}>
              <Typography 
                variant={isMobile ? "body1" : "subtitle2"} 
                gutterBottom
                sx={{ 
                  fontWeight: "medium",
                  backgroundColor: theme.palette.action.hover,
                  p: isMobile ? 1 : 1.5,
                  borderRadius: 1
                }}
              >
                Invoice Summary
              </Typography>
              {isMobile ? (
                <Card variant="outlined">
                  <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Grid container spacing={1}>
                      <Grid item xs={7}>
                        <Typography variant="body2">On-Road Price</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" align="right">
                          ₹{invoiceInfo.total_on_road_price?.toLocaleString() || "0"}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={7}>
                        <Typography variant="body2">Additional Charges</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" align="right">
                          ₹{invoiceInfo.total_charges?.toLocaleString() || "0"}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="bold">Grand Total</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" fontWeight="bold" align="right">
                          ₹{invoiceInfo.grand_total?.toLocaleString() || "0"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <TableContainer className="invoice-table">
                  <Table size={isTablet ? "small" : "medium"}>
                    <TableBody>
                      <TableRow>
                        <TableCell>On-Road Price</TableCell>
                        <TableCell align="right">
                          ₹{invoiceInfo.total_on_road_price?.toLocaleString() || "0"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Additional Charges</TableCell>
                        <TableCell align="right">
                          ₹{invoiceInfo.total_charges?.toLocaleString() || "0"}
                        </TableCell>
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
              )}
            </Box>

            {/* Payment Transactions */}
            <Box mt={isMobile ? 3 : 4}>
              <SectionHeader 
                title="Payment Transactions" 
                sectionKey="transactions" 
              />
              <Collapse in={expandedSections.transactions}>
                {invoiceInfo.CashierTransactions?.length > 0 ? (
                  isMobile ? (
                    // Mobile view - Cards
                    <Box>
                      {invoiceInfo.CashierTransactions.map((txn, index) => (
                        <Card variant="outlined" sx={{ mb: 2 }} key={index}>
                          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Grid container spacing={1}>
                              <Grid item xs={5}>
                                <Typography variant="caption" color="textSecondary">
                                  Date
                                </Typography>
                                <Typography variant="body2">
                                  {txn.paymentDate ? new Date(txn.paymentDate).toLocaleDateString() : 'N/A'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={7}>
                                <Typography variant="caption" color="textSecondary">
                                  Type
                                </Typography>
                                <Typography variant="body2">
                                  {txn.transactionType || 'N/A'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary">
                                  Payment Method
                                </Typography>
                                <Typography variant="body2">
                                  {txn.paymentType || 'N/A'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={6}>
                                <Typography variant="caption" color="textSecondary">
                                  Debit
                                </Typography>
                                <Typography variant="body2">
                                  ₹{txn.debitedAmount ? txn.debitedAmount.toLocaleString() : '0'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={6}>
                                <Typography variant="caption" color="textSecondary">
                                  Credit
                                </Typography>
                                <Typography variant="body2">
                                  ₹{txn.creditedAmount ? txn.creditedAmount.toLocaleString() : '0'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    // Tablet and Desktop view - Table
                    <TableContainer className="invoice-table">
                      <Table size={isTablet ? "small" : "medium"}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell align="right">Debit (₹)</TableCell>
                            <TableCell align="right">Credit (₹)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invoiceInfo.CashierTransactions.map((txn, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {txn.paymentDate
                                  ? new Date(txn.paymentDate).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{txn.transactionType || "N/A"}</TableCell>
                              <TableCell>{txn.paymentType || "N/A"}</TableCell>
                              <TableCell align="right">
                                {txn.debitedAmount
                                  ? txn.debitedAmount.toLocaleString()
                                  : "0"}
                              </TableCell>
                              <TableCell align="right">
                                {txn.creditedAmount
                                  ? txn.creditedAmount.toLocaleString()
                                  : "0"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )
                ) : (
                  <Alert 
                    severity="info" 
                    sx={{ mt: 1 }}
                    icon={<Info fontSize={isMobile ? "small" : "medium"} />}
                  >
                    No payment transactions found
                  </Alert>
                )}
              </Collapse>
            </Box>

            {/* Refund Information */}
            <Box mt={isMobile ? 3 : 4}>
              <SectionHeader 
                title="Refund Information" 
                sectionKey="refunds" 
              />
              <Collapse in={expandedSections.refunds}>
                {account_management.accountManagementRefund?.length > 0 ? (
                  isMobile ? (
                    // Mobile view - Cards
                    <Box>
                      {account_management.accountManagementRefund.map((refund, index) => (
                        <Card variant="outlined" sx={{ mb: 2 }} key={index}>
                          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                            <Box mb={1} display="flex" justifyContent="center">
                              <Chip 
                                label={refund.status} 
                                size="small" 
                                color={
                                  refund.status === 'Completed' ? 'success' : 
                                  refund.status === 'InProcess' ? 'warning' : 'error'
                                } 
                              />
                            </Box>
                            
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="textSecondary">
                                  Amount
                                </Typography>
                                <Typography variant="body2">
                                  ₹{refund.refundAmount?.toLocaleString() || '0'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={6}>
                                <Typography variant="caption" color="textSecondary">
                                  Initiated
                                </Typography>
                                <Typography variant="body2">
                                  {refund.createdAt ? new Date(refund.createdAt).toLocaleDateString() : 'N/A'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary">
                                  Reason
                                </Typography>
                                <Typography variant="body2" noWrap title={refund.refundReason}>
                                  {refund.refundReason || 'N/A'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary">
                                  Last Updated
                                </Typography>
                                <Typography variant="body2">
                                  {refund.updatedAt ? new Date(refund.updatedAt).toLocaleDateString() : 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    // Tablet and Desktop view - Table
                    <TableContainer className="invoice-table">
                      <Table size={isTablet ? "small" : "medium"}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Initiated</TableCell>
                            <TableCell>Last Updated</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {account_management.accountManagementRefund.map((refund, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Chip 
                                  label={refund.status} 
                                  size="small" 
                                  color={
                                    refund.status === 'Completed' ? 'success' : 
                                    refund.status === 'InProcess' ? 'warning' : 'error'
                                  } 
                                />
                              </TableCell>
                              <TableCell>₹{refund.refundAmount?.toLocaleString() || '0'}</TableCell>
                              <TableCell sx={{ maxWidth: 200 }}>
                                <Typography noWrap title={refund.refundReason}>
                                  {refund.refundReason || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {refund.createdAt ? new Date(refund.createdAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {refund.updatedAt ? new Date(refund.updatedAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )
                ) : (
                  <Alert
                    severity="info" 
                    sx={{ mt: 1 }}
                    icon={<Info fontSize={isMobile ? "small" : "medium"} />}
                  >
                    No refund requests found
                  </Alert>
                )}
              </Collapse>
            </Box>
          </Box>
          )
        ) : (
          <Alert severity="info" sx={{ mt: 2 }} icon={<Receipt fontSize={isMobile ? "small" : "medium"} />}>
            No invoice has been generated yet.
          </Alert>
        )}
      </Box>
    </Paper>
  )
}

export default InvoiceInfo
