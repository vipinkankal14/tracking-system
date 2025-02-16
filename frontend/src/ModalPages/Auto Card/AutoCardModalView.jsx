import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Modal,
    Box,
    Paper,
    Stack,
    Typography,
    List,
    Button,
   
} from "@mui/material";
import { Person, DirectionsCar } from "@mui/icons-material";

const AutoCardModalView = ({
    open,
    onClose,
    personalInfo,
    carInfo,
   
}) => {
 

    return (
        <>
            <Modal
                open={open}
                closeAfterTransition
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                }}
            >
                <Box
                    component={Paper}
                    sx={{
                        width: { xs: "100%", sm: "60vh" },
                        height: { xs: "100%", sm: "99%" },
                        marginBottom: { sm: "4px" },
                    }}
                >
                    <Stack
                        spacing={1}
                        sx={{
                            p: 1,
                            maxWidth: 600,
                            height: "100%",
                            overflowY: "auto",
                            borderRadius: 2,
                        }}
                    >
                        <Box textAlign="center" sx={{ p: 2 }}>
                            <Typography variant="h5">Car AutoCard Services</Typography>
                        </Box>

                        <Stack
                            spacing={2}
                            sx={{
                                p: 1,
                                maxWidth: 600,
                                height: "79vh",
                                overflowY: "auto",
                                bgcolor: "background.paper",
                            }}
                        >
                            <Stack spacing={2}>
                                <Box display="grid" gap={3} gridTemplateColumns={{ xs: "1fr" }}>
                                    {/* Personal Information */}
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Stack spacing={2}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Person />
                                                <Typography variant="h6">
                                                    Personal Information
                                                </Typography>
                                            </Box>
                                            <List dense>
                                                <Typography variant="body2">
                                                    Customer ID: {personalInfo?.customerId}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Full Name: {personalInfo?.firstName}{" "}
                                                    {personalInfo?.middleName} {personalInfo?.lastName}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Email: {personalInfo?.email}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Phone: {personalInfo?.mobileNumber1},{" "}
                                                    {personalInfo?.mobileNumber2}
                                                </Typography>
                                            </List>
                                        </Stack>
                                    </Paper>

                                    {/* Vehicle Information */}
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Stack spacing={2}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <DirectionsCar />
                                                <Typography variant="h6">
                                                    Vehicle Information
                                                </Typography>
                                            </Box>
                                            <List dense>
                                                <Typography variant="body2">
                                                    Car Model: {carInfo?.model}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Car Version: {carInfo?.version}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Car Color: {carInfo?.color}
                                                </Typography>
                                            </List>
                                        </Stack>
                                    </Paper>
                                </Box>
                            </Stack>
                        </Stack>

                        <Box
                            sx={{ p: 1, display: "flex", justifyContent: "end" }}
                        >
                            <Button variant="contained" color="primary" onClick={onClose}>
                                Close
                            </Button>
                             
                        </Box>
                    </Stack>
                </Box>
            </Modal>
            
        </>
    );
};

export default AutoCardModalView;
