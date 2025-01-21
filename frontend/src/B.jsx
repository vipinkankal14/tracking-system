import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import '../css/CarBookings.scss';
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CustomerPaymentDetails = () => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers");
        setLeads(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.firstName?.toLowerCase().includes(searchQuery) ||
      lead.company?.toLowerCase().includes(searchQuery) ||
      lead.deal?.toLowerCase().includes(searchQuery) ||
      lead.status?.toLowerCase().includes(searchQuery) ||
      lead.date?.toLowerCase().includes(searchQuery)
  );

  const handleCarAllotment = (customerId) => {
    navigate(`/payment-history/${customerId}`);
  };

  return (
    <>
      
    
      
      <div style={{ marginLeft: "14px", marginTop: "-1%", marginBottom: "-1%" }}>
        <p>Customer Payment Details</p>
      </div>

      <div className="leads-table">
        <div className="leads-header">
          <TextField
            id="search"
            placeholder="Search"
            variant="outlined"
            size="small"
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Car Details</TableCell>
                <TableCell>Booking Amount</TableCell>
                <TableCell>Payment Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{`${lead.firstName} ${lead.middleName} ${lead.lastName}`}</TableCell>
                  <TableCell>{lead.mobileNumber1} {lead.mobileNumber2}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.model},{lead.variant},{lead.color}</TableCell>
                  <TableCell>{lead.booking_amount}</TableCell>
                  <TableCell style={{ textAlign: "center", cursor: "pointer" }}>
                    <Badge bg='info'  onClick={() => handleCarAllotment(lead.customerId)} > view </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default CustomerPaymentDetails;