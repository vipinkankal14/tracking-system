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
    Typography,
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
        <Modal open={open} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
            <Box component={Paper} sx={{ width: { xs: "100%", sm: "60vh" }, height: { xs: "100%", sm: "99%" }, marginBottom: { sm: "4px" } }}>
                <Stack spacing={1} sx={{ p: 1, maxWidth: 600, height: { xs: "100%", sm: "100%" }, overflowY: "auto", borderRadius: 2 }}>
                    <Box textAlign="center" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                        <Typography variant="h5" component="h1">ADD TO CART</Typography>
                    </Box>
                    <Stack spacing={2} sx={{ p: 1, m: 0.6, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2, bgcolor: "background.paper" }}>
                        <Stack spacing={4}>
                            <Box>
                                <Box textAlign="start" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                                    <Box>
                                        <h6 style={{ fontSize: '12px' }}>Customer ID: {personalInfo?.customerId}</h6>
                                        <h6 style={{ fontSize: '12px' }}>Full Name: {personalInfo?.firstName} </h6>
                                        <h6 style={{ fontSize: '12px' }}>Phone Numbers: {carInfo?.mobileNumber1}, {carInfo?.mobileNumber2}</h6>
                                        <h6 style={{ fontSize: '12px' }}>Email: {personalInfo?.email}</h6>
                                        <h6 style={{ fontSize: '12px' }}>Car Details: {carInfo?.carType} | {carInfo?.model} | {carInfo?.variant} | {carInfo?.color}</h6>
                                    </Box>
                                </Box>
                                <Stack style={{ flexGrow: 1, padding: "2px" }} sx={{ width: { xs: "100%", sm: "100%" }, height: { xs: "42vh", sm: "52vh" } }}>
                                    {selectedProducts.length > 0 ? (
                                        <TableContainer className="custom-scrollbar" style={{ overflowX: "auto" }} component={Paper}>
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
                                    ) : (
                                        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                                            No products available
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
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
                        <div style={{ padding: '6px' }}>
                            <strong style={{ color: 'black', fontSize: '20px' }}>Items: </strong>
                            <span style={{ color: "red", fontSize: '20px', marginLeft: "0px" }}>
                                {selectedProducts.length}
                            </span>
                        </div>
                        <div style={{ padding: '6px' }}>
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
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Button variant="contained" onClick={onClose} color="primary" size="small">Back</Button>
                        <Button variant="contained" color="primary" size="small" onClick={handleSubmitCart}>Submit</Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}