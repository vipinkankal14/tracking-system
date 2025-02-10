import React, { useState } from "react";
import {
    Modal,
    Box,
    Paper,
    Stack,
    Typography,
    List,
    Button,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
} from "@mui/material";
import {
    Person,
    DirectionsCar,
    UploadFile as UploadFileIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";

import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
import FormatColorFillRoundedIcon from '@mui/icons-material/FormatColorFillRounded';

const fetchOrdersByCustomerId = async (customerId) => {
    const response = await fetch(`http://localhost:5000/orders/${customerId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
};

const CoatingModalView = ({ open, onClose, personalInfo, carInfo,onShowCoating }) => {

    return (
        <Modal
            open={open}
            closeAfterTransition
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}
        >
            <Box component={Paper} sx={{ width: { xs: "100%", sm: "60vh" }, height: { xs: "100%", sm: "99%" }, marginBottom: { sm: "4px" } }}>
                <Stack spacing={1} sx={{ p: 1, maxWidth: 600, height: { xs: "100%", sm: "100%" }, overflowY: "auto", borderRadius: 2 }}>
                    <Box textAlign="center" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                        <Typography variant="h5" component="h1">Car Coating Services</Typography>
                    </Box>
                    <Stack spacing={2} sx={{ p: 1, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2, bgcolor: "background.paper" }}>
                        <Stack spacing={2}>
                            
                            <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr"}}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Person />
                                            <Typography variant="h6">Personal Information</Typography>
                                        </Box>
                                        <List dense>
                                            <Typography variant="body2">
                                                customerId: {personalInfo?.customerId}
                                            </Typography>
                                            <Typography variant="body2">
                                                Full Name: {personalInfo?.firstName} {personalInfo?.middleName} {personalInfo?.lastName}
                                            </Typography>
                                            <Typography variant="body2">Email: {personalInfo?.email}</Typography>
                                            <Typography variant="body2">
                                                Phone Number: {personalInfo?.mobileNumber1}, {personalInfo?.mobileNumber2}
                                            </Typography>
                                        </List>
                                    </Stack>
                                </Paper>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <DirectionsCar />
                                            <Typography variant="h6">Vehicle Information</Typography>
                                        </Box>
                                        <List dense>
                                            <Typography variant="body2">Car Model: {carInfo?.model}</Typography>
                                            <Typography variant="body2">Car Version: {carInfo?.version}</Typography>
                                            <Typography variant="body2">Car Color: {carInfo?.color}</Typography>
                                        </List>
                                    </Stack>
                                </Paper>

                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <FormatColorFillRoundedIcon />
                                            <Typography variant="h6">Coating Information</Typography>
                                        </Box>
                                        <List dense>
                                            <Typography variant="body2">Coating Type: </Typography>
                                            <Typography variant="body2">Preferred Date: </Typography>
                                            <Typography variant="body2">Preferred Time: </Typography>
                                            <Typography variant="body2">Amount: </Typography>
                                            <Typography variant="body2">Durability: </Typography>
                                            <Typography variant="body2">Additional Notes: </Typography>
                                        </List>
                                    </Stack>
                                </Paper>  
                            </Box>
                        </Stack>
                    </Stack>
                    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                        <Button variant="contained" color="primary" onClick={onClose} size="small">Close</Button>
                        <Button variant="contained" color="primary" onClick={onShowCoating} size="small">Update</Button>
                    </Box>
                </Stack>
            
            </Box>
        </Modal>
    );
};

export default CoatingModalView;
