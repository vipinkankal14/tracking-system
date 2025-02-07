import React, { useState } from "react";
import {
    Modal,
    Box,
    Paper,
    Stack,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    TextField,
    Slider,
    InputAdornment,
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

import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';


const FinanceModalView = ({ open, onClose, personalInfo, carInfo }) => {
    
 
    return (
        <Modal
            open={open}
            closeAfterTransition
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}
        >
            <Box component={Paper} sx={{ m: 0.5, height: "99vh", width: { xs: "100vw", sm: "85vh" }, p: 2 }}>
                <Box textAlign="center" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography id="modal-title" variant="h5">
                        Car Finance Services
                    </Typography>
                </Box>

                <Stack spacing={2} sx={{ p: 1, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2 }}>
                    <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
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
                    </Box>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CreditScoreRoundedIcon />
                                    <Typography variant="h6">Lons Information</Typography>
                                </Box>
                                <List dense>
                                    <Typography variant="body2">loan_amount: </Typography>
                                    <Typography variant="body2">interest_rate: </Typography>
                                    <Typography variant="body2">loan_duration: </Typography>
                                    <Typography variant="body2">calculated_emi: </Typography>
                                    <Typography variant="body2">employed type: </Typography>
                                </List>
                            </Stack>
                    </Paper>
                    
                    <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr", md: "1fr" }}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Stack spacing={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <PictureAsPdfOutlinedIcon />
                                <Typography variant="h6">Customer Documents </Typography>
                            </Box>
                            <List dense>
                                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                                <Card sx={{ maxWidth: 300 }}>
                                    <CardActionArea>
                                    <CardMedia component="img" height="100" alt="Uploaded File" />
                                    <CardContent>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Document Name
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>

                                <Card sx={{ maxWidth: 300 }}>
                                    <CardActionArea>
                                    <CardMedia component="img" height="100" alt="Uploaded File" />
                                    <CardContent>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Document Name
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                                </Box>
                            </List>
                            </Stack>
                        </Paper>
                    </Box>    
                </Stack>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => {}}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FinanceModalView;
