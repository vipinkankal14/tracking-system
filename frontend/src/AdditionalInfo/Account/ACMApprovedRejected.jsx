"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material"
import { Search, Refresh, ArrowUpward, ArrowDownward } from "@mui/icons-material"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import AssessmentIcon from "@mui/icons-material/Assessment"

const PaymentDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({
    key: "firstName",
    direction: "ascending",
  })
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
  })
  const [viewMode, setViewMode] = useState("card") // 'card' or 'table'

  // Fetch customer data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/api/customers")
        setCustomers(response.data)

        const stats = response.data.reduce(
          (acc, customer) => {
            if (customer.status === "approved" || customer.status === "rejected") {
              acc.total++;
              
              if (customer.status === "approved") {
                acc.approved++;
              } else if (customer.status === "rejected") {
                acc.rejected++;
              }
            }
            return acc;
          },
          { total: 0, approved: 0, rejected: 0 }
        );

        setPaymentStats(stats)
        setLoading(false)
      } catch (err) {
        setError("Failed to load customer data")
        console.error("Error fetching customers:", err)
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Filter and sort customers when tab, search query, or sort config changes
  useEffect(() => {
    let result = [...customers]

    // First filter by approval status (include only approved or rejected)
    result = result.filter(customer => 
      customer.status === "approved" || customer.status === "rejected"
    );

    // Filter by payment status based on active tab
    if (activeTab === 1) {
      result = result.filter((customer) => customer.status === "approved")
    } else if (activeTab === 2) {
      result = result.filter((customer) => customer.status === "rejected")
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (customer) =>
          customer.customerId?.toLowerCase().includes(query) ||
          `${customer.firstName} ${customer.middleName} ${customer.lastName}`.toLowerCase().includes(query) ||
          customer.mobileNumber1?.toLowerCase().includes(query) ||
          customer.mobileNumber2?.toLowerCase().includes(query) ||
          customer.email?.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle nested properties or concatenated values
        let aValue, bValue

        if (sortConfig.key === "fullName") {
          aValue = `${a.firstName || ""} ${a.middleName || ""} ${a.lastName || ""}`.trim()
          bValue = `${b.firstName || ""} ${b.middleName || ""} ${b.lastName || ""}`.trim()
        } else if (sortConfig.key === "unpaidAmount") {
          aValue = Number.parseFloat(a.grand_total || 0) - Number.parseFloat(a.customer_account_balance || 0)
          bValue = Number.parseFloat(b.grand_total || 0) - Number.parseFloat(b.customer_account_balance || 0)
        } else {
          aValue = a[sortConfig.key]
          bValue = b[sortConfig.key]
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredCustomers(result)
  }, [customers, activeTab, searchQuery, sortConfig])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleViewCustomerDetails = (customerId) => {
    navigate(`/payment-history/${customerId}`)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(Number(amount) || 0)
  }

  // Calculate unpaid amount
  const calculateUnpaidAmount = (customer) => {
    const grandTotal = Number.parseFloat(customer.grand_total || 0)
    const paidAmount = Number.parseFloat(customer.customer_account_balance || 0)
    return grandTotal - paidAmount
  }

  // Render loading spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  // Render error message
  if (error) {
    return (
      <div className="text-center text-danger p-5">
        <h4>Error</h4>
        <p>{error}</p>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          <Refresh /> Retry
        </Button>
      </div>
    )
  }

  return (
    <Container fluid className="py-4">
      {/* Dashboard Header */}
      <Row className="mb-4">
        <Col>
          <Paper elevation={0} className="p-4 bg-white rounded">
            <Typography variant="h5" className="mb-3" style={{ color: "#071947" }}>
              Payment Dashboard
            </Typography>
            <Row className="justify-content-center">
              <Col md={3} sm={6} className="mb-3">
                <Card className="text-center h-100 border-0 shadow-sm">
                  <Card.Body>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Customers
                    </Typography>
                    <Typography variant="h4" className="mt-2">
                      {paymentStats.total}
                    </Typography>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <Card className="text-center h-100 border-0 shadow-sm" style={{ backgroundColor: "#f0fdf4" }}>
                  <Card.Body>
                    <Typography variant="subtitle2" color="textSecondary">
                      Approved
                    </Typography>
                    <Typography variant="h4" className="mt-2" style={{ color: "#16a34a" }}>
                      {paymentStats.approved}
                    </Typography>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6} className="mb-3">
                <Card className="text-center h-100 border-0 shadow-sm" style={{ backgroundColor: "#fef2f2" }}>
                  <Card.Body>
                    <Typography variant="subtitle2" color="textSecondary">
                      Rejected
                    </Typography>
                    <Typography variant="h4" className="mt-2" style={{ color: "#dc2626" }}>
                      {paymentStats.rejected}
                    </Typography>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>

      {/* Filters and Controls */}
      <Row className="mb-4">
        <Col>
          <Paper elevation={1} className="p-3">
            <Row className="align-items-center">
              <Col md={4} className="mb-3 mb-md-0">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search by ID, name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Col>
              <Col md={5} className="mb-3 mb-md-0">
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="All" />
                  <Tab label="Approved" />
                  <Tab label="Rejected" />
                </Tabs>
              </Col>
              <Col md={3} className="d-flex justify-content-end">
                <Button
                  variant={viewMode === "card" ? "contained" : "outlined"}
                  size="small"
                  className="me-2"
                  onClick={() => setViewMode("card")}
                >
                  Cards
                </Button>
                <Button
                  variant={viewMode === "table" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setViewMode("table")}
                >
                  Table
                </Button>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
      
      {/* Customer List */}
      <Row>
        <Col>
          {viewMode === "card" ? (
            <Row>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <Col lg={4} md={6} className="mb-4" key={customer.customerId}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <Typography variant="h6" className="mb-1">
                              {`${customer.firstName || ""} ${customer.middleName || ""} ${customer.lastName || ""}`.trim()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              ID: {customer.customerId}
                            </Typography>
                          </div>
                          <Badge bg={customer.status === "approved" ? "success" : "danger"} className="px-3 py-2">
                            {customer.status}
                          </Badge>
                        </div>

                        <Divider className="my-3" />

                        <div className="mb-3">
                          <Typography variant="body2" className="mb-1">
                            <strong>Phone:</strong> {customer.mobileNumber1}
                            {customer.mobileNumber2 && `, ${customer.mobileNumber2}`}
                          </Typography>
                          <Typography variant="body2" className="mb-1">
                            <strong>Email:</strong> {customer.email || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Car:</strong> {customer.model} | {customer.version} | {customer.color}
                          </Typography>
                        </div>

                        <Divider className="my-3" />

                        <div className="d-flex justify-content-between mb-2">
                          <Typography variant="body2">
                            <strong>Grand Total:</strong>
                          </Typography>
                          <Typography variant="body2">{formatCurrency(customer.grand_total)}</Typography>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <Typography variant="body2">
                            <strong>Paid Amount:</strong>
                          </Typography>
                          <Typography variant="body2" style={{ color: "#16a34a" }}>
                            {formatCurrency(customer.customer_account_balance)}
                          </Typography>
                        </div>

                        {calculateUnpaidAmount(customer) > 0 && (
                          <div className="d-flex justify-content-between mb-2">
                            <Typography variant="body2">
                              <strong>Unpaid Amount:</strong>
                            </Typography>
                            <Typography variant="body2" style={{ color: "#dc2626" }}>
                              {formatCurrency(calculateUnpaidAmount(customer))}
                            </Typography>
                          </div>
                        )}

                        <div className="d-flex justify-content-end mt-3">
                          <IconButton color="primary" onClick={() => handleViewCustomerDetails(customer.customerId)}>
                            {customer.status === "approved" ? (
                              <DoneAllIcon style={{ color: "#1b1994" }} />
                            ) : (
                              <PendingActionsOutlinedIcon style={{ color: "#e8e110" }} />
                            )}
                          </IconButton>
                          <IconButton color="secondary" onClick={() => handleViewCustomerDetails(customer.customerId)}>
                            <ManageAccountsIcon style={{ color: "#9c39e3" }} />
                          </IconButton>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col className="text-center py-5">
                  <Typography variant="h6" color="textSecondary">
                    No customers found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Try adjusting your search or filters
                  </Typography>
                </Col>
              )}
            </Row>
          ) : (
            <Paper elevation={1}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        onClick={() => handleSort("customerId")}
                        style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        Customer ID
                        {sortConfig.key === "customerId" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("fullName")}
                        style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        Full Name
                        {sortConfig.key === "fullName" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </TableCell>
                      <TableCell style={{ fontSize: "12px", fontWeight: "bold" }}>Contact</TableCell>
                      <TableCell style={{ fontSize: "12px", fontWeight: "bold" }}>Car Details</TableCell>
                      <TableCell
                        onClick={() => handleSort("grand_total")}
                        style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        Grand Total
                        {sortConfig.key === "grand_total" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("customer_account_balance")}
                        style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        Paid Amount
                        {sortConfig.key === "customer_account_balance" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("unpaidAmount")}
                        style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        Unpaid Amount
                        {sortConfig.key === "unpaidAmount" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("status")}
                        style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        Status
                        {sortConfig.key === "status" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </TableCell>
                      <TableCell style={{ fontSize: "12px", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.customerId} hover>
                          <TableCell style={{ fontSize: "11px" }}>{customer.customerId}</TableCell>
                          <TableCell style={{ fontSize: "11px" }}>
                            {`${customer.firstName || ""} ${customer.middleName || ""} ${customer.lastName || ""}`.trim()}
                          </TableCell>
                          <TableCell style={{ fontSize: "11px" }}>
                            <div>{customer.mobileNumber1}</div>
                            <div style={{ color: "#6b7280", fontSize: "10px" }}>{customer.email}</div>
                          </TableCell>
                          <TableCell style={{ fontSize: "11px" }}>
                            {customer.model} | {customer.version} | {customer.color}
                          </TableCell>
                          <TableCell style={{ fontSize: "11px" }}>{formatCurrency(customer.grand_total)}</TableCell>
                          <TableCell style={{ fontSize: "11px", color: "#16a34a" }}>
                            {formatCurrency(customer.customer_account_balance)}
                          </TableCell>
                          <TableCell style={{ fontSize: "11px", color: "#dc2626" }}>
                            {formatCurrency(calculateUnpaidAmount(customer))}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={customer.status}
                              size="small"
                              color={customer.status === "approved" ? "success" : "error"}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleViewCustomerDetails(customer.customerId)}>
                              <AssessmentIcon style={{ color: "#9c39e3", fontSize: "18px" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center" className="py-4">
                          <Typography variant="body1" color="textSecondary">
                            No customers found
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Try adjusting your search or filters
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Col>
      </Row>

      {/* Summary Footer */}
      <Row className="mt-4">
        <Col>
          <Paper elevation={1} className="p-3">
            <div className="d-flex justify-content-between align-items-center">
              <Typography variant="body2">
                Showing {filteredCustomers.length} of {customers.filter(c => 
                  c.status === "approved" || c.status === "rejected"
                ).length} customers...
              </Typography>
              <div>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </Paper>
        </Col>
      </Row>
    </Container>
  )
}

export default PaymentDashboard