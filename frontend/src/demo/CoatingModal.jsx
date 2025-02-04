import React, { useState } from "react";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    List,
    Paper,
    Stack,
    Modal,
    Box,
    Typography,
    FormHelperText,
} from "@mui/material";
import { DirectionsCar, Person } from "@mui/icons-material";
import { Shield } from "lucide-react";

export function CoatingModal({ open, onClose, personalInfo, carInfo }) {
    const [formData, setFormData] = useState({
        coatingType: "",
        preferredDate: "",
        preferredTime: "",
        additionalNotes: "",
    });
    const [errors, setErrors] = useState({});

    const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!personalInfo?.customerId) {
            alert("Please fill in your personal information before submitting the Car Coating Services.");
            return;
        }

        const coatingData = {
            customerId: personalInfo.customerId,
            ...formData,
        };

        try {
            const response = await fetch("http://localhost:5000/api/submitCoatingRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(coatingData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                onClose();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error submitting coating request:", error);
            alert("An error occurred while submitting the coating request.");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

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

        setErrors(newErrors);
        return isValid;
    };

    return (
        <>
            <Modal open={open} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                <Box component={Paper} sx={{ m: 0.5, height: "99vh" }}>
                    <Box textAlign="center" sx={{ p: 2, width: "55vh", justifyContent: "start", alignItems: "center", display: "flex" }}>
                        <Typography variant="h5" component="h1">Car Coating Services</Typography>
                    </Box>
                    <Stack spacing={2} sx={{ p: 1, m: 0.6, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2, bgcolor: "background.paper" }}>
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
                                                <h6 style={{ fontSize: '12px' }}>Car Version: {carInfo?.version} </h6>
                                                <h6 style={{ fontSize: '12px' }}>Car Color: {carInfo?.color} </h6>
                                            </List>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Box>

                            {/* Service Details */}
                            <Box>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Shield />
                                    <Typography variant="h6">Service Details</Typography>
                                </Box>
                                <Stack spacing={3}>
                                    <FormControl fullWidth error={!!errors.coatingType}>
                                        <InputLabel>Coating Type</InputLabel>
                                        <Select
                                            name="coatingType"
                                            value={formData.coatingType}
                                            onChange={(e) => setFormData({ ...formData, coatingType: e.target.value })}
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
                                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
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
                                                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
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
                                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        error={!!errors.additionalNotes}
                                        helperText={errors.additionalNotes}
                                        size="small"
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                        <Button variant="contained" color="primary" onClick={onClose} size="small">Close</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit} size="small">Submit</Button>
                    </Box>
               </Box>
            </Modal>
        </>
    );
}
