import React, { useState, useEffect } from "react";
import {Grid, FormControl, FormLabel, RadioGroup, FormControlLabel,Radio,Button,Modal,Table,TableContainer,TableHead, TableRow,TableCell, TableBody,Badge,IconButton,Paper, Typography, TableFooter,} from "@mui/material";
import { Add as AddIcon, Check as CheckIcon, ClearRounded as ClearRoundedIcon } from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const AdditionalApp = ({ data, updateData,personalInfo, carInfo, }) => {
  const [showAccessoriesModal, setShowAccessoriesModal] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [addedItems, setAddedItems] = useState([]); // Store IDs of added items
  const [accessoriesData, setAccessoriesData] = useState([]); // Accessories data
  const [selectedProducts, setSelectedProducts] = useState([]); // Store selected products

  useEffect(() => {
    setAccessoriesData([
      { id: 1, name: "Sunroof", price: 300 },
      { id: 2, name: "Leather Seats", price: 500 },
      { id: 3, name: "Navigation System", price: 1000 },
      { id: 4, name: "Bluetooth Connectivity", price: 200 },
      { id: 5, name: "Rear Camera", price: 150 },
      { id: 6, name: "Alloy Wheels", price: 400 },
      { id: 7, name: "Apple CarPlay", price: 300 },
      { id: 8, name: "Android Auto", price: 300 },
      { id: 9, name: "Wireless Charging", price: 150 },
      { id: 10, name: "Remote Start", price: 200 },
    ]);
  }, []);

  const handleClose = () => setShowAccessoriesModal(false);
   const handleShowAccessories = () => setShowAccessoriesModal(true);
  const handleShowCart = () => setCartModalOpen(true);
  const handleCloseCart = () => setCartModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(name, value);
    if (name === "accessories" && value === "Yes") {
      handleShowAccessories();
    }
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

  const totalAmount = selectedProducts.reduce((total, product) => total + product.price, 0);

  return (
    <div className="desktop-only-margin-AdditionalInfo"> 
      
      <Grid container spacing={4} style={{ marginTop: "-1rem" }}>
        {[
          { name: "exchange", label: "Exchange" },{ name: "finance", label: "Finance" },{ name: "accessories", label: "Accessories" },{ name: "coating", label: "Coating" },{ name: "fastTag", label: "FastTag" },{ name: "rto", label: "RTO" },{ name: "insurance", label: "Insurance" },{ name: "extendedWarranty", label: "Extended Warranty" },{ name: "autoCard", label: "Auto Card" },
        ].map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <FormControl component="fieldset" size="small" fullWidth>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup name={field.name} value={data[field.name]} onChange={handleChange} row >
                <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      {/* Accessories Modal */}
      <Modal open={showAccessoriesModal} style={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
        <div style={{padding: "10px", background: "#fff",margin: "4px", maxWidth: "400px", borderRadius: "8px", height: "99vh", marginBottom: "4px",justifyContent: "end",alignItems: "end",}}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p>Accessories Details</p>
            <Badge badgeContent={addedItems.length} color="error" style={{ cursor: "pointer" }} onClick={handleShowCart}>
              <AddShoppingCartIcon style={{ color: "#110f52" }} />
            </Badge>
          </div>
          <main style={{flexGrow: 1,padding: "1rem", height: "85vh"}}>
            <TableContainer style={{ height: "80vh", overflow: "auto",overflowX: "hidden",}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow><TableCell>Product</TableCell><TableCell align="right">Price</TableCell><TableCell align="right">Actions</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {accessoriesData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Button startIcon={addedItems.includes(item.id) ? <CheckIcon style={{ color: "green" }} /> : <AddIcon />}
                          size="small"onClick={() => handleAddToCart(item)} disabled={addedItems.includes(item.id)}>{addedItems.includes(item.id) ? "Added" : "Add"}
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
      <Modal  open={cartModalOpen} style={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
        <div style={{padding: "10px",background: "#fff", margin: "4px",maxWidth: "600px",borderRadius: "8px",height: "99vh",marginBottom: "4px",justifyContent: "end",alignItems: "end",}}>
          <div style={{justifyContent: "start", alignItems: "start" }}>
            <h6 style={{fontSize:'16px',textAlign:'center'}}>ADD TO CARD</h6>
            <div><h6 style={{fontSize:'12px'}}>Customer ID: {personalInfo?.customerId}</h6><h6 style={{fontSize:'12px'}}>Full Name: {personalInfo?.firstName} </h6><h6 style={{fontSize:'12px'}}>Phone Numbers: {carInfo?.mobileNumber1}, {carInfo?.mobileNumber2}</h6><h6 style={{fontSize:'12px'}}>Email: {personalInfo?.email}</h6><h6 style={{fontSize:'12px'}}>Car Details: {carInfo?.carType} | {carInfo?.model} | {carInfo?.variant} | {carInfo?.color}</h6> </div><hr />
          </div>
          <main style={{ flexGrow: 1, overflowY: "auto", padding: "1rem", height: "70vh", minWidth: "52vh",marginTop:'-32px'}}>
            <TableContainer style={{ height: "55vh", overflow: "auto",overflowX: "hidden",}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow><TableCell style={{color:'purple'}}>Product</TableCell><TableCell style={{color:'purple'}}>Price(₹)</TableCell><TableCell style={{color:'purple'}}>Actions</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {selectedProducts.map((product) => ( <TableRow key={product.id}> <TableCell>{product.name}</TableCell><TableCell align="right">{product.price.toFixed(2)}</TableCell><TableCell align="right"><IconButton onClick={() => handleRemove(product.id)}><ClearRoundedIcon style={{ color: "red" }} /></IconButton></TableCell></TableRow>))}
                </TableBody>

                

              </Table>
            </TableContainer>
            <strong style={{color:"red",fontSize:'20px'}}><strong style={{color:'black',fontFamily:'serif'}}>Total: </strong>{totalAmount.toFixed(2)}</strong>
          </main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" , padding: "2px"}}><Button variant="contained" onClick={handleCloseCart} color="primary" size="small">Back</Button><Button variant="contained" color="primary" size="small">submit</Button></div>
        </div>
      </Modal>
    </div>
  );
};

export default AdditionalApp;
