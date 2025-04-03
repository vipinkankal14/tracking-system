"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useMediaQuery,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  Container,
  Avatar,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import ImageUpload from "../../ImageUpload"
import UserManagementStats from "../../UserManagementStats"

 
// Mock data based on the schema
const mockUsers = [
  {
    id: 1,
    emp_id: "EMP001",
    username: "johndoe",
    email: "john.doe@example.com",
    role: "admin",
    is_active: true,
    current_salary: 75000.0,
    created_at: "2023-01-15T10:30:00",
    last_login: "2023-04-10T14:45:00",
    aadhar_number: "123456789012",
    pan_number: "ABCDE1234F",
    phone_number: "9876543210",
    street_address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400001",
    country: "India",
    employment_start_date: "2023-01-15",
    employment_end_date: null,
    work_start_time: "09:00:00",
    work_end_time: "18:00:00",
    profile_image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    emp_id: "EMP002",
    username: "janedoe",
    email: "jane.doe@example.com",
    role: "accessories_Management",
    is_active: true,
    current_salary: 65000.0,
    created_at: "2023-02-20T09:15:00",
    last_login: "2023-04-09T16:30:00",
    aadhar_number: "234567890123",
    pan_number: "BCDEF2345G",
    phone_number: "8765432109",
    street_address: "456 Park Avenue",
    city: "Delhi",
    state: "Delhi",
    postal_code: "110001",
    country: "India",
    employment_start_date: "2023-02-20",
    employment_end_date: null,
    work_start_time: "09:00:00",
    work_end_time: "18:00:00",
    profile_image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    emp_id: "EMP003",
    username: "rajkumar",
    email: "raj.kumar@example.com",
    role: "team_Leader",
    is_active: true,
    current_salary: 85000.0,
    created_at: "2022-11-10T08:45:00",
    last_login: "2023-04-10T10:15:00",
    aadhar_number: "345678901234",
    pan_number: "CDEFG3456H",
    phone_number: "7654321098",
    street_address: "789 Lake View",
    city: "Bangalore",
    state: "Karnataka",
    postal_code: "560001",
    country: "India",
    employment_start_date: "2022-11-10",
    employment_end_date: null,
    work_start_time: "09:00:00",
    work_end_time: "18:00:00",
    profile_image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
]

// Role options based on the schema
const roleOptions = [
  "admin",
  "accessories_Management",
  "coating_Management",
  "rto_Management",
  "fast_tag_Management",
  "insurance_Management",
  "auto_card_Management",
  "extended_warranty_Management",
  "Exchange_Management",
  "Finance_Management",
  "hr_Management",
  "team_Leader",
  "team_Member",
]


// Mobile view - Card component for each user
const UserCard = ({ user, onEdit, onDelete, onViewSalaryHistory }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card sx={{ mb: 2, position: "relative" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar src={user.profile_image} alt={user.username} sx={{ width: 50, height: 50, mr: 2 }} />
          <div>
            <Typography variant="h6" component="div">
              {user.username}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.emp_id} - {user.role}
            </Typography>
          </div>
        </Box>
        <Typography variant="body2">{user.email}</Typography>
        <Typography variant="body2">{user.phone_number}</Typography>

        <Chip
          label={user.is_active ? "Active" : "Inactive"}
          color={user.is_active ? "success" : "error"}
          size="small"
          sx={{ mt: 1 }}
        />

        <IconButton
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Salary:</Typography>
              <Typography variant="body2">₹{user.current_salary.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Started:</Typography>
              <Typography variant="body2">{new Date(user.employment_start_date).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Address:</Typography>
              <Typography variant="body2">
                {user.street_address}, {user.city}, {user.state} - {user.postal_code}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Aadhar:</Typography>
              <Typography variant="body2">{user.aadhar_number}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">PAN:</Typography>
              <Typography variant="body2">{user.pan_number}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Work Hours:</Typography>
              <Typography variant="body2">
                {user.work_start_time.substring(0, 5)} - {user.work_end_time.substring(0, 5)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Last Login:</Typography>
              <Typography variant="body2">{new Date(user.last_login).toLocaleDateString()}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>

      <CardActions>
        <Button size="small" onClick={() => onEdit(user)}>
          Edit
        </Button>
        <Button size="small" onClick={() => onViewSalaryHistory(user)}>
          Salary History
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(user)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}

// Tablet view - Row component with expandable details
const ExpandableTableRow = ({ user, onEdit, onDelete, onViewSalaryHistory }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Avatar src={user.profile_image} alt={user.username} sx={{ width: 40, height: 40 }} />
        </TableCell>
        <TableCell component="th" scope="row">
          {user.emp_id}
        </TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>
          <Chip
            label={user.is_active ? "Active" : "Inactive"}
            color={user.is_active ? "success" : "error"}
            size="small"
          />
        </TableCell>
        <TableCell>
          <IconButton size="small" color="primary" onClick={() => onEdit(user)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete(user)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Grid container spacing={2} sx={{ py: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Phone:</Typography>
                  <Typography variant="body2">{user.phone_number}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Salary:</Typography>
                  <Typography variant="body2">₹{user.current_salary.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Started:</Typography>
                  <Typography variant="body2">{new Date(user.employment_start_date).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Address:</Typography>
                  <Typography variant="body2">
                    {user.street_address}, {user.city}, {user.state} - {user.postal_code}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Aadhar:</Typography>
                  <Typography variant="body2">{user.aadhar_number}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">PAN:</Typography>
                  <Typography variant="body2">{user.pan_number}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" size="small" onClick={() => onViewSalaryHistory(user)} sx={{ mt: 1 }}>
                    View Salary History
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

// Main component
const UserManagement = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [openSalaryDialog, setOpenSalaryDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Form fields state
  const [formData, setFormData] = useState({
    emp_id: "",
    username: "",
    email: "",
    role: "team_Member",
    is_active: true,
    current_salary: 0,
    aadhar_number: "",
    pan_number: "",
    phone_number: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    employment_start_date: "",
    work_start_time: "09:00:00",
    work_end_time: "18:00:00",
    profile_image: "",
  })

  // Load users data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      try {
        setUsers(mockUsers)
        setLoading(false)
      } catch (err) {
        setError("Failed to load users data")
        setLoading(false)
      }
    }, 1000)
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Add this function to handle image upload
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({
          ...formData,
          profile_image: e.target.result,
        })
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  // Open dialog for adding new user
  const handleAddUser = () => {
    setCurrentUser(null)
    setFormData({
      emp_id: "",
      username: "",
      email: "",
      role: "team_Member",
      is_active: true,
      current_salary: 0,
      aadhar_number: "",
      pan_number: "",
      phone_number: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      employment_start_date: new Date().toISOString().split("T")[0],
      work_start_time: "09:00:00",
      work_end_time: "18:00:00",
      profile_image: "",
    })
    setOpenDialog(true)
  }

  // Open dialog for editing user
  const handleEditUser = (user) => {
    setCurrentUser(user)
    setFormData({
      emp_id: user.emp_id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      current_salary: user.current_salary,
      aadhar_number: user.aadhar_number,
      pan_number: user.pan_number,
      phone_number: user.phone_number,
      street_address: user.street_address,
      city: user.city,
      state: user.state,
      postal_code: user.postal_code,
      country: user.country,
      employment_start_date: user.employment_start_date,
      employment_end_date: user.employment_end_date || "",
      work_start_time: user.work_start_time,
      work_end_time: user.work_end_time,
      profile_image: user.profile_image || "",
    })
    setOpenDialog(true)
  }

  // Handle form submission
  const handleSubmit = () => {
    // Simulate API call to save data
    if (currentUser) {
      // Update existing user
      const updatedUsers = users.map((user) => (user.id === currentUser.id ? { ...user, ...formData } : user))
      setUsers(updatedUsers)
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        created_at: new Date().toISOString(),
        last_login: null,
      }
      setUsers([...users, newUser])
    }
    setOpenDialog(false)
  }

  // Handle user deletion
  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      const updatedUsers = users.filter((u) => u.id !== user.id)
      setUsers(updatedUsers)
    }
  }

  // Open salary history dialog
  const handleViewSalaryHistory = (user) => {
    setCurrentUser(user)
    setOpenSalaryDialog(true)
  }

  // Navigate to another page
  const handleNavigate = (path) => {
    navigate(path)
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emp_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Statistics Dashboard */}
        <UserManagementStats users={users} />

        {/* Search and Add User Controls */}
        <Box sx={{ mb: 3, justifyContent: 'space-between', display: 'flex' }}>
          
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
            }}
           />
         
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddUser}>
            Add User
          </Button>

        {/* Mobile View - Card Layout */}
        {isMobile && (
          <Box>
            {filteredUsers.length === 0 ? (
              <Alert severity="info">No users found</Alert>
            ) : (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onViewSalaryHistory={handleViewSalaryHistory}
                />
              ))
            )}
          </Box>
        )}

        {/* Tablet View - Simplified Table */}
        {isTablet && (
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Photo</TableCell>
                  <TableCell>Emp ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Alert severity="info">No users found</Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <ExpandableTableRow
                      key={user.id}
                      user={user}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                      onViewSalaryHistory={handleViewSalaryHistory}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Desktop View - Full Table */}
        {isDesktop && (
          <TableContainer component={Paper}>
            <Table aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>Emp ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Salary (₹)</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Alert severity="info">No users found</Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar src={user.profile_image} alt={user.username} sx={{ width: 40, height: 40, mr: 2 }} />
                          {user.emp_id}
                        </Box>
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>{user.current_salary.toLocaleString()}</TableCell>
                      <TableCell>{new Date(user.employment_start_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? "Active" : "Inactive"}
                          color={user.is_active ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleEditUser(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleViewSalaryHistory(user)}>
                          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                            ₹
                          </Typography>
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(user)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* User Form Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
                {/* Profile Image */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Profile Image
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <ImageUpload
                  value={formData.profile_image}
                  onChange={(image) => setFormData({ ...formData, profile_image: image })}
                  username={formData.username}
                />
              </Grid>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="emp_id"
                  label="Employee ID"
                  value={formData.emp_id}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="role"
                  label="Role"
                  select
                  value={formData.role}
                  onChange={handleInputChange}
                  fullWidth
                  required
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone_number"
                  label="Phone Number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="current_salary"
                  label="Current Salary (₹)"
                  type="number"
                  value={formData.current_salary}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              {/* KYC Information */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  KYC Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="aadhar_number"
                  label="Aadhar Number"
                  value={formData.aadhar_number}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="pan_number"
                  label="PAN Number"
                  value={formData.pan_number}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Address Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="street_address"
                  label="Street Address"
                  value={formData.street_address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="postal_code"
                  label="Postal Code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="country"
                  label="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Employment Details */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Employment Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="employment_start_date"
                  label="Start Date"
                  type="date"
                  value={formData.employment_start_date}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="employment_end_date"
                  label="End Date (if applicable)"
                  type="date"
                  value={formData.employment_end_date || ""}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="work_start_time"
                  label="Work Start Time"
                  type="time"
                  value={formData.work_start_time}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="work_end_time"
                  label="Work End Time"
                  type="time"
                  value={formData.work_end_time}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="is_active"
                  label="Status"
                  select
                  value={formData.is_active}
                  onChange={handleInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
              </Grid>

            
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {currentUser ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Salary History Dialog */}
        <Dialog open={openSalaryDialog} onClose={() => setOpenSalaryDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Salary History - {currentUser?.username}</DialogTitle>
          <DialogContent dividers>
            {/* Mock salary history data */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Old Salary (₹)</TableCell>
                    <TableCell>New Salary (₹)</TableCell>
                    <TableCell>Increment</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUser && (
                    <>
                      <TableRow>
                        <TableCell>2023-01-15</TableCell>
                        <TableCell>60000.00</TableCell>
                        <TableCell>65000.00</TableCell>
                        <TableCell>5000.00</TableCell>
                        <TableCell>8.33%</TableCell>
                        <TableCell>Annual increment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-07-01</TableCell>
                        <TableCell>65000.00</TableCell>
                        <TableCell>{currentUser.current_salary.toLocaleString()}</TableCell>
                        <TableCell>{(currentUser.current_salary - 65000).toLocaleString()}</TableCell>
                        <TableCell>{(((currentUser.current_salary - 65000) / 65000) * 100).toFixed(2)}%</TableCell>
                        <TableCell>Performance bonus</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add new salary entry form */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Add New Salary Entry
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Effective Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="New Salary (₹)" type="number" fullWidth InputProps={{ inputProps: { min: 0 } }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Notes" multiline rows={2} fullWidth />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSalaryDialog(false)}>Close</Button>
            <Button variant="contained" color="primary">
              Add Entry
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default UserManagement

