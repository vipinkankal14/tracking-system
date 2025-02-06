import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Modal,
    Box,
    Paper,
    Stack,
} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

export function CartModal({
    open,
    onClose,
    selectedProducts,
    setSelectedProducts,
    addedItems,
    setAddedItems,
    personalInfo,
    carInfo,
}) {
    const totalAmount = selectedProducts.reduce((total, product) => total + (Number(product.price) || 0), 0);

    const handleRemove = (id) => {
        setAddedItems(addedItems.filter((itemId) => itemId !== id));
        setSelectedProducts(selectedProducts.filter((product) => product.id !== id));
    };

    const handleSubmitCart = async () => {
        if (!personalInfo?.customerId) {
            alert("Please fill in your personal information before submitting the cart.");
            return;
        }

        const cartData = {
            customerId: personalInfo.customerId,
            totalAmount,
            products: selectedProducts,
        };

        try {
            const response = await fetch("http://localhost:5000/api/submitCart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                onClose();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error submitting cart data:", error);
            alert("An error occurred while submitting the cart data.");
        }
    };

    return (
        <Modal open={open} sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
            <Box component={Paper} sx={{ m: 0.5, height: "99vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                    <h6 style={{ fontSize: '16px', textAlign: 'center' }}>ADD TO CART</h6>

                    <Box textAlign="start" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                        <Box>
                            <h6 style={{ fontSize: '12px' }}>Customer ID: {personalInfo?.customerId}</h6>
                            <h6 style={{ fontSize: '12px' }}>Full Name: {personalInfo?.firstName} </h6>
                            <h6 style={{ fontSize: '12px' }}>Phone Numbers: {carInfo?.mobileNumber1}, {carInfo?.mobileNumber2}</h6>
                            <h6 style={{ fontSize: '12px' }}>Email: {personalInfo?.email}</h6>
                            <h6 style={{ fontSize: '12px' }}>Car Details: {carInfo?.carType} | {carInfo?.model} | {carInfo?.variant} | {carInfo?.color}</h6>
                        </Box>
                    </Box>

                    <Stack spacing={4} sx={{ borderRadius: 2, bgcolor: "background.paper", height: "70vh", overflow: "hidden" }}>
                        <TableContainer sx={{ height: "84%", overflow: "auto", position: "relative" }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
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
                                            <TableCell align="right">₹{Number(product.price).toFixed(2)}</TableCell>
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
                    </Stack>
                </Box>
                
                <Box
                    sx={{ 
                        position: "sticky",
                        bottom: 0,
                        padding: "0px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "-5rem",
                    }}
                >
                    <div style={{padding:'6px'}}>
                        <strong style={{ color: 'black', fontSize: '20px' }}>Items: </strong>
                        <span style={{ color: "red", fontSize: '20px', marginLeft: "0px" }}>
                            {selectedProducts.length}
                        </span>
                    </div>
                    <div style={{padding:'6px'}}>
                        <strong style={{ color: 'black', fontSize: '20px' }}>Total: </strong>
                        <span style={{ color: "red", fontSize: '20px', marginLeft: "0px" }}>
                        ₹{totalAmount.toFixed(2)}
                        </span>
                    </div>
                </Box>
              
             
                <Box   
                    sx={{  
                        position: "sticky",
                        bottom: 0,
                        backgroundColor: "background.paper",
                        borderTop: "1px solid #e0e0e0",
                        padding: "0.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Button variant="contained" onClick={onClose} color="primary" size="small">Back</Button>
                    <Button variant="contained" color="primary" size="small" onClick={handleSubmitCart}>Submit</Button>
                </Box>

            </Box>
        </Modal>
    );
}