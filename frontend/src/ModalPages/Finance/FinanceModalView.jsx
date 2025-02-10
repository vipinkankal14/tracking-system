import React, { useState, useEffect } from "react";
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
} from "@mui/icons-material";

import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';

const fetchLoanAndDocuments = async (customerId) => {
    try {
        const response = await fetch(`http://localhost:5000/loans/${customerId}`);
        if (!response.ok) throw new Error('Failed to fetch loans');
        return response.json();
    } catch (error) {
        console.error("Error fetching loan and documents:", error);
        return { loans: [] };
    }
};

const FinanceModalView = ({ open, onClose, personalInfo, carInfo, onShowFinance }) => {
    const [loanData, setLoanData] = useState([]);
    const [documentData, setDocumentData] = useState([]);

    useEffect(() => {
        if (personalInfo?.customerId) {
            fetchLoanAndDocuments(personalInfo.customerId).then(({ loans }) => {
                if (loans.length > 0) {
                    setLoanData(loans);
                    setDocumentData(loans[0]?.products || []);
                }
            });
        }
    }, [personalInfo?.customerId]);

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
                    
                    <Box textAlign="center" sx={{ p: 2, display: "flex", justifyContent: "start", alignItems: "center" }}>
                        <Typography variant="h5">Car Finance Services</Typography>
                    </Box>

                    <Stack spacing={2} sx={{ p: 1, m: 0.6, maxWidth: 600, height: "79vh", overflowY: "auto", borderRadius: 2, bgcolor: "background.paper" }}>
                        <Stack spacing={4}>

                            {/* Personal Information */}
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Stack spacing={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Person />
                                        <Typography variant="h6">Personal Information</Typography>
                                    </Box>
                                    <List dense>
                                        <Typography variant="body2">Customer ID: {personalInfo?.customerId}</Typography>
                                        <Typography variant="body2">Full Name: {personalInfo?.firstName} {personalInfo?.middleName} {personalInfo?.lastName}</Typography>
                                        <Typography variant="body2">Email: {personalInfo?.email}</Typography>
                                        <Typography variant="body2">Phone: {personalInfo?.mobileNumber1}, {personalInfo?.mobileNumber2}</Typography>
                                    </List>
                                </Stack>
                            </Paper>

                            {/* Vehicle Information */}
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

                            {/* Loan Information */}
                            {loanData.length > 0 && (
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CreditScoreRoundedIcon />
                                            <Typography variant="h6">Loan Information</Typography>
                                        </Box>
                                        <List dense>
                                            {loanData.map((loan, index) => (
                                                <Box key={index}>
                                                    <Typography variant="body2">Loan Amount: {loan.loan_amount}</Typography>
                                                    <Typography variant="body2">Interest Rate: {loan.interest_rate}%</Typography>
                                                    <Typography variant="body2">Loan Duration: {loan.loan_duration} months</Typography>
                                                    <Typography variant="body2">EMI: {loan.calculated_emi}</Typography>
                                                    <Typography variant="body2">Employment Type: {loan.employment_type}</Typography>
                                                </Box>
                                            ))}
                                        </List>
                                    </Stack>
                                </Paper>
                            )}

                            {/* Customer Documents */}
                            {documentData.length > 0 && (
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PictureAsPdfOutlinedIcon />
                                            <Typography variant="h6">Customer Documents</Typography>
                                        </Box>
                                        <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                                            {documentData.map((doc, index) => (
                                                <Card key={index} sx={{ maxWidth: 300 }}>
                                                    <CardActionArea>
                                                        <CardMedia
                                                            component="img"
                                                            height="100"
                                                            image={doc.file_url || "/default-document.png"}
                                                            alt={doc.uploaded_file}
                                                        />
                                                        <CardContent>
                                                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                                {doc.document_name}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            ))}
                                        </Box>
                                    </Stack>
                                </Paper>
                            )}
                        </Stack>
                    </Stack>

                    {/* Action Buttons */}
                    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                        <Button variant="contained" color="primary" onClick={onClose} size="small">Close</Button>
                        <Button variant="contained" color="primary" onClick={onShowFinance} size="small">Update</Button>
                    </Box>

                </Stack>
            </Box>
        </Modal>
    );
};

export default FinanceModalView;
