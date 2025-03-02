import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";
import {
  InputAdornment,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import "../css/CarBookings.scss";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const PaymentRefund = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [carStocks, setCarStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch car stock data from backend
  useEffect(() => {
    const fetchCarStocks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getAllAccountManagementRefund"
        );
        setCarStocks(response.data);
      } catch (err) {
        setError("Failed to load refund data. Please try again later.");
        console.error("Error fetching refund data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCarStocks();
  }, []);

  // Filter car stocks based on search query
  const filteredCarStocks = carStocks.filter(
    (stock) =>
      stock.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${stock.firstName} ${stock.middleName} ${stock.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div style={{ marginTop: "-36px", color: "#071947" }}>
        <p className="text-md-start my-4">PAYMENT REFUND</p>
      </div>
      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4">
          <TextField
            variant="outlined"
            placeholder="Search..."
            label="Search Refunds"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <div className="text-center text-danger">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ padding: "10px", fontSize: "10px" }}
                  className="d-none d-sm-table-cell"
                >
                  Customer Id
                </TableCell>
                <TableCell style={{ fontSize: "10px" }}>Full Name</TableCell>
                <TableCell
                  className="d-none d-sm-table-cell"
                  style={{ fontSize: "10px" }}
                >
                  Phone
                </TableCell>
                <TableCell
                  className="d-none d-sm-table-cell"
                  style={{ fontSize: "10px" }}
                >
                  Email
                </TableCell>
                <TableCell
                  className="d-none d-sm-table-cell"
                  style={{ fontSize: "10px" }}
                >
                  Model | Version | Color
                </TableCell>

                <TableCell
                  className="d-none d-sm-table-cell"
                  style={{ fontSize: "10px" }}
                >
                  Refund Amount
                </TableCell>
                <TableCell
                  className="d-none d-sm-table-cell"
                  style={{ fontSize: "10px" }}
                >
                  Updated At
                </TableCell>
                <TableCell style={{ padding: "10px", fontSize: "10px" }}>
                  Payment Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCarStocks.length > 0 ? (
                filteredCarStocks
                  .filter((stock) => stock.status === "refunded")
                  .map((stock, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className="d-none d-sm-table-cell"
                        style={{ padding: "10px", fontSize: "11px" }}
                      >
                        {stock.customerId}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: "11px" }}
                      >{`${stock.firstName} ${stock.middleName} ${stock.lastName}`}</TableCell>
                      <TableCell
                        style={{ fontSize: "11px" }}
                        className="d-none d-sm-table-cell"
                      >
                        {stock.mobileNumber1}, {stock.mobileNumber2}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: "11px" }}
                        className="d-none d-sm-table-cell"
                      >
                        {stock.email}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: "11px" }}
                        className="d-none d-sm-table-cell"
                      >
                        {stock.model} | {stock.version} | {stock.color}
                      </TableCell>

                      <TableCell
                        style={{ fontSize: "11px" }}
                        className="d-none d-sm-table-cell"
                      >
                        {stock.refundAmount}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: "11px" }}
                        className="d-none d-sm-table-cell"
                      >
                        {new Date(stock.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell style={{ padding: "8px", fontSize: "11px" }}>
                        {stock.status}
                        <DoneAllIcon
                          style={{
                            marginLeft: "6px",
                            color: "#1b1994",
                            cursor: "pointer",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" className="text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default PaymentRefund;
