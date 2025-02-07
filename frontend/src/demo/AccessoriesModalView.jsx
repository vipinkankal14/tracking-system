import React, { useEffect, useState } from "react";
import { Modal, Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

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
        <Modal open={open} sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
            <Box component={Paper} sx={{ m: 0.5, height: "99vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                    <h6 style={{ fontSize: "16px", textAlign: "center" }}>View TO CART</h6>

                    <Box textAlign="start" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                        <Box>
                            <h6 style={{ fontSize: "12px" }}>Customer ID: {personalInfo?.customerId}</h6>
                            <h6 style={{ fontSize: "12px" }}>Full Name: {personalInfo?.firstName}</h6>
                            <h6 style={{ fontSize: "12px" }}>Phone Numbers: {carInfo?.mobileNumber1}, {carInfo?.mobileNumber2}</h6>
                            <h6 style={{ fontSize: "12px" }}>Email: {personalInfo?.email}</h6>
                            <h6 style={{ fontSize: "12px" }}>Car Details: {carInfo?.carType} | {carInfo?.model} | {carInfo?.variant} | {carInfo?.color}</h6>
                        </Box>
                    </Box>

                    <Stack spacing={4} sx={{ borderRadius: 2, bgcolor: "background.paper", height: "70vh", overflow: "hidden" }}>
                        <TableContainer sx={{ height: "84%", overflow: "auto", position: "relative" }}>
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
                                    {selectedProducts.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell align="right">₹{Number(product.price).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Box>

                <Box sx={{ position: "sticky", bottom: 0, padding: "0px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "-5rem" }}>
                    <div style={{ padding: '6px' }}>
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
                        borderTop: "1px solid #e0e0e0",
                        padding: "0.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Button variant="contained" onClick={onClose} color="primary" size="small">Back</Button>
                    <Button variant="contained" onClick={onShowCart} color="primary" size="small">update</Button>   
                </Box>
            </Box>
        </Modal>
    );
}

export default AccessoriesModalView;
