import React, { useState, useEffect } from "react";
import { Grid2 as Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Modal, TableContainer, TableHead, TableRow, TableCell, TableBody, Badge, IconButton, InputLabel, Select, MenuItem, Table, OutlinedInput, Box, Stack, Typography, Paper, List, ListItem, ListItemText, TextField, FormHelperText, } from "@mui/material";
import { Add as AddIcon, Check as CheckIcon, ClearRounded as ClearRoundedIcon, DirectionsCar, Person,} from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Car, Shield, User } from "lucide-react";

 

const AdditionalApp = ({ data, updateData, personalInfo, carInfo }) => {
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [addedItems, setAddedItems] = useState([]); // Store IDs of added items
  const [accessoriesData, setAccessoriesData] = useState([]); // Accessories data
  const [selectedProducts, setSelectedProducts] = useState([]); // Store selected products
  const [selectedCategory, setSelectedCategory] = useState("all"); // Store selected category
  const [totalAmount, setTotalAmount] = useState(0); // Store total amount
  const [showCoatingModal, setShowCoatingModal] = useState(false); // State for Coating modal
  const [errors, setErrors] = useState({}); // State for form errors

  useEffect(() => {
    const fetchAccessoriesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getAllAccessories'); // Replace with your API endpoint
        const data = await response.json();
        setAccessoriesData(data);
      } catch (error) {
        console.error('Error fetching accessories data:', error);
      }
    };

    fetchAccessoriesData();
  }, []);

  useEffect(() => {
    const total = selectedProducts.reduce((total, product) => total + (Number(product.price) || 0), 0);
    setTotalAmount(total);
  }, [selectedProducts]);

  const handleClose = () => setShowAccessoriesModal(false);
  const handleShowAccessories = () => setShowAccessoriesModal(true);
  const handleShowCart = () => setCartModalOpen(true);
  const handleCloseCart = () => setCartModalOpen(false);
  const handleCloseCoatingModal = () => setShowCoatingModal(false); // Close Coating modal


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    
    if (name === "accessories" && value === "Yes" && !showAccessoriesModal) {
      handleShowAccessories();
    }

    if (name === "coating" && value === "Yes") {
      setShowCoatingModal(true); // Open Coating modal if "Yes" is selected
    } else if (name === "coating" && value === "No") {
      setShowCoatingModal(false); // Close Coating modal if "No" is selected
    }
  
  
    updateData(name, value);
  };
  
  const handleAddToCart = (item) => {
    if (!addedItems.includes(item.id)) {
      setAddedItems([...addedItems, item.id]);
      setSelectedProducts([...selectedProducts, item]); // Add product to list
    }
  };

  const handleRemove = (id) => {
    setAddedItems(addedItems.filter((itemId) => itemId !== id));
    setSelectedProducts(selectedProducts.filter((product) => product.id !== id));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredAccessories = selectedCategory === "all" 
    ? accessoriesData 
    : accessoriesData.filter(item => item.category === selectedCategory);

  const categories = [...new Set(accessoriesData.map(item => item.category)), "all"]; 

  const handleSubmitCart = async () => {
    if (!personalInfo.customerId) {
      alert("Please fill in your personal information before submitting the cart.");
      return;
    }
    const cartData = {
      customerId: personalInfo.customerId,
      totalAmount: totalAmount,
      products: selectedProducts,
    };
    console.log("Submitting cart data:", cartData);
    try {
      const response = await fetch("http://localhost:5000/api/submitCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartData),
      });
      const result = await response.json(); // Change from `.text()` to `.json()`
      console.log("Response from server:", result);
      if (response.ok) {
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting cart data:", error);
      alert("An error occurred while submitting the cart data.");
    }
  };

 
  const [formData, setFormData] = useState({
    coatingType: "",
    preferredDate: "",
    preferredTime: "",
    additionalNotes: "",
  });


  const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];

 
   // Handle coating form submission
   const handleSubmitCoating = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
  
    if (!personalInfo.customerId) {
      alert("Please fill in your personal information before submitting the Car Coating Services.");
      return;
    }
  
    const coatingData = {
      customerId: personalInfo.customerId,
      coatingType: formData.coatingType,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      additionalNotes: formData.additionalNotes,
    };
  
    console.log("Coating Data:", coatingData);
  
    try {
      const response = await fetch("http://localhost:5000/api/submitCoatingRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coatingData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        setShowCoatingModal(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error submitting coating request:", error);
      alert("An error occurred while submitting the coating request.");
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      coatingType: "",
      preferredDate: "",
      preferredTime: "",
      additionalNotes: "",
    };
  
    if (!formData.coatingType) {
      newErrors.coatingType = "Coating Type is required";
      isValid = false;
    }
  
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred Date is required";
      isValid = false;
    }
  
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Preferred Time is required";
      isValid = false;
    }
  
    if (!formData.additionalNotes) {
      newErrors.additionalNotes = "Additional Notes are required";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  
  
  return (
    <div className="desktop-only-margin-AdditionalInfo"> 
      
      <Grid container spacing={4} style={{ marginTop: "-1rem" }}>
        {[
          { name: "exchange", label: "Exchange" },
          { name: "finance", label: "Finance" },
          { name: "accessories", label: "Accessories" },
          { name: "coating", label: "Coating" },
          { name: "fastTag", label: "FastTag" },
          { name: "rto", label: "RTO" },
          { name: "insurance", label: "Insurance" },
          { name: "extendedWarranty", label: "Extended Warranty" },
          { name: "autoCard", label: "Auto Card" },
        ].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <FormControl component="fieldset" size="small" fullWidth>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup name={field.name} value={data[field.name]} onChange={handleChange} row>
                <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      

    
        <Modal open={showCoatingModal} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", }} >
          <Box component={Paper} sx={{ m: 0.5, height: "99vh", }}>
            <Box textAlign="center" sx={{ p: 2, width:"55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
              <Typography variant="h5" component="h1">Car Coating Services</Typography>
            </Box>
            <Stack spacing={2} sx={{ p: 1, m: 0.6, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2, bgcolor: "background.paper",}}>
              <form onSubmit={handleSubmitCoating}>
              <Stack spacing={4}>
                {/* Information Sections */}
                <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                {/* Personal Information */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person />
                    <Typography variant="h6">Personal Information</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                    Required Information:
                    </Typography>
                    <List dense>                 
                      <h6 style={{ fontSize: '12px' }}>Full Name: {personalInfo?.firstName} {personalInfo?.middleName} {personalInfo?.lastName}</h6> 
                      <h6 style={{ fontSize: '12px' }}>Email: {personalInfo?.email}</h6>
                      <h6 style={{ fontSize: '12px' }}>Phone Number: {personalInfo?.mobileNumber1},{personalInfo?.mobileNumber2} </h6>
                    </List>
                  </Box>
                  </Stack>
                </Paper>

                {/* Vehicle Information */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <DirectionsCar />
                    <Typography variant="h6">Vehicle Information</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                    Required Information:
                    </Typography>
                    <List dense>
                      <h6 style={{ fontSize: '12px' }}>Car Model: {carInfo?.model} </h6>
                      <h6 style={{ fontSize: '12px' }}>Car Model: {carInfo?.version} </h6>
                      <h6 style={{ fontSize: '12px' }}>Car Model: {carInfo?.color} </h6>   
                    </List>
                  </Box>
                  </Stack>
                </Paper>
                </Box>

                {/* Service Details */}
                <Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Shield />
                  <Typography variant="h6">Service Details</Typography>
                </Box>
                <Stack spacing={3}>
                    
                <FormControl fullWidth error={!!errors.coatingType}>
                  <InputLabel>Coating Type</InputLabel>
                  <Select
                    name="coatingType"
                    value={formData.coatingType}
                    onChange={handleChange}
                    label="Coating Type"
                     
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                  </Select>
                  {errors.coatingType && <FormHelperText>{errors.coatingType}</FormHelperText>}
                </FormControl>

                  <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                  <TextField
                    label="Preferred Date"
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={!!errors.preferredDate}
                    helperText={errors.preferredDate}
                  />
                  <FormControl fullWidth error={!!errors.preferredTime}>
                    <InputLabel>Preferred Time</InputLabel>
                    <Select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      label="Preferred Time"
                    >
                      {timeSlots.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.preferredTime && <FormHelperText>{errors.preferredTime}</FormHelperText>}
                  </FormControl>
                  </Box>

                  <TextField
                    label="Additional Notes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.additionalNotes}
                    helperText={errors.additionalNotes}
                    size="small"    
                  />
                </Stack>
                </Box>

                {/* Submit Button */}
                <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary" size="small">
                  Submit Coating Request
                </Button>
                </Box>
              </Stack>
              </form>
            </Stack>
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "end",}}>
              <Button variant="contained" color="primary" onClick={handleCloseCoatingModal} size="small">Close</Button>
            </Box>
          </Box>
        </Modal>



          
          {/* Accessories Modal */}
      <Modal open={showAccessoriesModal} style={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
        <div style={{ padding: "10px", background: "#fff", margin: "4px", maxWidth: "400px", borderRadius: "8px", height: "99vh", marginBottom: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Badge badgeContent={addedItems.length} color="error" style={{ cursor: "pointer"}} onClick={handleShowCart}>
              <AddShoppingCartIcon style={{ color: "#110f52" }} />
            </Badge>
            <p>Accessories Details</p>

          </div>
         

           {/* Category Filter Dropdown */}
          <FormControl size="small" fullWidth >
            <InputLabel id="category-filter-label">Categories</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              input={<OutlinedInput label="Categories" />}
              onChange={handleCategoryChange}
              size="small"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <main style={{ flexGrow: 1, padding: "1rem", height: "79vh" }}>
            <TableContainer style={{ height: "74vh", overflow: "auto", overflowX: "hidden" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAccessories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">${Number(item.price).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Button startIcon={addedItems.includes(item.id) ? <CheckIcon style={{ color: "green" }} /> : <AddIcon />}
                          size="small" onClick={() => handleAddToCart(item)} disabled={addedItems.includes(item.id)}>
                          {addedItems.includes(item.id) ? "Added" : "Add"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </main>
          <Button variant="contained" color="primary" onClick={handleClose} size="small">Close</Button>
        </div>
      </Modal>

      {/* Cart Modal */}
      <Modal open={cartModalOpen} style={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
        <div  style={{padding: "10px",background: "#fff", margin: "4px",maxWidth: "368px",borderRadius: "8px",height: "99vh",marginBottom: "4px",justifyContent: "end",alignItems: "end",}}>
          <div style={{ justifyContent: "start", alignItems: "start" }}>
            <h6 style={{ fontSize: '16px', textAlign: 'center' }}>ADD TO CART</h6>
            <div>
              <h6 style={{ fontSize: '12px' }}>Customer ID: {personalInfo?.customerId}</h6>
              <h6 style={{ fontSize: '12px' }}>Full Name: {personalInfo?.firstName} </h6>
              <h6 style={{ fontSize: '12px' }}>Phone Numbers: {carInfo?.mobileNumber1}, {carInfo?.mobileNumber2}</h6>
              <h6 style={{ fontSize: '12px' }}>Email: {personalInfo?.email}</h6>
              <h6 style={{ fontSize: '12px' }}>Car Details: {carInfo?.carType} | {carInfo?.model} | {carInfo?.variant} | {carInfo?.color}</h6>
            </div>
            <hr />
    
          </div>
          <main style={{ flexGrow: 1, overflowY: "auto", padding: "1rem", height: "70vh", minWidth: "52vh",marginTop:'-32px'}} >
            <TableContainer style={{ height: "60vh", overflow: "auto", overflowX: "hidden" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>category</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">${Number(product.price).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton color="secondary" onClick={() => handleRemove(product.id)}>
                          <ClearRoundedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                 
                </TableBody>
              </Table>
              </TableContainer>           
            <strong style={{color:"red",fontSize:'20px'}}><strong style={{color:'black',fontFamily:'serif'}}>Total: </strong>{totalAmount.toFixed(2)}</strong>    
          </main>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px" }}><Button variant="contained" onClick={handleCloseCart} color="primary" size="small">Back</Button><Button variant="contained" color="primary" size="small" onClick={handleSubmitCart} >submit</Button></div>
        </div>
      </Modal>


    </div>
  );
};

export default AdditionalApp;
