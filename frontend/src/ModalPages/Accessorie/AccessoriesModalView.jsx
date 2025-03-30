import React, { useEffect, useState } from "react";
import { Modal, Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const fetchOrdersByCustomerId = async (customerId) => {
    const response = await fetch(`http://localhost:5000/orders/${customerId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
};

function AccessoriesModalView({ open, onClose, personalInfo, carInfo, onShowCart }) {
    const [orders, setOrders] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (open && personalInfo?.customerId) {
            fetchOrdersByCustomerId(personalInfo.customerId)
                .then(data => {
                    setOrders(data.orders);
                    const allProducts = data.orders.flatMap(order => order.products);
                    setSelectedProducts(allProducts);
                    const total = allProducts.reduce((acc, product) => {
                        return acc + (Number(product.price) || 0);
                    }, 0);
                    setTotalAmount(total);
                })
                .catch(error => console.error(error));
        }
    }, [open, personalInfo]);

    return (
        <Modal open={open} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
            <Box component={Paper} sx={{ width: { xs: "100%", sm: "60vh" }, height: { xs: "100%", sm: "99%" }, marginBottom: { sm: "4px" } }}>
                <Stack spacing={1} sx={{ p: 1, maxWidth: 600, height: { xs: "100%", sm: "100%" }, overflowY: "auto", borderRadius: 2 }}>

                    <Box textAlign="center" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                        <Typography variant="h5" component="h1">Car Accessories View</Typography>
                    </Box>
                    <Stack spacing={2} sx={{ p: 1, m: 0.6, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2, bgcolor: "background.paper" }}>
                        <Stack spacing={4}>
                            <Box>
                                <Box textAlign="start" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                                    <Box>
                                        <h6 style={{ fontSize: "12px" }}>Customer ID: {personalInfo?.customerId}</h6>
                                        <h6 style={{ fontSize: "12px" }}>Full Name: {personalInfo?.firstName} {personalInfo?.middleName} {personalInfo?.lastName}</h6>
                                        <h6 style={{ fontSize: "12px" }}>Phone Numbers: {personalInfo?.mobileNumber1}, {personalInfo?.mobileNumber2}</h6>
                                        <h6 style={{ fontSize: "12px" }}>Email: {personalInfo?.email}</h6>
                                        <h6 style={{ fontSize: "12px" }}>Car Details: {carInfo?.carType} | {carInfo?.model} | {carInfo?.variant} | {carInfo?.color}</h6>
                                    </Box>
                                </Box>

                                <Stack style={{ flexGrow: 1, padding: "2px" }} sx={{ width: { xs: "100%", sm: "100%" }, height: { xs: "100%", sm: "100%" } }}>
                                    <TableContainer className="custom-scrollbar" style={{ overflowX: "auto" }} component={Paper}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Category</TableCell>
                                                    <TableCell>Product Name</TableCell>
                                                    <TableCell align="right">Product Price</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedProducts.length > 0 ? (
                                                    selectedProducts.map(product => (
                                                        <TableRow key={product.id}>
                                                            <TableCell>{product.id}</TableCell>
                                                            <TableCell>{product.category}</TableCell>
                                                            <TableCell>{product.name}</TableCell>
                                                            <TableCell align="right">₹{Number(product.price).toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">No products available</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                    <Box sx={{padding: "0px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-5rem", marginBottom: "1rem",}}>
                        <div style={{ padding: '6px'}}>
                            <strong style={{ color: 'black', fontSize: '20px' }}>Items: </strong>
                            <span style={{ color: "red", fontSize: '20px', marginLeft: "0px" }}>
                                {selectedProducts.length}
                            </span>
                        </div>
                        <div style={{ padding: '6px' }}>
                            <strong style={{ color: 'black', fontSize: '20px' }}>Total: </strong>
                            <span style={{ color: "red", fontSize: '20px', marginLeft: "0px" }}>
                                ₹{totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'} {/* Ensure to display 0.00 if totalAmount is 0 */}
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
                            alignItems: "center"
                        }}
                    >
                        <Button variant="contained" onClick={onClose} color="primary" size="small">Back</Button>
                        <Button variant="contained" onClick={() => { onClose(); onShowCart(); }} color="primary" size="small">update</Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}

export default AccessoriesModalView;
