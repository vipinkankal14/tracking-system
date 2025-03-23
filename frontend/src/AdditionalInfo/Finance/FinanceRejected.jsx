import React, { useState, useEffect } from "react";
import { Table, Spinner, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import DescriptionIcon from "@mui/icons-material/Description";

const FinanceRejected = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [financeAmount, setFinanceAmount] = useState("");
  const [financeReason, setFinanceReason] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/financeshow"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          throw new Error("Invalid data format: Expected an array.");
        }
      } catch (err) {
        setError("Failed to load customer data.");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleErrorIconClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };



  const handleRefundConfirmation = async () => {
    if (!isConfirmed) {
      setError("Please confirm the finance approval.");
      return;
    }

    if (!financeAmount || isNaN(financeAmount) || financeAmount <= 0) {
      setError("Please Re-enter a valid finance amount.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/finance/update-status/${selectedCustomer.customerId}`,
        {
          status: "Approved",
          financeAmount: parseFloat(financeAmount),
          financeReason,
        }
      );

      if (response.status === 200) {
        alert("Finance status updated successfully!");
        setShowModal(false);
        setFinanceAmount("");
        setFinanceReason("");
        setIsConfirmed(false);
        setError(null);
      }
    } catch (err) {
      setError(
        `Failed to update finance status: ${
          err.response?.data?.error || err.message
        }`
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowDocumentsModal(false);
    setIsConfirmed(false);
    setFinanceAmount("");
    setFinanceReason("");
    setError(null);
  };

  const handleDocumentsIconClick = (customer, loan) => {
    setSelectedCustomer(customer);
    setSelectedLoan(loan);
    setShowDocumentsModal(true);
  };

  const getDocumentDetails = (document_path) => {
    if (!document_path) return { customerId: null, fileName: null };

    const fullPath = document_path.replace(/\\/g, "/");
    const pathParts = fullPath.split("/");
    const customerId = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];

    return { customerId, fileName };
  };

   // Card view for mobile
   const renderMobileView = () => {
     return (
       <Box sx={{ mt: 2 }}>
         {filteredCustomers.length > 0 ? (
           filteredCustomers.map(
             (customer, index) =>
               customer.loans?.[0]?.status === "Approval" && (
                 <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent>
                     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                       <Typography variant="subtitle2">
                         ID: {customer.customerId}
                       </Typography>
                       <Chip 
                         label={customer.loans?.[0]?.status || "N/A"} 
                         color="success" 
                         size="small" 
                       />
                     </Box>
                     
                     <Typography variant="body2">
                       <strong>Name:</strong> {customer.firstName} {customer.middleName}{" "}
                       {customer.lastName}
                     </Typography>
                     
                     <Typography variant="body2">
                       <strong>Email:</strong> {customer.email}
                     </Typography>
                     
                     <Typography variant="body2">
                       <strong>Car:</strong> {customer.model} | {customer.version} | {customer.color}
                     </Typography>
                     
                     {customer.loans?.length > 0 && (
                       <Box sx={{ mt: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                         <Typography variant="body2">
                           <strong>Loan ID:</strong> {customer.loans[0].id}
                         </Typography>
                         <Typography variant="body2">
                           <strong>Amount:</strong> {customer.loans[0].loan_amount}
                         </Typography>
                         <Typography variant="body2">
                           <strong>Interest Rate:</strong> {customer.loans[0].interest_rate}
                         </Typography>
                         <Typography variant="body2">
                           <strong>Duration:</strong> {customer.loans[0].loan_duration}
                         </Typography>
                         <Typography variant="body2">
                           <strong>EMI:</strong> {customer.loans[0].calculated_emi}
                         </Typography>
                       </Box>
                     )}
                     
                     <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                       {customer.loans?.length > 0 && (
                         <DescriptionIcon
                           sx={{ cursor: "pointer", mr: 1 }}
                           onClick={() => handleDocumentsIconClick(customer, customer.loans[0])}
                         />
                       )}
                       <ErrorOutlineIcon
                         sx={{ cursor: "pointer" }}
                         onClick={() => handleErrorIconClick(customer)}
                       />
                     </Box>
                   </CardContent>
                 </Card>
               )
           )
         ) : (
           <Typography align="center">No records found.</Typography>
         )}
       </Box>
     );
   };
 
   // Table view for desktop
   const renderDesktopView = () => {
     return (
       <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
         <Table>
           <TableHead>
             <TableRow>
               <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                 Customer ID
               </TableCell>
               <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                 Full Name
               </TableCell>
               <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                 Email
               </TableCell>
               <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                 Car Details
               </TableCell>
               <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                 Loans
               </TableCell>
               <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                 Status
               </TableCell>
               <TableCell sx={{ fontSize: "12px", padding: "10px" }}></TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {filteredCustomers.length > 0 ? (
               filteredCustomers.map(
                 (customer, index) =>
                   customer.loans?.[0]?.status === "Approval" && (
                     <TableRow key={index}>
                       <TableCell sx={{ fontSize: "12px" }}>
                         {customer.customerId}
                       </TableCell>
                       <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                         {customer.firstName} {customer.middleName}{" "}
                         {customer.lastName}
                       </TableCell>
                       <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                         {customer.email}
                       </TableCell>
                       <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                         {customer.model} | {customer.version} | {customer.color}
                       </TableCell>
                       <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                         {customer.loans?.length > 0
                           ? customer.loans.map((loan, loanIndex) => (
                               <div key={loanIndex}>
                                 <strong>Loan ID:</strong> {loan.id} <br />
                                 <strong>Amount:</strong> {loan.loan_amount} <br />
                                 <strong>Interest Rate:</strong>{" "}
                                 {loan.interest_rate} <br />
                                 <strong>Duration:</strong> {loan.loan_duration}{" "}
                                 <br />
                                 <strong>EMI:</strong> {loan.calculated_emi} <br />
                               </div>
                             ))
                           : "No loans available"}
                       </TableCell>
                       <TableCell sx={{ fontSize: "12px", padding: "10px" }}>
                         <Chip 
                           label={customer.loans?.[0]?.status || "N/A"} 
                           color="success" 
                           size="small" 
                         />
                       </TableCell>
                       <TableCell sx={{ fontSize: "12px" }}>
                         {customer.loans?.length > 0
                           ? customer.loans.map((loan, loanIndex) => (
                               <DescriptionIcon
                                 key={loanIndex}
                                 sx={{ cursor: "pointer", mr: 1 }}
                                 onClick={() =>
                                   handleDocumentsIconClick(customer, loan)
                                 }
                               />
                             ))
                           : "No actions"}
 
                         <ErrorOutlineIcon
                           sx={{ cursor: "pointer" }}
                           onClick={() => handleErrorIconClick(customer)}
                         />
                       </TableCell>
                     </TableRow>
                   )
               )
             ) : (
               <TableRow>
                 <TableCell colSpan={7} align="center">
                   No records found.
                 </TableCell>
               </TableRow>
             )}
           </TableBody>
         </Table>
       </TableContainer>
     );
   };
 
   return (
     <Box sx={{ p: 2 }}>
       <Typography 
         variant="h6" 
         align="center" 
         sx={{ color: "#071947", mb: 2 }}
       >
         Car Finance Approved
       </Typography>
 
       {/* Search Bar - Responsive */}
       <Box sx={{ 
         display: "flex", 
         justifyContent: { xs: "center", md: "flex-start" },
         mb: 3
       }}>
         <TextField
           variant="outlined"
           placeholder="Search..."
           label="Search Car Finance"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           InputProps={{
             startAdornment: (
               <InputAdornment position="start">
                 <SearchIcon />
               </InputAdornment>
             ),
           }}
           sx={{ width: "100%", maxWidth: "400px" }}
         />
       </Box>
 
       {loading && (
         <Box sx={{ display: "flex", justifyContent: "center" }}>
           <Spinner animation="border" role="status">
             <span className="visually-hidden">Loading...</span>
           </Spinner>
         </Box>
       )}
 
       {error && !loading && (
         <Typography color="error" align="center">
           {error}
         </Typography>
       )}
 
       {!loading && !error && (
         <>
           {/* Conditional rendering based on screen size */}
           {isMobile ? renderMobileView() : renderDesktopView()}
         </>
       )}
 
       {/* Finance rejected Modal */}
       <Modal
         show={showModal}
         onHide={handleClose}
         centered
         backdrop="static"
         keyboard={false}
         animation={false}
       >
         <Modal.Header closeButton>
           <Typography>
             <strong>Finance Amount for:</strong>{" "}
             {selectedCustomer?.customerId || "N/A"}{" "}
             {selectedCustomer?.customerId && (
               <VerifiedRoundedIcon
                 sx={{
                   color: "#092e6b",
                   fontSize: "15px",
                   mt: "-3px",
                   mr: "-4px",
                 }}
               />
             )}
           </Typography>
         </Modal.Header>
 
         <Modal.Body>
           {selectedCustomer ? (
             <Box>
               <Typography sx={{ fontSize: "12px" }}>
                 <strong>Full Name:</strong>{" "}
                 {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
               </Typography>
 
               <Typography sx={{ fontSize: "12px" }}>
                 <strong>Current Finance Amount:</strong>{" "}
                 {selectedCustomer.loans?.[0]?.financeAmount || "N/A"}
               </Typography>
 
               <Typography sx={{ fontSize: "12px", color: "red" }}>
                 <strong style={{ color: "black" }}>
                   Finance Reason Rejected:
                 </strong>{" "}
                 {selectedCustomer.loans?.[0]?.financeReason || "N/A"}
               </Typography>
             </Box>
           ) : (
             <Typography>No customer selected.</Typography>
           )}
 
           <Box sx={{ 
             display: "flex", 
             flexDirection: "column", 
             gap: "10px", 
             mt: 2,
             alignItems: "center" 
           }}>
             <TextareaAutosize
               minRows={3}
               placeholder="Reason for finance rejected (optional)"
               style={{
                 width: "100%",
                 padding: "10px",
                 borderRadius: "4px",
                 border: "1px solid #ccc",
                 resize: "vertical",
               }}
               value={financeReason}
               onChange={(e) => setFinanceReason(e.target.value)}
             />
 
             <Box sx={{ 
               display: "flex", 
               alignItems: "center", 
               width: "100%", 
               justifyContent: "flex-start" 
             }}>
               <input
                 type="checkbox"
                 id="confirmCheckbox"
                 checked={isConfirmed}
                 onChange={(e) => setIsConfirmed(e.target.checked)}
                 style={{ cursor: "pointer" }}
               />
               <label
                 htmlFor="confirmCheckbox"
                 style={{
                   marginLeft: "5px",
                   display: "flex",
                   alignItems: "center",
                   cursor: "pointer",
                 }}
               >
                 I confirm the finance rejected
               </label>
             </Box>
           </Box>
           
           {error && (
             <Typography
               sx={{
                 color: "red",
                 fontSize: "12px",
                 mt: 1,
                 textAlign: "center",
               }}
             >
               {error}
             </Typography>
           )}
         </Modal.Body>
 
         <Modal.Footer>
           <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
             <Button variant="outlined" size="small" onClick={handleClose}>
               Close
             </Button>
             <Button
               variant="outlined"
               size="small"
               disabled={!isConfirmed}
               onClick={handleRefundConfirmation}
             >
               Confirm
             </Button>
           </Box>
         </Modal.Footer>
       </Modal>
 
       {/* Finance Documents Modal */}
       <Modal
         show={showDocumentsModal}
         onHide={handleClose}
         centered
         backdrop="static"
         keyboard={false}
         animation={false}
         size={isMobile ? "sm" : "lg"}
       >
         <Modal.Header closeButton>
           <Typography fontSize={12}>
             <strong>Finance Documents for:</strong>{" "}
             {selectedCustomer?.customerId || "N/A"}{" "}
             {selectedCustomer?.customerId && (
               <VerifiedRoundedIcon
                 sx={{
                   color: "#092e6b",
                   fontSize: "15px",
                   mt: "-3px",
                   mr: "-4px",
                 }}
               />
             )}
           </Typography>
         </Modal.Header>
 
         <Modal.Body>
           {selectedCustomer && (
             <Typography fontSize={12} sx={{ mb: 2 }}>
               <strong>Full Name:</strong>{" "}
               {`${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}`}
             </Typography>
           )}
           
           {isMobile ? (
             // Mobile view for documents
             <Box>
               {selectedLoan?.documents?.length > 0 ? (
                 selectedLoan.documents.map((document, index) => {
                   const { customerId, fileName } = getDocumentDetails(
                     document.document_path
                   );
                   return (
                     <Card key={index} sx={{ mb: 1, p: 1 }}>
                       <Typography variant="body2">
                         <strong>Document:</strong> {document.document_name}
                       </Typography>
                       <Typography variant="body2">
                         <strong>Uploaded:</strong> {new Date(document.uploaded_at).toLocaleString()}
                       </Typography>
                       {fileName && (
                         <Button 
                           variant="text" 
                           size="small"
                           href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(fileName)}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           sx={{ mt: 1 }}
                         >
                           View Document
                         </Button>
                       )}
                     </Card>
                   );
                 })
               ) : (
                 <Typography align="center">No documents found.</Typography>
               )}
             </Box>
           ) : (
             // Desktop view for documents
             <TableContainer>
               <Table size="small">
                 <TableHead>
                   <TableRow>
                     <TableCell sx={{ fontSize: "10px" }}>
                       Document Name
                     </TableCell>
                     <TableCell sx={{ fontSize: "10px" }}>
                       View Document
                     </TableCell>
                     <TableCell sx={{ fontSize: "10px" }}>
                       Uploaded At
                     </TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {selectedLoan?.documents?.length > 0 ? (
                     selectedLoan.documents.map((document, index) => {
                       const { customerId, fileName } = getDocumentDetails(
                         document.document_path
                       );
                       return (
                         <TableRow key={index}>
                           <TableCell sx={{ fontSize: "10px" }}>
                             {document.document_name}
                           </TableCell>
                           <TableCell sx={{ fontSize: "10px" }}>
                             {fileName ? (
                               <a
                                 href={`http://localhost:5000/uploads/${customerId}/${encodeURIComponent(
                                   fileName
                                 )}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 style={{
                                   color: "blue",
                                   textDecoration: "underline",
                                 }}
                               >
                                 View Document
                               </a>
                             ) : (
                               "N/A"
                             )}
                           </TableCell>
                           <TableCell sx={{ fontSize: "10px" }}>
                             {new Date(document.uploaded_at).toLocaleString()}
                           </TableCell>
                         </TableRow>
                       );
                     })
                   ) : (
                     <TableRow>
                       <TableCell colSpan={3} align="center">
                         No documents found.
                       </TableCell>
                     </TableRow>
                   )}
                 </TableBody>
               </Table>
             </TableContainer>
           )}
 
           {error && (
             <Typography color="error" sx={{ mt: 1 }}>
               {error}
             </Typography>
           )}
         </Modal.Body>
 
         <Modal.Footer>
           <Button variant="outlined" onClick={handleClose}>
             Close
           </Button>
         </Modal.Footer>
       </Modal>
     </Box>
  );
    
};

export default FinanceRejected;
