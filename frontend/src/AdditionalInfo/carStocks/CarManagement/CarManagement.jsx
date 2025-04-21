"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Container, Row, Col, Card, Spinner, Modal, Form } from "react-bootstrap"
import {  Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import axios from "axios"
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
import {
   Refresh,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material"

  
// Constants
const STATUS_COLORS = {
  'Allocated': "primary",
  'Not Allocated': "warning",
  'approved': "success"
}

const STATUS_LABELS = {
  'Allocated': "Allocated",
  'Not Allocated': "Not Allocated",
  'approved': "Approved"
}

// Helper Components
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
)

const ErrorMessage = ({ error, onRetry }) => (
  <div className="text-center text-danger p-5">
    <h4>Error</h4>
    <p>{error}</p>
    <Button variant="contained" color="primary" onClick={onRetry}>
      <Refresh /> Retry
    </Button>
  </div>
)

const DashboardStats = ({ stats }) => (
  <Row className="justify-content-center">
    <Col md={3} sm={6} className="mb-3">
      <Card className="text-center h-100 border-0 shadow-sm">
        <Card.Body>
          <Typography variant="subtitle2" color="textSecondary">
            Total Customers
          </Typography>
          <Typography variant="h4" className="mt-2">
            {stats.total}
          </Typography>
        </Card.Body>
      </Card>
    </Col>
    <Col md={3} sm={6} className="mb-3">
      <Card className="text-center h-100 border-0 shadow-sm" style={{ backgroundColor: "#f0fdf4" }}>
        <Card.Body>
          <Typography variant="subtitle2" color="textSecondary">
            Allocated
          </Typography>
          <Typography variant="h4" className="mt-2" style={{ color: "#16a34a" }}>
            {stats.Allocated}
          </Typography>
        </Card.Body>
      </Card>
    </Col>
    <Col md={3} sm={6} className="mb-3">
      <Card className="text-center h-100 border-0 shadow-sm" style={{ backgroundColor: "#fffbeb" }}>
        <Card.Body>
          <Typography variant="subtitle2" color="textSecondary">
            Not Allocated
          </Typography>
          <Typography variant="h4" className="mt-2" style={{ color: "#d97706" }}>
            {stats['Not Allocated']}
          </Typography>
        </Card.Body>
      </Card>
    </Col>
  </Row>
)

const CustomerCard = ({ customer, onAllotmentChange }) => {
  const unpaidAmount = useMemo(
    () => Number.parseFloat(customer.grandTotal || 0) - Number.parseFloat(customer.invoiceInfo?.customer_account_balance || 0),
    [customer]
  )

  const allocationStatus = customer.stockInfo?.allotmentStatus || 'Not Allocated'

  return (
    <Col lg={4} md={6} className="mb-4">
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
            <Chip
              label={STATUS_LABELS[allocationStatus]}
              color={STATUS_COLORS[allocationStatus]}
              size="small"
            />
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
            <Typography variant="body2" className="mb-1">
              <strong>Car:</strong> {customer.carBooking?.model} | {customer.carBooking?.version}
            </Typography>
            {customer.stockInfo && (
              <>
                <Typography variant="body2" className="mb-1">
                  <strong>VIN:</strong> {customer.stockInfo.vin || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Chassis:</strong> {customer.stockInfo.chassisNumber || 'N/A'}
                </Typography>
              </>
            )}
          </div>

          <Divider className="my-3" />

          <div className="d-flex justify-content-between mb-2">
            <Typography variant="body2">
              <strong>Grand Total:</strong>
            </Typography>
            <Typography variant="body2">{formatCurrency(customer.grandTotal)}</Typography>
          </div>

          <div className="d-flex justify-content-between mb-2">
            <Typography variant="body2">
              <strong>Paid Amount:</strong>
            </Typography>
            <Typography variant="body2" style={{ color: "#16a34a" }}>
              {formatCurrency(customer.invoiceInfo?.customer_account_balance)}
            </Typography>
          </div>

          {unpaidAmount > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <Typography variant="body2">
                <strong>Unpaid Amount:</strong>
              </Typography>
              <Typography variant="body2" style={{ color: "#dc2626" }}>
                {formatCurrency(unpaidAmount)}
              </Typography>
            </div>
          )}

          <div className="d-flex justify-content-between mt-3">
         
            <Button
              variant="outlined"
              size="small"
              color={allocationStatus === 'Allocated' ? 'error' : 'success'}
              onClick={() => onAllotmentChange(customer)}
            >
              {allocationStatus === 'Allocated' ? 'Deallocate' : 'Allocate'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

const CustomerTable = ({ customers, sortConfig, onSort, onViewDetails, onAllotmentChange }) => {
  const SortableHeader = ({ label, sortKey }) => (
    <TableCell
      onClick={() => onSort(sortKey)}
      style={{ cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
    >
      {label}
      {sortConfig.key === sortKey &&
        (sortConfig.direction === "ascending" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
    </TableCell>
  )

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <SortableHeader label="Customer ID" sortKey="customerId" />
            <SortableHeader label="Full Name" sortKey="fullName" />
            <TableCell style={{ fontSize: "12px", fontWeight: "bold" }}>Contact</TableCell>
            <TableCell style={{ fontSize: "12px", fontWeight: "bold" }}>Car Details</TableCell>
            <SortableHeader label="Grand Total" sortKey="grandTotal" />
            <SortableHeader label="Paid Amount" sortKey="customer_account_balance" />
            <SortableHeader label="Unpaid Amount" sortKey="unpaidAmount" />
            <SortableHeader label="Status" sortKey="status" />
            <TableCell style={{ fontSize: "12px", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <CustomerTableRow
              key={customer.customerId}
              customer={customer}
              onViewDetails={onViewDetails}
              onAllotmentChange={onAllotmentChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const CustomerTableRow = ({ customer, onAllotmentChange }) => {
  const unpaidAmount = useMemo(
    () => Number.parseFloat(customer.grandTotal || 0) - Number.parseFloat(customer.invoiceInfo?.customer_account_balance || 0),
    [customer]
  )
  
  const allocationStatus = customer.stockInfo?.allotmentStatus || 'Not Allocated'

  return (
    <TableRow hover>
      <TableCell style={{ fontSize: "11px" }}>{customer.customerId}</TableCell>
      <TableCell style={{ fontSize: "11px" }}>
        {`${customer.firstName || ""} ${customer.middleName || ""} ${customer.lastName || ""}`.trim()}
      </TableCell>
      <TableCell style={{ fontSize: "11px" }}>
        <div>{customer.mobileNumber1}</div>
        <div style={{ color: "#6b7280", fontSize: "10px" }}>{customer.email}</div>
      </TableCell>
      <TableCell style={{ fontSize: "11px" }}>
        {customer.carBooking?.model} | {customer.carBooking?.version}
        {customer.stockInfo && (
          <div style={{ fontSize: "10px", color: "#6b7280" }}>
            VIN: {customer.stockInfo.vin || 'N/A'}
          </div>
        )}
      </TableCell>
      <TableCell style={{ fontSize: "11px" }}>{formatCurrency(customer.grandTotal)}</TableCell>
      <TableCell style={{ fontSize: "11px", color: "#16a34a" }}>
        {formatCurrency(customer.invoiceInfo?.customer_account_balance)}
      </TableCell>
      <TableCell style={{ fontSize: "11px", color: "#dc2626" }}>
        {formatCurrency(unpaidAmount)}
      </TableCell>
      <TableCell>
        <Chip
          label={STATUS_LABELS[allocationStatus]}
          size="small"
          color={STATUS_COLORS[allocationStatus]}
        />
      </TableCell>
      <TableCell>
       
        <Button
          size="small"
          variant="outlined"
          color={allocationStatus !== 'Allocated' ? 'error' : 'success'}
          onClick={() => onAllotmentChange(customer)}
          style={{ marginLeft: '8px' }}
        >
          {allocationStatus !== 'Allocated' ? 'Deallocate' : 'Allocate'}
        </Button>
      </TableCell>
    </TableRow>
  )
}

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

const CarManagement = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({
    key: "firstName",
    direction: "ascending",
  })
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    'Allocated': 0,
    'Not Allocated': 0,
  })
  const [viewMode, setViewMode] = useState("card")
  const [showModal, setShowModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/Customers/Request");
      const rawData = response.data?.data || [];
  
      // Filter customers based on allocation status
      const data = rawData.filter((customer) => {
        const status = customer.stockInfo?.allotmentStatus;
        return status === "Allocated" || status === "Not Allocated";
      });
  
      setCustomers(data);
  
      const stats = data.reduce((acc, customer) => {
        acc.total++;
        const status = customer.stockInfo?.allotmentStatus || 'Not Allocated';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, { total: 0, 'Allocated': 0, 'Not Allocated': 0 });
  
      setPaymentStats(stats);
    } catch (err) {
      setError("Failed to load customer data");
      console.error("Error fetching customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const filteredCustomers = useMemo(() => {
    const customerList = Array.isArray(customers) ? customers : []
    let result = customerList

    if (activeTab === 1) {
      result = result.filter(c => 
        (c.stockInfo?.allotmentStatus || 'Not Allocated') === 'Allocated'
      )
    } else if (activeTab === 2) {
      result = result.filter(c => 
        (c.stockInfo?.allotmentStatus || 'Not Allocated') === 'Not Allocated'
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(customer => 
        customer.customerId?.toLowerCase().includes(query) ||
        `${customer.firstName} ${customer.middleName} ${customer.lastName}`.toLowerCase().includes(query) ||
        customer.mobileNumber1?.toLowerCase().includes(query) ||
        customer.mobileNumber2?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query)
      )
    }

    return [...result].sort((a, b) => {
      let aValue, bValue

      if (sortConfig.key === "fullName") {
        aValue = `${a.firstName || ""} ${a.middleName || ""} ${a.lastName || ""}`.trim()
        bValue = `${b.firstName || ""} ${b.middleName || ""} ${b.lastName || ""}`.trim()
      } else if (sortConfig.key === "unpaidAmount") {
        aValue = Number.parseFloat(a.grandTotal || 0) - Number.parseFloat(a.invoiceInfo?.customer_account_balance || 0)
        bValue = Number.parseFloat(b.grandTotal || 0) - Number.parseFloat(b.invoiceInfo?.customer_account_balance || 0)
      } else {
        aValue = a[sortConfig.key]
        bValue = b[sortConfig.key]
      }

      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1
      return 0
    })
  }, [customers, activeTab, searchQuery, sortConfig])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "ascending" ? "descending" : "ascending"
    }))
  }

  const handleAllotmentClick = (customer) => {
    setSelectedCustomer(customer)
    setShowModal(true)
  }

  const handleAllotment = async () => {
    if (!selectedCustomer) return
    
    try {
      setIsUpdating(true)
      
      // Validate VIN exists
      if (!selectedCustomer.stockInfo?.vin) {
        throw new Error('Vehicle VIN not found')
      }
  
      const newStatus = selectedCustomer.stockInfo?.allotmentStatus === 'Allocated' 
        ? 'Not Allocated' 
        : 'Allocated'
      
      // Use the correct field name (allotmentCarStatus) expected by backend
      const response = await axios.put(
        `http://localhost:5000/api/car/customer/${selectedCustomer.stockInfo.vin}`, 
        {
          customerId: selectedCustomer.customerId,
          allotmentCarStatus: newStatus,  // Correct field name
          cancellationReason: newStatus === 'Not Allocated' ? cancellationReason : null,
        }
      )
  
      if (!response.data.success) {
        throw new Error(response.data.message || 'Update failed')
      }
  
      // Update local state with correct field name
      setCustomers(prev => prev.map(c => 
        c.customerId === selectedCustomer.customerId
          ? {
              ...c,
              stockInfo: {
                ...c.stockInfo,
                allotmentCarStatus: newStatus  // Correct field name
              }
            }
          : c
      ))
  
      // Update stats
      setPaymentStats(prev => ({
        ...prev,
        'Allocated': newStatus === 'Allocated' ? prev.Allocated + 1 : prev.Allocated - 1,
        'Not Allocated': newStatus === 'Not Allocated' ? prev['Not Allocated'] + 1 : prev['Not Allocated'] - 1
      }))
  
      setShowModal(false)
      setCancellationReason('')
      setIsConfirmed(false)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to update allocation status')
      console.error('Allotment error:', error)
    } finally {
      setIsUpdating(false)
    }
  }

    // Handle back button click
    const handleBackClick = () => {
      navigate(-1); // Go back to previous page
    };

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={fetchCustomers} />

  return (
    <Container fluid style={{marginTop:'-60px'}} >
      
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBackClick}
              sx={{ mb: 2 }}
              variant="text"
            >
              Back
            </Button>
  
      <Row className="mb-4">
        <Col>
          <Paper elevation={0} className="p-4 bg-white rounded">
            <Typography variant="h5" className="mb-3" style={{ color: "#071947" }}>
              Car Allocation Dashboard
            </Typography>
             <DashboardStats stats={paymentStats} />
          </Paper>
        </Col>
      </Row>
      

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
                  <Tab label="Allocated" />
                  <Tab label="Not Allocated" />
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
      
      <Row>
        <Col>
          {filteredCustomers.length > 0 ? (
            viewMode === "card" ? (
              <Row>
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.customerId}
                    customer={customer}
                     onAllotmentChange={handleAllotmentClick}
                  />
                ))}
              </Row>
            ) : (
              <CustomerTable
                customers={filteredCustomers}
                sortConfig={sortConfig}
                onSort={handleSort}
                 onAllotmentChange={handleAllotmentClick}
              />
            )
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
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Paper elevation={1} className="p-3">
            <div className="d-flex justify-content-between align-items-center">
              <Typography variant="body2">
                Showing {filteredCustomers.length} of {customers.length} customers
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={fetchCustomers}
              >
                Refresh
              </Button>
            </div>
          </Paper>
        </Col>
      </Row>

      {/* Allocation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCustomer?.stockInfo?.allotmentStatus === 'Allocated' 
              ? 'Deallocate Vehicle' 
              : 'Allocate Vehicle'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <>
              <Typography variant="body1" className="mb-3">
                Customer: {selectedCustomer.customerId} - {selectedCustomer.firstName} {selectedCustomer.lastName}
              </Typography>
              <Typography variant="body1" className="mb-3">
                Current Status: <Chip 
                  label={STATUS_LABELS[selectedCustomer.stockInfo?.allotmentStatus || 'Not Allocated']} 
                  color={STATUS_COLORS[selectedCustomer.stockInfo?.allotmentStatus || 'Not Allocated']} 
                  size="small" 
                />
              </Typography>
              <Typography variant="body1" className="mb-3">
                Vehicle: {selectedCustomer.carBooking?.model} {selectedCustomer.carBooking?.version}
                {selectedCustomer.stockInfo?.vin && (
                  <span> (VIN: {selectedCustomer.stockInfo.vin})</span>
                )}
              </Typography>
              
              <Form.Group className="mb-3">
                <Form.Label>Reason (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Enter reason for allocation change..."
                />
              </Form.Group>
              
              <Form.Check
                type="checkbox"
                label="I confirm this allocation status change"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isUpdating}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAllotment}
            disabled={!isConfirmed || isUpdating}
          >
            {isUpdating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              selectedCustomer?.stockInfo?.allotmentStatus === 'Allocated' 
                ? 'Confirm Deallocation' 
                : 'Confirm Allocation'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default CarManagement