import React, { useState, useEffect } from "react";
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
  Tooltip,
  Badge,
  Tabs,
  Tab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  PhotoCamera as PhotoCameraIcon,
  FilterList as FilterListIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import ProfileImageUpload from "./ProfileImageUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import ErrorIcon from "@mui/icons-material/Error";

// Mobile view - Card component for each user
const UserCard = ({ user, onEdit, onUpdateProfileImage }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ mb: 2, position: "relative" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user.profile_image}
              alt={user.username}
              sx={{ width: 50, height: 50, mr: 2 }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: -8,
                right: 4,
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                padding: "4px",
              }}
              onClick={() => onUpdateProfileImage(user)}
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="h6">
              {user.username}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.emp_id} - {user.role}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2">{user.email}</Typography>
        <Typography variant="body2">{user.phone_number}</Typography>

        {user.role !== "Sales Department" && (
          <Chip
            label={user.is_active ? "Active" : "Inactive"}
            color={user.is_active ? "success" : "error"}
            size="small"
            sx={{ mt: 1 }}
          />
        )}

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
              <Typography variant="body2">₹{user.current_salary}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Started:</Typography>
              <Typography variant="body2">
                {new Date(user.employment_start_date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Address:</Typography>
              <Typography variant="body2">
                {user.street_address}, {user.city}, {user.state} -{" "}
                {user.postal_code}
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
              <Typography variant="subtitle2">Last Login:</Typography>
              <Typography variant="body2">
                {user.last_login
                  ? new Date(user.last_login).toLocaleDateString()
                  : "Never"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>

      <CardActions>
        <Button size="small" onClick={() => onEdit(user)}>
          Edit
        </Button>

     
      </CardActions>
    </Card>
  );
};

// Role options based on the schema
const roleOptions = [
  "Accessories Management",
  "Account Management",
  "AutoCard Management",
  "Car Stocks Management",
  "Cashier Management",
  "Coating Management",
  "Exchange Management",
  "Extended Warranty Management",
  "FastTag Management",
  "Finance Management",
  "HR Management",
  "Insurance Management",
  "PDI (Pre-Delivery Inspection) Management",
  "RTO Management",
  "Sales Department",
  "Security Clearance Management"
].filter(role => role !== "Admin"); 

// Management categories for filtering
const managementCategories = [
  "Accessories Management",
  "Account Management",
  "AutoCard Management",
  "Car Stocks Management",
  "Cashier Management",
  "Coating Management",
  "Exchange Management",
  "Extended Warranty Management",
  "FastTag Management",
  "Finance Management",
  "HR Management",
  "Insurance Management",
  "PDI (Pre-Delivery Inspection) Management",
  "RTO Management",
  "Security Clearance Management"
].filter(role => role !== "Admin"); 

const teamRoleOptions = ["Team Leader", "Team Member"];

// Tablet view - Row component with expandable details
const ExpandableTableRow = ({
  user,
  onEdit,
  onUpdateProfileImage,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={user.profile_image}
              alt={user.username}
              sx={{ width: 40, height: 40 }}
            >
              {!user.profile_image && user.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Tooltip title="Update profile image">
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  padding: "3px",
                }}
                onClick={() => onUpdateProfileImage(user)}
              >
                <PhotoCameraIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>

        <TableCell component="th" scope="row">
          {user.emp_id}
        </TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.role}</TableCell>

        {user.role !== "Sales Department" && (
          <TableCell>
            <Chip
              label={user.is_active ? "Active" : "Inactive"}
              color={user.is_active ? "success" : "error"}
              size="small"
            />
          </TableCell>
        )}

        <TableCell>
          <IconButton size="small" color="primary" onClick={() => onEdit(user)}>
            <EditIcon fontSize="small" />
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
                  <Typography variant="body2">
                    ₹{user.current_salary}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Started:</Typography>
                  <Typography variant="body2">
                    {new Date(user.employment_start_date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Address:</Typography>
                  <Typography variant="body2">
                    {user.street_address}, {user.city}, {user.state} -{" "}
                    {user.postal_code}
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
                {user.role === "Sales Department" && user.teamRole && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Team Role:</Typography>
                    <Typography variant="body2">{user.teamRole}</Typography>
                  </Grid>
                )}
                {user.role === "Sales Department" &&
                  user.teamRole === "Team Member" &&
                  user.teamLeaderName && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Team Leader:</Typography>
                      <Typography variant="body2">
                        {user.teamLeaderName}
                      </Typography>
                    </Grid>
                  )}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Main component
const UserManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openProfileImageDialog, setOpenProfileImageDialog] = useState(false);
  const [preview, setPreview] = useState("");
  const [showTeamRole, setShowTeamRole] = useState(false);

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  const safeSearch = (value, term) => {
    return (value?.toString().toLowerCase() || '').includes(term.toLowerCase());
  };
  

  const [formData, setFormData] = useState({
    emp_id: "",
    username: "",
    email: "",
    role: "",
    teamLeaderName: "",
    teamRole: "",
    phone_number: "",
    current_salary: 0,
    profile_image: "",
    aadhar_number: "",
    pan_number: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    employment_start_date: new Date().toISOString().split("T")[0],
    employment_end_date: null,
    is_active: true,
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/users");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Parse numerical inputs
    let processedValue = value;
    if (type === "number") {
      processedValue = value === "" ? "" : parseFloat(value);
      if (isNaN(processedValue)) processedValue = "";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Show/hide team role dropdown based on role selection
    if (name === "role") {
      setShowTeamRole(value === "Sales Department");
      if (value !== "Sales Department") {
        setFormData((prev) => ({ ...prev, teamRole: "" }));
      }
    }
  };

  const generateEmployeeId = () => {
    if (users.length === 0) return "EMP0001";
    const empNumbers = users
      .map((user) => user.emp_id || "")
      .filter((id) => id.startsWith("EMP") && id.length === 7) // EMP + 4 digits
      .map((id) => parseInt(id.replace("EMP", ""), 10))
      .filter((num) => !isNaN(num) && num >= 0 && num <= 9999);

    const maxId = empNumbers.length > 0 ? Math.max(...empNumbers) : 0;

    if (maxId >= 9999) {
      throw new Error("Maximum employee ID reached (EMP9999)");
    }
    return `EMP${(maxId + 1).toString().padStart(4, "0")}`;
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      emp_id: `${generateEmployeeId()}`, // Auto-generate ID
      username: "",
      email: "",
      role: "",
      teamLeaderName: "",
      teamRole: "",
      phone_number: "",
      current_salary: "",
      profile_image: "",
      aadhar_number: "",
      pan_number: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      employment_start_date: new Date().toISOString().split("T")[0],
      employment_end_date: null,
      is_active: true,
    });
    setOpenDialog(true);
  };

  const handleEditUser = async (user) => {
    try {
      setLoading(true);

      // Make sure this URL matches your backend route
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }

      const userData = await response.json();
      setCurrentUser(userData);
      setShowTeamRole(userData.role === "Sales Department");

      setFormData({
        emp_id: userData.emp_id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        teamLeaderName: userData.teamLeaderName || "",
        teamRole: userData.teamRole || "",
        phone_number: userData.phone_number || "",
        current_salary: userData.current_salary || 0,
        profile_image: userData.profile_image || "",
        aadhar_number: userData.aadhar_number || "",
        pan_number: userData.pan_number || "",
        street_address: userData.street_address || "",
        city: userData.city || "",
        state: userData.state || "",
        postal_code: userData.postal_code || "",
        country: userData.country || "India",
        employment_start_date:
          userData.employment_start_date ||
          new Date().toISOString().split("T")[0],
        employment_end_date:
          userData.employment_end_date === "0000-00-00"
            ? "0000-00-00"
            : userData.employment_end_date || "",
        is_active: userData.is_active ?? true,
      });

      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Delete ${user.username}?`)) {
      const originalUsers = [...users];
      setUsers(users.filter((u) => u.id !== user.id)); // Optimistic update

      try {
        await fetch(`http://localhost:5000/api/users/${user.id}`, {
          method: "DELETE",
        });
      } catch (error) {
        setUsers(originalUsers); // Revert on error
        alert("Delete failed. User restored.");
      }
    }
  };

  const handleUpdateProfileImage = (user) => {
    setCurrentUser(user);
    setOpenProfileImageDialog(true);
  };

  const handleProfileImageSave = (updatedUser) => {
    // Update the user in the users array
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPEG, PNG, or GIF images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Update formData with the file
    setFormData((prev) => ({
      ...prev,
      profile_image: file, // Store the File object
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.emp_id ||
      !formData.username ||
      !formData.email ||
      !formData.role
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const url = currentUser
        ? `http://localhost:5000/api/users/${currentUser.id}`
        : "http://localhost:5000/api/users";
      const method = currentUser ? "PUT" : "POST";

      const formDataToSend = new FormData();

      // Append all fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "profile_image" && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        // Don't set Content-Type header - the browser will set it with the correct boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save user");
      }

      const userData = await response.json();

      if (currentUser) {
        setUsers(users.map((u) => (u.id === currentUser.id ? userData : u)));
      } else {
        setUsers([...users, userData]);
      }

      // Clean up preview URL
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview("");
      }

      setOpenDialog(false);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on tab selection and search term
  const filteredUsers = users.filter((user) => {
    // First filter by tab selection
    if (tabValue === 0) {
      if (user.role === "Sales Department" || user.role === "Admin") {
      return false;
    }
    } else {
      // Sales Department tab - show only Sales Department
      if (user.role !== "Sales Department") {
        return false;
      }
    }

    // Then filter by search term
     return (
      safeSearch(user.username, searchTerm) ||
      safeSearch(user.emp_id, searchTerm) ||
      safeSearch(user.email, searchTerm) ||
      safeSearch(user.role, searchTerm)
    );
  });

  // Count users by category for the badge
  const countUsersByCategory = (category) => {
    return users.filter((user) =>
      category === "All Management"
        ? managementCategories.includes(user.role)
        : user.role === "Sales Department"
    ).length;
  };

  

  // Render loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Toolbar
        sx={{
          padding: "0 16px",
          minHeight: "64px",
          height: "64px",
          justifyContent: "flex-start",
        }}
      >
        <Typography sx={{ flexGrow: 1 }}>User Management System</Typography>
      </Toolbar>

      <Container maxWidth="xl">
        {/* Search and Add User Controls */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
              ),
            }}
            sx={{ width: { xs: "100%", sm: "300px" } }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            fullWidth={isMobile}
          >
            Add User
          </Button>
        </Box>

        {/* Tab Navigation */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isMobile ? "fullWidth" : "standard"}
            aria-label="user management tabs"
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BusinessIcon sx={{ mr: { xs: 0, sm: 1 } }} />
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    All Management
                  </Box>
                  <Chip
                    label={countUsersByCategory("All Management")}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <GroupIcon sx={{ mr: { xs: 0, sm: 1 } }} />
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    Sales Department
                  </Box>
                  <Chip
                    label={countUsersByCategory("Sales Department")}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>
        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {/* Tab Panel for All Management */}
          <Box role="tabpanel" hidden={tabValue !== 0}>
            {tabValue === 0 && (
              <>
                {/* Mobile View - Card Layout */}
                {isMobile && (
                  <Box>
                    {filteredUsers.length === 0 ? (
                      <Alert severity="info">No management users found</Alert>
                    ) : (
                      filteredUsers.map((user) => (
                        <UserCard
                          key={user.id}  // Add this
                          user={user}
                          onEdit={handleEditUser}
                           onUpdateProfileImage={handleUpdateProfileImage}
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
                            <TableCell colSpan={7} align="center">
                              <Alert severity="info">
                                No management users found
                              </Alert>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <ExpandableTableRow
                             key={user.id} 
                              user={user}
                              onEdit={handleEditUser}
                               onUpdateProfileImage={handleUpdateProfileImage}
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
                              <Alert severity="info">
                                No management users found
                              </Alert>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}> 
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box sx={{ position: "relative", mr: 2 }}>
                                    <Avatar
                                      src={user.profile_image}
                                      alt={user.username}
                                      sx={{ width: 40, height: 40 }}
                                    />
                                    <Tooltip title="Update profile image">
                                      <IconButton
                                        size="small"
                                        sx={{
                                          position: "absolute",
                                          bottom: -5,
                                          right: -5,
                                          backgroundColor: "white",
                                          border: "1px solid #e0e0e0",
                                          padding: "3px",
                                        }}
                                        onClick={() =>
                                          handleUpdateProfileImage(user)
                                        }
                                      >
                                        <PhotoCameraIcon
                                          sx={{ fontSize: 14 }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                  {user.emp_id}
                                </Box>
                              </TableCell>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{user.phone_number}</TableCell>
                              <TableCell>{user.current_salary}</TableCell>
                              <TableCell>
                                {new Date(
                                  user.employment_start_date
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={user.is_active ? "Active" : "Inactive"}
                                  color={user.is_active ? "success" : "error"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit <EditIcon fontSize="small" />
                                </Button>

                       
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </Box>

          {/* Tab Panel for Sales Department */}
          <Box role="tabpanel" hidden={tabValue !== 1}>
            {tabValue === 1 && (
              <>
                {/* Mobile View - Card Layout */}
                {isMobile && (
                  <Box>
                    {filteredUsers.length === 0 ? (
                      <Alert severity="info">
                        No sales department users found
                      </Alert>
                    ) : (
                      filteredUsers.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          onEdit={handleEditUser}
                           onUpdateProfileImage={handleUpdateProfileImage}
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
                          <TableCell>Team Role</TableCell>

                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Alert severity="info">
                                No sales department users found
                              </Alert>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <ExpandableTableRow
                              key={user.id}  // Add this line
                              user={user}
                              onEdit={handleEditUser}
                               onUpdateProfileImage={handleUpdateProfileImage}
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
                          <TableCell>Team Role</TableCell>
                          <TableCell>Team Leader</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Salary (₹)</TableCell>

                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} align="center">
                              <Alert severity="info">
                                No sales department users found
                              </Alert>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box sx={{ position: "relative", mr: 2 }}>
                                    <Avatar
                                      src={user.profile_image}
                                      alt={user.username}
                                      sx={{ width: 40, height: 40 }}
                                    />
                                    <Tooltip title="Update profile image">
                                      <IconButton
                                        size="small"
                                        sx={{
                                          position: "absolute",
                                          bottom: -5,
                                          right: -5,
                                          backgroundColor: "white",
                                          border: "1px solid #e0e0e0",
                                          padding: "3px",
                                        }}
                                        onClick={() =>
                                          handleUpdateProfileImage(user)
                                        }
                                      >
                                        <PhotoCameraIcon
                                          sx={{ fontSize: 14 }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                  {user.emp_id}
                                </Box>
                              </TableCell>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.teamRole || "N/A"}</TableCell>
                              <TableCell>
                                {user.teamLeaderName || "N/A"}
                              </TableCell>
                              <TableCell>{user.phone_number}</TableCell>
                              <TableCell>{user.current_salary}</TableCell>

                              <TableCell>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>

                           
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* User Form Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {currentUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              {/* Left side - Profile Image Upload (3 columns) */}
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* Profile Image Upload */}
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <IconButton
                        component="label"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: -11,
                          right: 50,
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          padding: "6px",
                        }}
                      >
                        <FontAwesomeIcon icon={faCamera} fontSize="small" />
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="profile-image-upload"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </IconButton>
                    }
                  >
                    <Avatar
                      src={
                        preview ||
                        (typeof formData.profile_image === "string" &&
                        formData.profile_image
                          ? formData.profile_image.startsWith("/uploads/")
                            ? `http://localhost:5000${formData.profile_image}`
                            : formData.profile_image
                          : "")
                      }
                      sx={{
                        width: 150,
                        height: 150,
                        borderRadius: "2px",
                        backgroundColor: theme.palette.grey[300],
                      }}
                      imgProps={{
                        onError: (e) => {
                          e.target.style.display = "none";
                        },
                      }}
                    >
                      {!preview &&
                        !formData.profile_image &&
                        formData.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>

                  {/* Employee ID as plain text */}
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Employee ID -{formData.emp_id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Automatically generated
                    </Typography>
                  </Box>

                  {error && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "error.main",
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <ErrorIcon fontSize="small" />
                      <Typography variant="body2">{error}</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Right side - Form Fields (9 columns) */}
              <Grid item xs={12} sm={9}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="username"
                      label="Username"
                      size="small"
                      value={formData.username}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="phone_number"
                      label="Phone Number"
                      size="small"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      size="small"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="current_salary"
                      label="Current Salary (₹)"
                      size="small"
                      type="number"
                      value={formData.current_salary}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  {/* Role Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="role"
                      label="Role"
                      size="small"
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

                  {/* Team Role Field (only shown for Sales Department) */}
                  {showTeamRole && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="teamRole"
                        label="Team Role"
                        size="small"
                        select
                        value={formData.teamRole}
                        onChange={handleInputChange}
                        fullWidth
                        required
                      >
                        {teamRoleOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  {/* Team Leader Field (only shown for Team Members) */}
                  {showTeamRole && formData.teamRole === "Team Member" && (
                    <Grid item xs={12} sm={12}>
                      <TextField
                        name="teamLeaderName"
                        label="Team Leader"
                        size="small"
                        select
                        value={formData.teamLeaderName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                      >
                        {users
                          .filter(
                            (user) =>
                              user.role === "Sales Department" &&
                              user.teamRole === "Team Leader" &&
                              (currentUser ? user.id !== currentUser.id : true)
                          )
                          .map((leader) => (
                            <MenuItem key={leader.id} value={leader.username}>
                              {leader.username}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {/* KYC Information */}
              <Grid item xs={12} sx={{ mt: 1 }}>
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
              <Grid item xs={12} sx={{ mt: 1 }}>
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
                  value={
                    formData.employment_start_date
                      ? new Date(formData.employment_start_date)
                          .toISOString()
                          .split("T")[0] // Format: "yyyy-MM-dd"
                      : ""
                  }
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
                  value={
                    formData.employment_end_date &&
                    !isNaN(new Date(formData.employment_end_date))
                      ? new Date(formData.employment_end_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const dateValue = e.target.value ? e.target.value : null;
                    setFormData({
                      ...formData,
                      employment_end_date: dateValue,
                    });
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
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

        {/* Profile Image Upload Dialog */}
        <ProfileImageUpload
          open={openProfileImageDialog}
          onClose={() => setOpenProfileImageDialog(false)}
          user={currentUser}
          onSave={handleProfileImageSave}
        />
      </Container>
    </>
  );
};

export default UserManagement;
