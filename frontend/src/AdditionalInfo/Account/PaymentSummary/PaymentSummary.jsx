"use client";

import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
 import axios from "axios";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Slider,
  styled,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Refresh, Download,  Visibility,   } from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import RecentPayments from "./RecentPayments";

// Custom styled IOSSlider
const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#3880ff" : "#3880ff",
  height: 2,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 28,
    width: 28,
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.6)",
    },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "unset",
    color: theme.palette.text.primary,
    "&:before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    backgroundColor: "#bfbfbf",
  },
  "& .MuiSlider-mark": {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    "&.MuiSlider-markActive": {
      opacity: 1,
      backgroundColor: "currentColor",
    },
  },
}));

const timeRangeMarks = [
  { value: 0, label: "1h" },
  { value: 1, label: "6h" },
  { value: 2, label: "12h" },
  { value: 3, label: "24h" },
  { value: 4, label: "2d" },
  { value: 5, label: "3d" },
  { value: 6, label: "7d" },
  { value: 7, label: "15d" },
  { value: 8, label: "Live" },
];

const PaymentSummary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
   const [openRecentPaymentsModal, setOpenRecentPaymentsModal] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState("live");
  const [paymentTrends, setPaymentTrends] = useState({
    "1h": { paid: 0, unpaid: 0 },
    "6h": { paid: 0, unpaid: 0 },
    "12h": { paid: 0, unpaid: 0 },
    "24h": { paid: 0, unpaid: 0 },
    "2d": { paid: 0, unpaid: 0 },
    "3d": { paid: 0, unpaid: 0 },
    "7d": { paid: 0, unpaid: 0 },
    "15d": { paid: 0, unpaid: 0 },
    live: { paid: 0, unpaid: 0 },
  });
  const [summaryData, setSummaryData] = useState({
    totalCustomers: 0,
    paidCustomers: 0,
    unpaidCustomers: 0,
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    recentPayments: [],
    monthlyData: [],
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const COLORS = ["#16a34a", "#dc2626", "#d97706"];

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/customers");
        const customers = response.data;

        // Calculate summary statistics
        const totalCustomers = customers.length;
        const paidCustomers = customers.filter(
          (c) => c.payment_status === "Paid"
        ).length;
        const unpaidCustomers = customers.filter(
          (c) => c.payment_status === "Unpaid"
        ).length;

        let totalAmount = 0;
        let paidAmount = 0;
        let unpaidAmount = 0;
        const monthlyPayments = {};

        // For payment trends
        const now = new Date();
        const timeRanges = {
          "1h": new Date(now.getTime() - 1 * 60 * 60 * 1000),
          "6h": new Date(now.getTime() - 6 * 60 * 60 * 1000),
          "12h": new Date(now.getTime() - 12 * 60 * 60 * 1000),
          "24h": new Date(now.getTime() - 24 * 60 * 60 * 1000),
          "2d": new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          "3d": new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          "15d": new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          live: new Date(0), // All time
        };

        const trends = {
          "1h": { paid: 0, unpaid: 0 },
          "6h": { paid: 0, unpaid: 0 },
          "12h": { paid: 0, unpaid: 0 },
          "24h": { paid: 0, unpaid: 0 },
          "2d": { paid: 0, unpaid: 0 },
          "3d": { paid: 0, unpaid: 0 },
          "7d": { paid: 0, unpaid: 0 },
          "15d": { paid: 0, unpaid: 0 },
          live: { paid: 0, unpaid: 0 },
        };

        customers.forEach((customer) => {
          const grandTotal = Number.parseFloat(customer.grand_total || 0);
          const customerBalance = Number.parseFloat(
            customer.customer_account_balance || 0
          );

          totalAmount += grandTotal;
          paidAmount += customerBalance;
          unpaidAmount += grandTotal - customerBalance;

          // Calculate payment trends
          const paymentDate =
            customer.invoice_summary?.createdAt ||
            customer.invoice_summary?.updatedAt ||
            customer.createdAt ||
            new Date().toISOString();
          const date = new Date(paymentDate);

          // Update all time ranges
          Object.keys(timeRanges).forEach((range) => {
            if (date >= timeRanges[range]) {
              trends[range].paid += customerBalance;
              trends[range].unpaid += grandTotal - customerBalance;
            }
          });

          // Process invoice date for monthly trends
          const month = date.getMonth();
          const year = date.getFullYear();
          const monthYear = `${monthNames[month]} ${year}`;

          if (!monthlyPayments[monthYear]) {
            monthlyPayments[monthYear] = { paid: 0, unpaid: 0 };
          }

          monthlyPayments[monthYear].paid += customerBalance;
          monthlyPayments[monthYear].unpaid += grandTotal - customerBalance;
        });

        // Convert to array format for Recharts and sort chronologically
        const monthlyData = Object.keys(monthlyPayments)
          .map((month) => ({
            name: month,
            paid: monthlyPayments[month].paid,
            unpaid: monthlyPayments[month].unpaid,
            sortKey:
              monthNames.indexOf(month.split(" ")[0]) +
              parseInt(month.split(" ")[1]) * 12,
          }))
          .sort((a, b) => a.sortKey - b.sortKey)
          .map(({ name, paid, unpaid }) => ({ name, paid, unpaid }));

        // Recent payments with actual dates
        const recentPayments = customers
          .filter((c) => Number.parseFloat(c.customer_account_balance || 0) > 0)
          .sort((a, b) => {
            const dateA = new Date(a.invoice_summary?.createdAt || a.createdAt);
            const dateB = new Date(b.invoice_summary?.createdAt || b.createdAt);
            return dateB - dateA;
          })
          .slice(0, 5)
          .map((c) => ({
            id: c.customerId,
            name: `${c.firstName} ${c.lastName}`,
            amount: Number.parseFloat(c.customer_account_balance || 0),
            date: c.invoice_summary?.createdAt || c.createdAt,
            status: c.payment_status || "Completed",
          }));

        setPaymentTrends(trends);
        setSummaryData({
          totalCustomers,
          paidCustomers,
          unpaidCustomers,
          totalAmount,
          paidAmount,
          unpaidAmount,
          recentPayments,
          monthlyData,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load summary data");
        console.error("Error fetching summary data:", err);
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pieData = [
    { name: "Paid", value: summaryData.paidAmount },
    { name: "Unpaid", value: summaryData.unpaidAmount },
  ];

  const customerPieData = [
    { name: "Paid Customers", value: summaryData.paidCustomers },
    { name: "Unpaid Customers", value: summaryData.unpaidCustomers },
  ];

  const getTrendData = () => {
    const data = [];
    data.push({
      name: "Paid",
      value: paymentTrends[timeRange].paid,
      color: "#16a34a",
    });
    data.push({
      name: "Unpaid",
      value: paymentTrends[timeRange].unpaid,
      color: "#dc2626",
    });
    return data;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.setFontSize(18);
      pdf.text("Payment Summary Report", pdfWidth / 2, 15, { align: "center" });
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("Payment_Summary_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (event, newValue) => {
    const ranges = ["1h", "6h", "12h", "24h", "2d", "3d", "7d", "15d", "live"];
    setTimeRange(ranges[newValue]);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger p-5">
        <h4>Error</h4>
        <p>{error}</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          <Refresh /> Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div ref={reportRef}>
        <Row className="mb-4">
          <Col>
            <Paper elevation={0} className="p-4 bg-white rounded">
                 
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToPDF}
              >
                Export as PDF
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenRecentPaymentsModal(true)}
                startIcon={<Visibility />}
              >
                View Recent Payments
              </Button>
              </div>
              
              <Row>
                <Col md={6} sm={6} className="mb-3">
                  <Card className="text-center h-100 border-0 shadow-sm">
                    <Card.Body>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Amount
                      </Typography>
                      <Typography variant="caption" className="mt-2">
                        {formatCurrency(summaryData.totalAmount)}
                      </Typography>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} sm={6} className="mb-3">
                  <Card
                    className="text-center h-100 border-0 shadow-sm"
                    style={{ backgroundColor: "#f0fdf4" }}
                  >
                    <Card.Body>
                      <Typography variant="subtitle2" color="textSecondary">
                        Paid Amount
                      </Typography>
                      <Typography
                        variant="caption"
                        className="mt-2"
                        style={{ color: "#16a34a" }}
                      >
                        {formatCurrency(summaryData.paidAmount)}
                      </Typography>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} sm={6} className="mb-3">
                  <Card
                    className="text-center h-100 border-0 shadow-sm"
                    style={{ backgroundColor: "#fef2f2" }}
                  >
                    <Card.Body>
                      <Typography variant="subtitle2" color="textSecondary">
                        Unpaid Amount
                      </Typography>
                      <Typography
                        variant="caption"
                        className="mt-2"
                        style={{ color: "#dc2626" }}
                      >
                        {formatCurrency(summaryData.unpaidAmount)}
                      </Typography>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} sm={6} className="mb-3">
                  <Card
                    className="text-center h-100 border-0 shadow-sm"
                    style={{ backgroundColor: "#f3f4f6" }}
                  >
                    <Card.Body>
                      <Typography variant="subtitle2" color="textSecondary">
                        Collection Rate
                      </Typography>
                      <Typography variant="caption" className="mt-2">
                        {Math.round(
                          (summaryData.paidAmount / summaryData.totalAmount) *
                            100
                        )}
                        %
                      </Typography>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Paper>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={12} className="mb-3 mb-md-0">
            <Paper elevation={1} className="p-3 h-100">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                <Typography variant="h6" gutterBottom className="mb-2 mb-sm-0">
                  Recent Payment
                </Typography>
                <Box
                  sx={{ width: isMobile ? "100%" : 400, mt: isMobile ? 2 : 0 }}
                >
                  <IOSSlider
                    aria-label="Time range"
                    defaultValue={8}
                    step={1}
                    marks={timeRangeMarks}
                    min={0}
                    max={8}
                    valueLabelDisplay="off"
                    onChange={handleTimeRangeChange}
                  />
                </Box>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getTrendData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="value" name="Amount">
                    {getTrendData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Col>
          <Col lg={12} className="mt-3 mb-md-0">
            <Paper elevation={1} className="p-3 h-100">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
                <Typography variant="h6" gutterBottom>
                  Monthly Payment
                </Typography>

                <FormControl
                  size="small"
                  sx={{ width: isMobile ? "100%" : 400, mt: isMobile ? 2 : 0 }}
                >
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <MenuItem value="all">All Months</MenuItem>
                    {summaryData.monthlyData.map((month) => (
                      <MenuItem key={month.name} value={month.name}>
                        {month.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    selectedMonth === "all"
                      ? summaryData.monthlyData
                      : summaryData.monthlyData.filter(
                          (m) => m.name === selectedMonth
                        )
                  }
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="paid" name="Paid Amount" fill="#16a34a" />
                  <Bar dataKey="unpaid" name="Unpaid Amount" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Paper elevation={1} className="p-3 h-100">
              <Typography variant="h6" gutterBottom>
                Payment Distribution
              </Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Col>

          <Col xs={12} md={6}>
            <Paper elevation={1} className="p-3 h-100">
              <Typography variant="h6" gutterBottom>
                Customer Status
              </Typography>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderCustomizedLabel}
                    >
                      {customerPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Col>
        </Row>
        <Modal
  open={openRecentPaymentsModal}
  onClose={() => setOpenRecentPaymentsModal(false)}
  aria-labelledby="recent-payments-modal"
  aria-describedby="recent-payments-list"
>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '80vh',
    overflow: 'auto'
  }}>
    <Typography variant="h6" component="h2" mb={2}>
      Recent Payments
    </Typography>
    <RecentPayments
      payments={summaryData.recentPayments}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
    />
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <Button 
                variant="contained"
                size="small"
        onClick={() => setOpenRecentPaymentsModal(false)}
      >
        Close
      </Button>
    </Box>
  </Box>
</Modal>
      </div>
    </>
  );
};

export default PaymentSummary;
