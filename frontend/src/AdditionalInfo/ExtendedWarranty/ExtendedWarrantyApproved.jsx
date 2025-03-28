"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import {
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Collapse,
  IconButton,
  Chip,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material"

// Icons
import SearchIcon from "@mui/icons-material/Search"
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

const ExtendedWarrantyApproved = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))

  // State variables
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedWarranty, setSelectedWarranty] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [ex_Reason, setEx_Reason] = useState("")

  // Expandable row states
  const [expandedRows, setExpandedRows] = useState({})

  // Fetch extended warranty data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showExtendedWarranty")

        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data)
        } else {
          throw new Error("Invalid data format: Expected an array.")
        }
      } catch (err) {
        setError("Failed to fetch extended warranty customer data.")
        console.error("Error fetching customers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Filter customers based on search query and pending status
  const getFilteredCustomers = () => {
    return customers.filter(
      (customer) =>
        (customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        customer.extendedWarrantyRequests?.length > 0 &&
        customer.extendedWarrantyRequests[0]?.status === "Approval",
    )
  }

  const filteredCustomers = getFilteredCustomers()

  // Handle documents icon click
  const handleDocumentsClick = (customer, warranty) => {
    setSelectedCustomer(customer)
    setSelectedWarranty(warranty)
    setShowDocumentsModal(true)
  }

 

  // Handle reject action
  const handleReject = async () => {
    if (!isConfirmed) {
      setError("Please confirm the extended warranty rejection.")
      return
    }

    if (!ex_Reason) {
      setError("Please provide a reason for rejection.")
      return
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/extendedWarrantyRejection/update-status/${selectedCustomer.customerId}`,
        {
          status: "Rejected",
          ex_Reason,
        },
      )

      if (response.status === 200) {
        alert("Extended warranty rejected successfully!")
        handleCloseModal()
        // Refresh the data
        const newData = await axios.get("http://localhost:5000/api/showExtendedWarranty")
        setCustomers(newData.data.data)
      }
    } catch (err) {
      setError(`Failed to reject extended warranty: ${err.response?.data?.error || err.message}`)
      console.error("Error:", err)
    }
  }

  // Close modal and reset state
  const handleCloseModal = () => {
    setShowModal(false)
    setShowDocumentsModal(false)
    setIsConfirmed(false)
    setEx_Reason("")
    setError(null)
  }

  // Get full name from customer object
  const getFullName = (customer) => {
    return `${customer.firstName}${customer.middleName ? ` ${customer.middleName}` : ""} ${customer.lastName}`
  }

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows({
      ...expandedRows,
      [id]: !expandedRows[id],
    })
  }

  // Get status chip color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Approval":
        return "success"
      case "Rejected":
        return "error"
      default:
        return "warning"
    }
  }

  // Mobile view - Card based layout
  const renderMobileView = () => {
    return (
      <Box sx={{ mt: 2 }}>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer, index) => {
            const warranty = customer.extendedWarrantyRequests[0]
            return (
              <Card key={index} sx={{ mb: 2, borderRadius: 2 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="subtitle1">ID: {customer.customerId}</Typography>
                      <Chip label={warranty.status} color={getStatusColor(warranty.status)} size="small" />
                    </Box>
                  }
                  action={
                    <IconButton
                      onClick={() => toggleRowExpand(customer.customerId)}
                      aria-expanded={expandedRows[customer.customerId]}
                      aria-label="show more"
                    >
                      {expandedRows[customer.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {getFullName(customer)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customer.email}
                  </Typography>

                  <Collapse in={expandedRows[customer.customerId]} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Car Details:</strong> {customer.carBooking?.model || "N/A"} |{" "}
                        {customer.carBooking?.version || "N/A"} | {customer.carBooking?.color || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Extended Warranty Amount:</strong> {warranty.extendedwarranty_amount || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Created At:</strong> {new Date(warranty.createdAt).toLocaleString()}
                      </Typography>
                      {warranty.ex_Reason && (
                        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                          <strong>Rejection Reason:</strong> {warranty.ex_Reason}
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                  <Button size="small" onClick={() => handleDocumentsClick(customer, warranty)}>
                    Warranty Details
                  </Button>
                   
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setSelectedWarranty(warranty)
                      setShowModal(true)
                    }}
                  >
                    Reject
                  </Button>
                </CardActions>
              </Card>
            )
          })
        ) : (
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography color="text.secondary">No pending extended warranties found.</Typography>
          </Card>
        )}
      </Box>
    )
  }

  // Tablet view - Simplified table
  const renderTabletView = () => {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => {
                const warranty = customer.extendedWarrantyRequests[0]
                return (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpand(customer.customerId)}
                          aria-expanded={expandedRows[customer.customerId]}
                          aria-label="expand row"
                        >
                          {expandedRows[customer.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {customer.customerId}
                      </TableCell>
                      <TableCell>{getFullName(customer)}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Chip label={warranty.status} color={getStatusColor(warranty.status)} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => handleDocumentsClick(customer, warranty)} sx={{ mr: 1 }}>
                          Details
                        </Button>
                         
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setSelectedWarranty(warranty)
                            setShowModal(true)
                          }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedRows[customer.customerId]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1, py: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="body2">
                                  <strong>Car Details:</strong> {customer.carBooking?.model || "N/A"} |{" "}
                                  {customer.carBooking?.version || "N/A"} | {customer.carBooking?.color || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Extended Warranty Amount:</strong> {warranty.extendedwarranty_amount || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Created At:</strong> {new Date(warranty.createdAt).toLocaleString()}
                                </Typography>
                              </Grid>
                              {warranty.ex_Reason && (
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="error">
                                    <strong>Rejection Reason:</strong> {warranty.ex_Reason}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No pending extended warranties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  // Desktop view - Full table
  const renderDesktopView = () => {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Car Details</TableCell>
              <TableCell>Extended Warranty Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => {
                const warranty = customer.extendedWarrantyRequests[0]
                return (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpand(customer.customerId)}
                          aria-expanded={expandedRows[customer.customerId]}
                          aria-label="expand row"
                        >
                          {expandedRows[customer.customerId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {customer.customerId}
                      </TableCell>
                      <TableCell>{getFullName(customer)}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        {customer.carBooking?.model || "N/A"} | {customer.carBooking?.version || "N/A"} |{" "}
                        {customer.carBooking?.color || "N/A"}
                      </TableCell>
                      <TableCell>{warranty.extendedwarranty_amount || "N/A"}</TableCell>
                      <TableCell>
                        <Chip label={warranty.status} color={getStatusColor(warranty.status)} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => handleDocumentsClick(customer, warranty)} sx={{ mr: 1 }}>
                          Details
                        </Button>
                   
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setSelectedWarranty(warranty)
                            setShowModal(true)
                          }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={expandedRows[customer.customerId]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1, py: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Extended Warranty Details
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2" gutterBottom>
                                  <strong>Warranty Information:</strong>
                                </Typography>
                                <Typography variant="body2">
                                  Created At: {new Date(warranty.createdAt).toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                  Updated At: {new Date(warranty.updatedAt).toLocaleString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                {warranty.ex_Reason && (
                                  <Typography variant="body2" color="error">
                                    <strong>Rejection Reason:</strong> {warranty.ex_Reason}
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No pending extended warranties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ color: "#071947" }}>
        Extended Warranty Management
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          label="Search Customers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%", maxWidth: "400px" }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error && !showModal && !showDocumentsModal ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {isMobile && renderMobileView()}
          {isTablet && renderTabletView()}
          {isDesktop && renderDesktopView()}
        </>
      )}

      {/* Documents Modal */}
      <Dialog open={showDocumentsModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Extended Warranty Details</DialogTitle>
        <DialogContent dividers>
          {selectedWarranty && (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Customer ID:</strong> {selectedCustomer.customerId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Full Name:</strong> {getFullName(selectedCustomer)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Extended Warranty Amount:</strong> {selectedWarranty.extendedwarranty_amount}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Created At:</strong> {new Date(selectedWarranty.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Updated At:</strong> {new Date(selectedWarranty.updatedAt).toLocaleString()}
              </Typography>
              {selectedWarranty.ex_Reason && (
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  <strong>Extended Warranty Rejection Reason:</strong> {selectedWarranty.ex_Reason}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="contained" color="primary" size="small" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography>
            <strong>Reject Extended Warranty for:</strong> {selectedCustomer?.customerId || "N/A"}{" "}
            {selectedCustomer?.customerId && (
              <VerifiedRoundedIcon
                sx={{
                  color: "#092e6b",
                  fontSize: 15,
                  mt: -0.3,
                  mr: -0.4,
                }}
              />
            )}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedCustomer && (
              <>
                <strong>Full Name:</strong> {getFullName(selectedCustomer)}
              </>
            )}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Reason for extended warranty rejection (required)"
              multiline
              rows={3}
              value={ex_Reason}
              onChange={(e) => setEx_Reason(e.target.value)}
              fullWidth
              required
            />

            <FormControlLabel
              control={<Checkbox checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} />}
              label="I confirm the extended warranty rejection"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button variant="contained" color="error" disabled={!isConfirmed || !ex_Reason} onClick={handleReject}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ExtendedWarrantyApproved