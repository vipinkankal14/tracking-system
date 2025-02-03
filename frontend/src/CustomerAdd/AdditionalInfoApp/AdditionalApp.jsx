import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Modal,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  IconButton,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  Table,
  OutlinedInput,
} from "@mui/material";
import {
  Add as AddIcon,
  Check as CheckIcon,
  ClearRounded as ClearRoundedIcon,
} from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const AdditionalApp = ({ data, updateData, personalInfo, carInfo }) => {
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [addedItems, setAddedItems] = useState([]); // Store IDs of added items
  const [accessoriesData, setAccessoriesData] = useState([]); // Accessories data
  const [selectedProducts, setSelectedProducts] = useState([]); // Store selected products
  const [selectedCategory, setSelectedCategory] = useState("all"); // Store selected category
  const [totalAmount, setTotalAmount] = useState(0); // Store total amount

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

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    
    if (name === "accessories" && value === "Yes" && !showAccessoriesModal) {
      handleShowAccessories();
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px" }}><Button variant="contained" onClick={handleCloseCart} color="primary" size="small">Back</Button>
            <Button variant="contained" color="primary" size="small" onClick={handleSubmitCart} >submit</Button></div>
        </div>
      </Modal>
      
    </div>
  );
};

export default AdditionalApp;
