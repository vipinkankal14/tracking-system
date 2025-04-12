// ---------- Module Imports ----------
const { pool } = require('./db/databaseConnection/mysqlConnection');
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
require('dotenv').config();

// ---------- Server Setup ----------
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json({ limit: "10mb" }));


// Import the payment function from the paymentRoutes file
const { handlePayment, getAllCustomers, getCustomerById, ACMApprovedRejected } = require('./db/routes/cashier/paymentRoutes');
const { addCarStock } = require('./db/routes/carStocks/addcar');
const { ShowCarStock, ShowCarStockWithCustomers } = require('./db/routes/carStocks/showcar');
const { addAccessory, getAllAccessories } = require('./db/routes/accessories_store/store');
const { getCustomerOrders, getCustomerLoans, getCustomerCoatingRequests, getCustomerCar } = require('./db/routes/userModal/user');
const { postCoatingRequest } = require('./db/routes/Request/CarCoatingRequest');
const { postCarExchangeRequests } = require('./db/routes/Request/CarExchangeRequest');
const { postCarLoansRequest } = require('./db/routes/Request/CarLoansRequest');
const { postCarFastTagRequest } = require('./db/routes/Request/CarFastTagRequest');
const { postCarInsuranceRequests } = require('./db/routes/Request/CarInsuranceRequest');
const { postRTORequests } = require('./db/routes/Request/CarRTORequests');
const { postCarExtendedWarrantyRequests } = require('./db/routes/Request/CarExtendedWarrantyRequest');
const { postAutoCardRequest } = require('./db/routes/Request/CarAutoCardRequest');
const { postCarBooking } = require('./db/routes/CarBookings/orderBooking');
const { getChargesSummary, submitInvoice } = require('./db/routes/InvoiceSummary/ChargesAndOn-Road');
const { postCustomers } = require('./db/routes/customers/customersPost');
const { showexchange } = require('./db/routes/CarExchangeRequest/showexchange');
const { getAllAccountManagementRefund } = require('./db/routes/Request/CarPaymentRefund');
const { financeshow } = require('./db/routes/CarFinanceRequest/financeshow');
const { Insuranceshow } = require('./db/routes/CarInsuranceRequest/Insuranceshow');
const { fastTagshow } = require('./db/routes/CarFastTagRequest/fastTagshow');
const { AccessoriesRequestshow } = require('./db/routes/CarAccessoriesRequest/AccessoriesRequestshow');
const { showRTO } = require('./db/routes/CarRTORequest/showRTO');
const { showCoating } = require('./db/routes/CarCoatingRequest/showCoating');
const { showExtendedWarranty } = require('./db/routes/CarExWarrantyRequest/showExtendedWarranty');
const { showAutocard } = require('./db/routes/CarAutocardRequest/showAutocard');
const { showPreDeliveryInspection } = require('./db/routes/PreDeliveryInspection/showPreDeliveryInspection');
const { ShowSecurityclearance } = require('./db/routes/ShowSecurityclearance/ShowSecurityclearance');
const { GatePassShow } = require('./db/routes/GatePass/GatePassShow');
const { getConfirmedBookings } = require('./db/routes/BookingsConfirmed/Confirmed');
const { getcanceledBookings } = require('./db/routes/BookingsConfirmed/Canceled');
const { getCarRequestForCustomers } = require('./db/routes/CarManagement/CarRequestForCustomers');
const { createUser, getUsers, getUserById, updateUser, deleteUser, uploadProfileImageForNewUser, uploadProfileImage, upload } = require('./db/routes/Usermanagement/createUser');
const { getCustomerProfile, verifyToken, Customerlogin } = require('./db/routes/Customer_Login_and_OrderTrackingSystem/CustomerProfile');

/* app.get('/api/cashier/all', getAllCashierTransactions); */

// Use the payment routes
app.get('/api/getAllAccountManagementRefund', getAllAccountManagementRefund);
app.get('/api/ACMApprovedRejected', ACMApprovedRejected);
app.get('/api/customers', getAllCustomers); //frontend\src\cashier\Payments\PaymentPending.jsx //frontend\src\cashier\CarBooking\CarBookings.jsx // frontend\src\cashier\CarBookingCancel\CarBookingCancel.jsx // frontend\src\cashier\CustomerPaymentDetails\CustomerPaymentDetails.jsx // frontend\src\cashier\Payments\PaymentClear.jsx
app.get("/api/customerspay/:id", getCustomerById); // frontend\src\cashier\Payments\Payment.jsx
app.use('/api/CarStock', addCarStock); //carStocks\AddCarStock.jsx
app.get('/api/showAllCarStocks', ShowCarStock); // frontend\src\carStocks\CarAllotmentByCustomer.jsx // frontend\src\components\AdditionalDetails.jsx
app.get('/api/showAllCarStocksWithCustomers', ShowCarStockWithCustomers);
app.get('/api/getAllAccessories', getAllAccessories); // frontend\src\carStocks\CarAllotmentByCustomer.jsx // frontend\src\components\AdditionalDetails.jsx
app.get('/orders/:customerId', getCustomerOrders);
app.get('/api/coating-requests/:customerId', getCustomerCoatingRequests);
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'CarloansRequest')));
app.get('/loans/:customerId', getCustomerLoans);

app.post('/api/payments', handlePayment); // frontend\src\cashier\Payments\PaymentDetails.jsx
app.post('/api/addAccessory', addAccessory); //frontend\src\Accessories\AddedUploadView\Store\AccessoriesTable.jsx


app.post('/api/submitCart', (req, res) => {
  const { customerId, totalAmount, products } = req.body;

  console.log("Received cart data:", req.body); // Log received data

  if (!customerId || !Array.isArray(products)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  // First, delete the products associated with the customer order
  const deleteProductsQuery = `
    DELETE FROM order_products WHERE orderId IN (
      SELECT id FROM orders_accessories_request WHERE customerId = ?
    );
  `;

  pool.query(deleteProductsQuery, [customerId], (err) => {
    if (err) {
      console.error("Error deleting old products:", err);
      return res.status(500).json({ message: "Error deleting old products." });
    }

    // Then, delete the order itself
    const deleteOrderQuery = `
      DELETE FROM orders_accessories_request WHERE customerId = ?;
    `;

    pool.query(deleteOrderQuery, [customerId], (err) => {
      if (err) {
        console.error("Error deleting order:", err);
        return res.status(500).json({ message: "Error deleting order." });
      }

      const insertOrderQuery = `INSERT INTO orders_accessories_request (customerId, totalAmount) VALUES ( ?, ?);`
      pool.query(insertOrderQuery, [customerId, totalAmount], (err, result) => {
        if (err) {
          console.error("Error inserting new order:", err);
          return res.status(500).json({ message: "Database error while inserting new order." });
        }

        const orderId = result.insertId;
        console.log("New Order ID:", orderId);

        if (products.length > 0) {
          const productValues = products.map((p) => [orderId, p.category, p.name, p.price]);

          const insertProductsQuery = `
            INSERT INTO order_products (orderId, category, name, price)
            VALUES ?
          `;

          pool.query(insertProductsQuery, [productValues], (err) => {
            if (err) {
              console.error("Error inserting new products:", err);
              return res.status(500).json({ message: "Error inserting new products." });
            }
            res.status(200).json({ message: "Order updated successfully with new products." });
          });
        } else {
          res.status(200).json({ message: "Order updated but no products were added." });
        }
      });
    });
  });
});

// backend\db\routes\Request\CarCoatingRequest.js
app.post('/api/submitCoatingRequest', postCoatingRequest);



{/*-------------------------------------------------------------------- */ }

// Increase payload size limits // backend\db\routes\Request\CarLoansRequest.js
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const storageCarloans = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "CarloansRequest", req.body.customerId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadCarloans = multer({ storage: storageCarloans });

app.post("/api/loans", uploadCarloans.array("documents"), postCarLoansRequest);

{/*-------------------------------------------------------------------- */ }


// backend\db\routes\Request\CarExchangeRequest.js
const storageCarExchange = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "CarExchangeRequest", req.body.customerId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadCarExchange = multer({ storage: storageCarExchange });

app.post('/api/submitCarExchangeRequest',
  uploadCarExchange.fields([
    { name: 'rcDocument', maxCount: 1 },
    { name: 'insurancePolicy', maxCount: 1 },
    { name: 'pucCertificate', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'loanClearance', maxCount: 1 },
    { name: 'serviceHistory', maxCount: 1 }
  ]),
  postCarExchangeRequests
);

{/*-------------------------------------------------------------------- */ }

// Multer storage configuration for Car FastTag documents

const storageCarFastTag = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "CarFastTagRequest", req.body.customerId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadCarFastTag = multer({ storage: storageCarFastTag });

// POST endpoint for submitting Car FastTag request
app.post(
  "/api/submitCarFastTagRequest",
  uploadCarFastTag.fields([
    { name: "rcDocument", maxCount: 1 },
    { name: "aadhaarDocument", maxCount: 1 },
    { name: "panDocument", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
  ]),

  postCarFastTagRequest

);

{/*-------------------------------------------------------------------- */ }

const storageCarInsurance = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "CarInsuranceRequest", req.body.customerId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadCarInsurance = multer({ storage: storageCarInsurance });

// POST endpoint for submitting Car FastTag request
app.post(
  "/api/submitInsuranceRequest",
  uploadCarInsurance.fields([
    { name: "rcDocument", maxCount: 1 },
    { name: "salesInvoice", maxCount: 1 },
    { name: "identityProof", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "form21", maxCount: 1 },
    { name: "form22", maxCount: 1 },
    { name: "tempReg", maxCount: 1 },
    { name: "puc", maxCount: 1 },
    { name: "loanDocuments", maxCount: 1 },
  ]),

  postCarInsuranceRequests

);


{/*-------------------------------------------------------------------- */ }

const storageCarRTO = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "CarRTORequest", req.body.customerId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadCarRTO = multer({ storage: storageCarRTO });

// POST endpoint for submitting Car FastTag request
app.post(
  "/api/submitRTORequest",
  uploadCarRTO.fields([
    { name: "form20", maxCount: 1 },
    { name: "form21", maxCount: 1 },
    { name: "form22", maxCount: 1 },
    { name: "invoice", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "puc", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "roadTax", maxCount: 1 },
    { name: "tempReg", maxCount: 1 },
    { name: "form34", maxCount: 1 },
  ]),
  postRTORequests
);

{/*-------------------------------------------------------------------- */ }


app.post("/api/submitExtendedWarrantyRequest", postCarExtendedWarrantyRequests);

// API endpoint to handle AutoCard request submission
app.post("/api/submitAutoCardRequest", postAutoCardRequest);

// API Route: Apply Booking
app.post('/api/apply-booking', (req, res) => {
  const { selectedCars, bookingAmount } = req.body;

  // Validate request
  if (!Array.isArray(selectedCars) || selectedCars.length === 0) {
    return res.status(400).json({ error: 'Invalid or missing selectedCars array' });
  }
  if (!bookingAmount || typeof bookingAmount !== 'number') {
    return res.status(400).json({ error: 'Invalid or missing bookingAmount' });
  }

  // Construct query
  const vins = selectedCars.map((car) => car.vin).map(() => '?').join(',');
  const query = `UPDATE carstocks SET bookingAmount = ? WHERE vin IN (${vins})`;
  const params = [bookingAmount, ...selectedCars.map((car) => car.vin)];

  // Execute query
  pool.query(query, params, (err, result) => {
    if (err) {
      console.error('Failed to update booking amounts:', err);
      return res.status(500).json({ error: 'Failed to update booking amounts' });
    }

    // Emit real-time updates to all connected clients
    io.emit('bookingUpdated', {
      message: 'Booking amounts updated successfully',
      updatedCars: selectedCars,
    });

    res.json({ message: 'Booking amounts applied successfully', result });
  });
});

app.get('/api/customer/:customerId', (req, res) => {
  const { customerId } = req.params;
  console.log("Received customerId:", customerId);

  // SQL query to fetch customer and payment details
  const query = `
      SELECT 
          c.id AS CustomerID,
          c.firstName,
          c.middleName,
          c.lastName,
          c.mobileNumber1,
          c.mobileNumber2,
          c.customerType,
          c.birthDate,
          c.email,
          c.customerId,
          c.address,
          c.city,
          c.state,
          c.country,
          c.model,
          c.variant,
          c.color,
          c.team_Member,
          c.team_Leader,
          c.booking_amount,
          c.total_onroad_price,
          c.orderDate,
          c.prebooking,
          c.exchange,
          c.finance,
          c.accessories,
          c.coating,
          c.auto_card,
          c.extended_warranty,
          c.customer_account_balance,
          c.rto_tax,
          c.fast_tag,
          c.insurance,
          c.status,
          p.id AS PaymentID,
          p.debitedAmount,
          p.creditedAmount,
          p.paymentDate,
          p.transactionType,
          p.paymentType
      FROM 
          customers c
      LEFT JOIN 
          cashier p
      ON 
          c.customerId = p.customerId
      WHERE 
          c.customerId = ?;
  `;

  pool.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching customer data:', err);
      res.status(500).json({ error: 'Error fetching customer data' });
    } else if (results.length === 0) {
      console.log("No record found for customerId:", customerId);
      res.status(404).json({ error: 'Customer not found' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/cancel-order', (req, res) => {
  const { customerId, cancellationReason, isConfirmed } = req.body;

  // Determine the new values based on the status
  const status = 'canceled';
  const newCancellationReason = 'confirmed' === status ? null : cancellationReason; // Clear if status is 'confirmed'
  const newIsConfirmed = 'confirmed' === status ? false : isConfirmed; // Clear if status is 'confirmed'

  const query = `
    UPDATE customers
    SET 
      status = ?,
      cancellationReason = ?,
      isConfirmed = ?
    WHERE customerId = ?;
  `;

  pool.execute(query, [status, newCancellationReason, newIsConfirmed, customerId], (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Failed to cancel the order.' });
      return;
    }

    // Check if any rows were affected
    if (results.affectedRows === 0) {
      res.status(404).send({ message: 'Customer not found.' });
      return;
    }

    res.send({ message: 'Order canceled successfully.' });
  });
});

app.put('/api/confirmed-order', (req, res) => {
  const { customerId } = req.body;

  // Define the new values
  const status = 'confirmed';
  const cancellationReason = null; // Set to NULL
  const isConfirmed = false; // Set to FALSE

  const query = `
    UPDATE customers
    SET 
      status = ?,
      cancellationReason = ?,
      isConfirmed = ?
    WHERE customerId = ?;
  `;

  pool.execute(query, [status, cancellationReason, isConfirmed, customerId], (err, results) => {
    if (err) {
      console.error('Error confirming the order:', err);
      res.status(500).send({ error: 'Failed to confirm the order.' });
      return;
    }

    // Check if any rows were affected
    if (results.affectedRows === 0) {
      res.status(404).send({ message: 'Customer not found.' });
      return;
    }

    res.send({ message: 'Order confirmed successfully.' });
  });
});

// frontend\src\cashier\CustomerPaymentDetails\PaymentHistory.jsx
app.get('/api/PaymentHistory/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    // Fetch data from all tables
    const [customer] = await pool.promise().query('SELECT * FROM customers WHERE customerId = ?', [customerId]);
    const [carbooking] = await pool.promise().query('SELECT * FROM carbooking WHERE customerId = ?', [customerId]);
    const [additionalInfo] = await pool.promise().query('SELECT * FROM additional_info WHERE customerId = ?', [customerId]);
    const [cashier] = await pool.promise().query('SELECT * FROM cashier WHERE customerId = ?', [customerId]);
    const [ordersprebookingdate] = await pool.promise().query('SELECT * FROM orders_prebooking_date WHERE customerId = ?', [customerId]);
    const [accountmanagement] = await pool.promise().query('SELECT * FROM account_management WHERE customerId = ?', [customerId]);
    const [accountmanagementrefund] = await pool.promise().query('SELECT * FROM account_management_refund WHERE customerId = ?', [customerId]);



    // Fetch invoice summary
    const [invoiceSummaryRows] = await pool.promise().query(
      'SELECT * FROM invoice_summary WHERE customerId = ?',
      [customerId]
    );
    const invoiceSummary = invoiceSummaryRows[0];
    const invoiceId = invoiceSummary?.invoice_id;

    // Fetch on-road price details using invoice_id
    const [onRoadPriceDetails] = await pool.promise().query(
      'SELECT * FROM on_road_price_details WHERE invoice_id = ?',
      [invoiceId]
    );

    // Fetch additional charges using invoice_id
    const [additionalCharges] = await pool.promise().query(
      'SELECT * FROM additional_charges WHERE invoice_id = ?',
      [invoiceId]
    );


    // Check if customer exists
    if (customer.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Combine all data into a single response
    const response = {
      customer: customer[0],
      carbooking: carbooking[0],
      additionalInfo: additionalInfo[0],
      cashier: cashier,
      invoicesummary: invoiceSummary,
      ordersprebookingdate: ordersprebookingdate[0],
      onRoadPriceDetails: onRoadPriceDetails[0],
      additionalCharges: additionalCharges[0],
      accountmanagement: accountmanagement[0],
      accountmanagementrefund: accountmanagementrefund,
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/OrderEditAndCancel/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    // Fetch data from all tables
    const [customer] = await pool.promise().query('SELECT * FROM customers WHERE customerId = ?', [customerId]);
    const [carbooking] = await pool.promise().query('SELECT * FROM carbooking WHERE customerId = ?', [customerId]);
    const [additionalInfo] = await pool.promise().query('SELECT * FROM additional_info WHERE customerId = ?', [customerId]);
    const [ordersprebookingdate] = await pool.promise().query('SELECT * FROM orders_prebooking_date WHERE customerId = ?', [customerId]);


    // Check if customer exists
    if (customer.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Combine all data into a single response
    const response = {
      customer: customer[0],
      carbooking: carbooking[0],
      additionalInfo: additionalInfo[0],
      ordersprebookingdate: ordersprebookingdate[0],
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cars', (req, res) => {
  const { model, version, color, carType } = req.query;

  let query = 'SELECT * FROM carstocks WHERE 1=1';
  const params = [];

  if (model) {
    query += ' AND model = ?';
    params.push(model);
  }
  if (version) {
    query += ' AND version = ?';
    params.push(version);
  }
  if (color) {
    query += ' AND color = ?';
    params.push(color);
  }
  if (carType) {
    query += ' AND carType = ?';
    params.push(carType);
  }

  pool.query(query, params, (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/apply-discount', (req, res) => {
  const { selectedCars, discountAmount } = req.body;

  if (!selectedCars || !discountAmount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const vins = selectedCars.map((car) => car.vin).map(() => '?').join(',');
  const query = `UPDATE carstocks SET cardiscount = ? WHERE vin IN (${vins})`;
  const params = [discountAmount, ...selectedCars.map((car) => car.vin)];

  pool.query(query, params, (err, result) => {
    if (err) {
      console.error('Failed to update discounts:', err);
      res.status(500).json({ error: 'Failed to update discounts' });
      return;
    }
    res.json({ message: 'Discounts applied successfully', result });
  });
});

// API endpoint to get all car stocks // frontend\src\carStocks\CarAllotment.jsx
app.get('/api/api/customer/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = `
   SELECT *
    FROM customers c
    LEFT JOIN carbooking cb ON c.customerId = cb.customerId
    LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
    LEFT JOIN orders_prebooking_date ON c.customerId = orders_prebooking_date.customerId
    WHERE c.customerId = ?`;

  pool.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(results[0]);
  });
});

// API endpoint to get car data by VIN  // frontend\src\carStocks\CarAllotment.jsx
app.get('/api/car/:vin', (req, res) => {
  const { vin } = req.params;

  const query = 'SELECT * FROM carstocks WHERE vin = ?';
  pool.query(query, [vin], (err, results) => {
    if (err) {
      console.error('Error fetching car data: ', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(results[0]);  // Return the first (and only) result
  });
});

// Express route to update car allotment status // frontend\src\carStocks\CarAllotment.jsx
app.put('/api/car/update/:vin', (req, res) => {
  const { vin } = req.params;
  const { customerId, allotmentCarStatus, cancellationReason } = req.body;

  // Validate allotmentCarStatus
  if (!['Allocated', 'Not Allocated'].includes(allotmentCarStatus)) {
    return res.status(400).json({ message: 'Invalid allotment status' });
  }

  const query = 'UPDATE carstocks SET customerId = ?, allotmentCarStatus = ?, cancellationReason = ? WHERE vin = ?';

  pool.query(query, [customerId, allotmentCarStatus, cancellationReason, vin], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error updating car stock' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Car stock updated successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  });
});

app.put('/api/car/customer/:vin', (req, res) => {
  const { vin } = req.params;
  const { customerId, allotmentCarStatus, cancellationReason } = req.body;

  if (!['Allocated', 'Not Allocated'].includes(allotmentCarStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid allotment status'
    });
  }

  const query = `UPDATE carstocks 
    SET customerId = ?, 
        allotmentCarStatus = ?, 
        cancellationReason = ? 
    WHERE vin = ?`;

  pool.query(query,
    [customerId, allotmentCarStatus, cancellationReason, vin],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (result.affectedRows > 0) {
        res.status(200).json({
          success: true,
          message: 'Car stock updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Car not found'
        });
      }
    });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

// Route to check the current pool status
app.get('/api/pool-status', (req, res) => {
  // Get the total number of connections
  const totalConnections = pool._allConnections.length; // Total connections created
  const freeConnections = pool._freeConnections.length; // Free connections available
  const inUseConnections = totalConnections - freeConnections; // In-use connections

  res.json({
    totalConnections,
    freeConnections,
    inUseConnections,
  });
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

// API endpoint to handle car selection submission
app.post('/api/submitCarSelection', postCarBooking)

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

// API endpoint to fetch total charges
app.get("/api/totalCharges", getChargesSummary);

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.post('/api/submit-form', async (req, res) => {
  try {
    const { personalInfo, orderInfo, additionalInfo } = req.body;
    const result = await postCustomers(personalInfo, orderInfo, additionalInfo);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.error || ''
    });
  }
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.post('/api/submitInvoice', submitInvoice);

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.put('/api/account/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, cancellationReason } = req.body;

  // Check if the customerId exists in account_management
  const checkSql = `SELECT * FROM account_management WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO account_management 
        (customerId, status, cancellationReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(insertSql, [customerId, status, cancellationReason], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: insertErr.message });
        }
        res.json({ message: 'New record created successfully', result: insertResult });
      });
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE account_management 
        SET status = ?, cancellationReason = ? 
        WHERE customerId = ?
      `;
      pool.query(updateSql, [status, cancellationReason, customerId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Update error:", updateErr);
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Record updated successfully', result: updateResult });
      });
    }
  });
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.post('/api/refund/create', async (req, res) => {
  const { customerId, refundReason, refundAmount } = req.body;

  // Default status is "Process"
  const status = "Process";

  try {
    // Insert a new record into account_management_refund
    const insertSql = `
      INSERT INTO account_management_refund 
      (customerId, status, refundReason, refundAmount) 
      VALUES (?, ?, ?, ?)
    `;
    const [insertResult] = await pool.promise().query(insertSql, [customerId, status, refundReason, refundAmount]);

    res.json({
      message: 'New refund record created successfully with status "Process"',
      result: insertResult
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }


// showexchange
app.use('/uploads', express.static(path.join(__dirname, 'CarExchangeRequest')));
app.get('/api/showexchange', showexchange);

// update car exchange request status

app.put('/api/exchange/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, exchangeReason, exchangeAmount } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM car_exchange_requests  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO car_exchange_requests 
        (customerId, status, exchangeReason, exchangeAmount ) 
        VALUES (?, ?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, exchangeReason, exchangeAmount],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE car_exchange_requests
        SET 
          exchangeAmount  = ?,
          exchangeReason  = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [exchangeAmount, exchangeReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});

app.put('/api/rejected/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, exchangeReason } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM car_exchange_requests  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO car_exchange_requests 
        (customerId, status, exchangeReason ) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, exchangeReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE car_exchange_requests
        SET 
          exchangeReason  = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [exchangeReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.use('/uploads', express.static(path.join(__dirname, 'CarloansRequest')));
app.get('/api/financeshow', financeshow);

// update car exchange request status

app.put('/api/finance/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, financeReason, financeAmount } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM loans  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO loans 
        (customerId, status, financeReason, financeAmount ) 
        VALUES (?, ?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, financeReason, financeAmount],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE loans
        SET 
          financeAmount  = ?,
          financeReason  = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [financeAmount, financeReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});

app.put('/api/rejected/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, financeReason } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM loans  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO loans 
        (customerId, status, financeReason ) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, financeReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE loans
        SET 
          financeReason  = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [financeReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});



{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.use('/uploads', express.static(path.join(__dirname, 'CarInsuranceRequest')));
app.get('/api/Insuranceshow', Insuranceshow);


app.put('/api/approval/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM car_insurance_requests  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO car_insurance_requests 
        (customerId, status ) 
        VALUES (?, ?,)
      `;
      pool.query(
        insertSql,
        [customerId, status],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE car_insurance_requests
        SET 
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});

app.put('/api/rejection/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, insuranceReason } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM car_insurance_requests  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO car_insurance_requests 
        (customerId, status, insuranceReason ) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, insuranceReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE car_insurance_requests
        SET 
         
          insuranceReason  = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [insuranceReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.use('/uploads', express.static(path.join(__dirname, 'CarFastTagRequest')));
app.get('/api/fastTagshow', fastTagshow);


app.put('/api/fastapproval/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM car_fasttag_requests  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO car_fasttag_requests 
        (customerId, status ) 
        VALUES (?, ?,)
      `;
      pool.query(
        insertSql,
        [customerId, status],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE car_fasttag_requests
        SET 
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});

app.put('/api/fastrejection/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, fasttagReason } = req.body;

  // Check if the customerId exists in car_exchange_requests 
  const checkSql = `SELECT * FROM car_fasttag_requests  WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO car_fasttag_requests 
        (customerId, status, fasttagReason ) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, fasttagReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // CustomerId exists: Update the existing record
      const updateSql = `
        UPDATE car_fasttag_requests
        SET 
         
          fasttagReason  = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [fasttagReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

// API endpoint to fetch orders with customer and product details
app.get('/api/getOrdersWithCustomers', AccessoriesRequestshow)

app.put('/api/accessoriesapproval/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Check if the customerId exists in orders_accessories_request
  const checkSql = `SELECT * FROM orders_accessories_request WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO orders_accessories_request 
        (customerId, status) 
        VALUES (?, ?)
      `;
      pool.query(insertSql, [customerId, status], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: insertErr.message });
        }
        res.json({ message: 'New record created successfully', result: insertResult });
      });
    } else {
      // Update existing record
      const updateSql = `
        UPDATE orders_accessories_request
        SET status = ?
        WHERE customerId = ?
      `;
      pool.query(updateSql, [status, customerId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Update error:", updateErr);
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Record updated successfully', result: updateResult });
      });
    }
  });
});


app.put('/api/accessoriesrejection/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, accessorieReason } = req.body;

  // Check if the customerId exists in orders_accessories_request
  const checkSql = `SELECT * FROM orders_accessories_request WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO orders_accessories_request 
        (customerId, status, accessorieReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, accessorieReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE orders_accessories_request
        SET 
          accessorieReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [accessorieReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.use('/uploads', express.static(path.join(__dirname, 'CarRTORequest')));
app.get('/api/showRTO', showRTO);

app.put('/api/rtoapproval/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Check if the customerId exists in car_rto_requests
  const checkSql = `SELECT * FROM car_rto_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO car_rto_requests 
        (customerId, status) 
        VALUES (?, ?)
      `;
      pool.query(insertSql, [customerId, status], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: insertErr.message });
        }
        res.json({ message: 'New record created successfully', result: insertResult });
      });
    } else {
      // Update existing record
      const updateSql = `
        UPDATE car_rto_requests
        SET status = ?
        WHERE customerId = ?
      `;
      pool.query(updateSql, [status, customerId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Update error:", updateErr);
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Record updated successfully', result: updateResult });
      });
    }
  });
});


app.put('/api/rtorejection/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, rtoReason } = req.body;

  // Check if the customerId exists in car_rto_requests
  const checkSql = `SELECT * FROM car_rto_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO car_rto_requests 
        (customerId, status, rtoReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, rtoReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE car_rto_requests
        SET 
          rtoReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [rtoReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.get('/api/showCoating', showCoating);

app.put('/api/coatingapproval/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Check if the customerId exists in car_rto_requests
  const checkSql = `SELECT * FROM coating_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO coating_requests 
        (customerId, status) 
        VALUES (?, ?)
      `;
      pool.query(insertSql, [customerId, status], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: insertErr.message });
        }
        res.json({ message: 'New record created successfully', result: insertResult });
      });
    } else {
      // Update existing record
      const updateSql = `
        UPDATE coating_requests
        SET status = ?
        WHERE customerId = ?
      `;
      pool.query(updateSql, [status, customerId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Update error:", updateErr);
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Record updated successfully', result: updateResult });
      });
    }
  });
});

app.put('/api/coatingrejection/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, coatingReason } = req.body;

  // Check if the customerId exists in car_rto_requests
  const checkSql = `SELECT * FROM coating_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO coating_requests 
        (customerId, status, coatingReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, coatingReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE coating_requests
        SET 
          coatingReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [coatingReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }


app.get('/api/showExtendedWarranty', showExtendedWarranty);

app.put('/api/extendedWarrantyApproval/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Check if the customerId exists in car_rto_requests
  const checkSql = `SELECT * FROM car_extended_warranty_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO car_extended_warranty_requests 
        (customerId, status) 
        VALUES (?, ?)
      `;
      pool.query(insertSql, [customerId, status], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: insertErr.message });
        }
        res.json({ message: 'New record created successfully', result: insertResult });
      });
    } else {
      // Update existing record
      const updateSql = `
        UPDATE car_extended_warranty_requests
        SET status = ?
        WHERE customerId = ?
      `;
      pool.query(updateSql, [status, customerId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Update error:", updateErr);
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Record updated successfully', result: updateResult });
      });
    }
  });
});

app.put('/api/extendedWarrantyRejection/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, ex_Reason } = req.body;

  // Check if the customerId exists in car_rto_requests
  const checkSql = `SELECT * FROM car_extended_warranty_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO car_extended_warranty_requests 
        (customerId, status, ex_Reason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, ex_Reason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE car_extended_warranty_requests
        SET 
          ex_Reason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [ex_Reason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }


app.get('/api/showAutocard', showAutocard);

app.put('/api/autocardApproval/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status } = req.body;

  // Check if the customerId exists in car_rto_requests
  const checkSql = `SELECT * FROM car_autocard_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO car_autocard_requests 
        (customerId, status) 
        VALUES (?, ?)
      `;
      pool.query(insertSql, [customerId, status], (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: insertErr.message });
        }
        res.json({ message: 'New record created successfully', result: insertResult });
      });
    } else {
      // Update existing record
      const updateSql = `
        UPDATE car_autocard_requests
        SET status = ?
        WHERE customerId = ?
      `;
      pool.query(updateSql, [status, customerId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Update error:", updateErr);
          return res.status(500).json({ error: updateErr.message });
        }
        res.json({ message: 'Record updated successfully', result: updateResult });
      });
    }
  });
});

app.put('/api/autocardRejection/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, autoCardReason } = req.body;

  const checkSql = `SELECT * FROM car_autocard_requests WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO car_autocard_requests 
        (customerId, status, autoCardReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, autoCardReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE car_autocard_requests
        SET 
          autoCardReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [autoCardReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }


app.get('/api/showPreDeliveryInspection', showPreDeliveryInspection);

app.put('/api/preInspectionapproved/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, preDeliveryInspectionReason } = req.body;

  try {
    // Validate status
    if (status !== "Approval") {
      return res.status(400).json({ error: "Invalid status for approval" });
    }

    // Update or insert PDI record
    const [existing] = await pool.promise().query(
      `SELECT * FROM predeliveryinspection WHERE customerId = ?`,
      [customerId]
    );

    if (existing.length === 0) {
      await pool.promise().query(
        `INSERT INTO predeliveryinspection 
        (customerId, status, preDeliveryInspectionReason)
        VALUES (?, ?, ?)`,
        [customerId, status, preDeliveryInspectionReason || null]
      );
    } else {
      await pool.promise().query(
        `UPDATE predeliveryinspection
        SET status = ?, preDeliveryInspectionReason = ?
        WHERE customerId = ?`,
        [status, preDeliveryInspectionReason || null, customerId]
      );
    }

    res.status(200).json({ message: "PDI approved successfully" });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ error: "Failed to approve PDI" });
  }
});

app.put('/api/preInspectionRejection/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, preDeliveryInspectionReason } = req.body;

  const checkSql = `SELECT * FROM predeliveryinspection WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO predeliveryinspection 
        (customerId, status, preDeliveryInspectionReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, preDeliveryInspectionReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE predeliveryinspection
        SET 
          preDeliveryInspectionReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [preDeliveryInspectionReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
})


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.get('/api/ShowSecurityclearance', ShowSecurityclearance);

app.put('/api/Securityclearanceapproved/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, securityClearanceReason } = req.body;

  try {
    // Validate status
    if (status !== "Approval") {
      return res.status(400).json({ error: "Invalid status for approval" });
    }

    // Update or insert PDI record
    const [existing] = await pool.promise().query(
      `SELECT * FROM management_security_clearance WHERE customerId = ?`,
      [customerId]
    );

    if (existing.length === 0) {
      await pool.promise().query(
        `INSERT INTO management_security_clearance 
        (customerId, status, securityClearanceReason)
        VALUES (?, ?, ?)`,
        [customerId, status, securityClearanceReason || null]
      );
    } else {
      await pool.promise().query(
        `UPDATE management_security_clearance
        SET status = ?, securityClearanceReason = ?
        WHERE customerId = ?`,
        [status, securityClearanceReason || null, customerId]
      );
    }

    res.status(200).json({ message: "Security Clearance approved successfully" });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ error: "Failed to approve Security Clearance" });
  }
});

app.put('/api/SecurityclearanceRejection/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, securityClearanceReason } = req.body;

  const checkSql = `SELECT * FROM management_security_clearance WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO management_security_clearance 
        (customerId, status, securityClearanceReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, securityClearanceReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE management_security_clearance
        SET 
          securityClearanceReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [securityClearanceReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.get('/api/GatePassShow', GatePassShow);

app.put('/api/GatePassapproved/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, gatepassReason } = req.body;

  try {
    // Validate status
    if (status !== "Approval") {
      return res.status(400).json({ error: "Invalid status for approval" });
    }

    // Update or insert PDI record
    const [existing] = await pool.promise().query(
      `SELECT * FROM gate_pass WHERE customerId = ?`,
      [customerId]
    );

    if (existing.length === 0) {
      await pool.promise().query(
        `INSERT INTO gate_pass 
        (customerId, status, gatepassReason)
        VALUES (?, ?, ?)`,
        [customerId, status, gatepassReason || null]
      );
    } else {
      await pool.promise().query(
        `UPDATE gate_pass
        SET status = ?, gatepassReason = ?
        WHERE customerId = ?`,
        [status, gatepassReason || null, customerId]
      );
    }

    res.status(200).json({ message: "Gate Pass approved successfully" });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ error: "Failed to approve Gate Pass" });
  }
});


app.put('/api/GatePassRejection/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, gatepassReason } = req.body;

  const checkSql = `SELECT * FROM gate_pass WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // Insert new record
      const insertSql = `
        INSERT INTO gate_pass 
        (customerId, status, gatepassReason) 
        VALUES (?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, gatepassReason],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: 'New record created successfully', result: insertResult });
        }
      );
    } else {
      // Update existing record
      const updateSql = `
        UPDATE gate_pass
        SET 
          gatepassReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [gatepassReason, status, customerId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: 'Record updated successfully', result: updateResult });
        }
      );
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.post('/api/customer/login', (req, res) => {
  const { customerId } = req.body;

  const query = 'SELECT * FROM customers WHERE customerId = ?';
  pool.query(query, [customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      res.json({ success: true, customer: results[0] });
    } else {
      res.json({ success: false, message: 'Customer not found' });
    }
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.put('/api/update-invoice/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const {
    exShowroomPrice,
    accessories,
    discount,
    gstRate,
    cessRate,
    coating,
    fastTag,
    rto,
    insurance,
    extendedWarranty,
    autoCard,
    refundReason, // Used for all refunds
    refundStatus  // Applied to all refunds
  } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  let connection;
  try {
    connection = await pool.promise().getConnection();
    await connection.query('START TRANSACTION');

    // Fetch invoiceId using customerId
    const [invoiceSummary] = await connection.query(
      `SELECT invoice_id, grand_total, customer_account_balance FROM invoice_summary WHERE customerId = ?`,
      [customerId]
    );

    if (!invoiceSummary.length) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoiceId = invoiceSummary[0].invoice_id;
    const currentGrandTotal = parseFloat(invoiceSummary[0].grand_total);
    const currentCustomerAccountBalance = parseFloat(invoiceSummary[0].customer_account_balance);

    // Fetch current on_road_price_details and additional_charges
    const [currentOnRoadPrice] = await connection.query(
      `SELECT ex_showroom_price, accessories 
       FROM on_road_price_details WHERE invoice_id = ?`,
      [invoiceId]
    );

    const [currentAdditionalCharges] = await connection.query(
      `SELECT coating, fast_tag, rto, insurance, extended_warranty, auto_card 
       FROM additional_charges WHERE invoice_id = ?`,
      [invoiceId]
    );

    // Update on_road_price_details
    await connection.query(
      `UPDATE on_road_price_details
       SET 
         ex_showroom_price = ?,
         accessories = ?,
         discount = ?,
         subtotal = ex_showroom_price + accessories - discount,
         gst_rate = ?,
         gst_amount = subtotal * gst_rate / 100,
         cess_rate = ?,
         cess_amount = subtotal * cess_rate / 100,
         total_on_road_price = subtotal + gst_amount + cess_amount,
         updatedAt = CURRENT_TIMESTAMP
       WHERE invoice_id = ?`,
      [exShowroomPrice, accessories, discount, gstRate, cessRate, invoiceId]
    );

    // Calculate refunds for ex_showroom_price
    const oldExShowroomPrice = parseFloat(currentOnRoadPrice[0].ex_showroom_price);
    const newExShowroomPrice = parseFloat(exShowroomPrice);
    const exShowroomRefund = newExShowroomPrice - oldExShowroomPrice;

    if (exShowroomRefund !== 0) {
      await connection.query(
        `INSERT INTO account_management_refund 
         (customerId, refundAmount, refundReason, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [customerId, exShowroomRefund, refundReason || 'Ex-Showroom Price Adjustment', refundStatus || 'InProcess']
      );
    }

    // Calculate and save accessories refund
    const currentAccessoriesAmount = parseFloat(currentOnRoadPrice[0].accessories);
    const newAccessoriesAmount = parseFloat(accessories);
    const accessoriesRefund = newAccessoriesAmount - currentAccessoriesAmount;

    if (accessoriesRefund !== 0) {
      await connection.query(
        `INSERT INTO account_management_refund 
         (customerId, refundAmount, refundReason, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [customerId, accessoriesRefund, refundReason || 'Accessories Adjustment', refundStatus || 'InProcess']
      );
    }

    // Update additional_charges
    await connection.query(
      `UPDATE additional_charges
       SET 
         coating = ?,
         fast_tag = ?,
         rto = ?,
         insurance = ?,
         extended_warranty = ?,
         auto_card = ?,
         total_charges = coating + fast_tag + rto + insurance + extended_warranty + auto_card,
         updatedAt = CURRENT_TIMESTAMP
       WHERE invoice_id = ?`,
      [coating, fastTag, rto, insurance, extendedWarranty, autoCard, invoiceId]
    );

    // Calculate and save refunds for additional charges
    const chargeFields = [
      { column: 'coating', name: 'Coating', newValue: coating },
      { column: 'fast_tag', name: 'FastTag', newValue: fastTag },
      { column: 'rto', name: 'RTO', newValue: rto },
      { column: 'insurance', name: 'Insurance', newValue: insurance },
      { column: 'extended_warranty', name: 'Extended Warranty', newValue: extendedWarranty },
      { column: 'auto_card', name: 'AutoCard', newValue: autoCard }
    ];

    for (const field of chargeFields) {
      const oldValue = parseFloat(currentAdditionalCharges[0][field.column]);
      const newValue = parseFloat(field.newValue);
      const refundAmount = newValue - oldValue;

      if (refundAmount !== 0) {
        await connection.query(
          `INSERT INTO account_management_refund 
           (customerId, refundAmount, refundReason, status, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [customerId, refundAmount, refundReason || `${field.name} Adjustment`, refundStatus || 'InProcess']
        );
      }
    }

    // Fetch updated totals and update invoice_summary
    const [onRoadPrice] = await connection.query(
      `SELECT total_on_road_price FROM on_road_price_details WHERE invoice_id = ?`,
      [invoiceId]
    );
    const [additionalCharges] = await connection.query(
      `SELECT total_charges FROM additional_charges WHERE invoice_id = ?`,
      [invoiceId]
    );

    const totalOnRoadPrice = parseFloat(onRoadPrice[0].total_on_road_price);
    const totalCharges = parseFloat(additionalCharges[0].total_charges);
    const newGrandTotal = totalOnRoadPrice + totalCharges;

    // Calculate the difference between the new and old grandTotal
    const grandTotalDifference = newGrandTotal - currentGrandTotal;

    // Update the customer_account_balance by adding the difference
    const newCustomerAccountBalance = currentCustomerAccountBalance + grandTotalDifference;

    await connection.query(
      `UPDATE invoice_summary
       SET 
         total_on_road_price = ?,
         total_charges = ?,
         grand_total = ?,
         customer_account_balance = ?,
         updatedAt = CURRENT_TIMESTAMP
       WHERE invoice_id = ?`,
      [totalOnRoadPrice, totalCharges, newGrandTotal, newCustomerAccountBalance, invoiceId]
    );

    await connection.query('COMMIT');
    res.status(200).json({ message: 'Invoice updated successfully' });
  } catch (error) {
    if (connection) await connection.query('ROLLBACK');
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.put("/api/updateRefund", async (req, res) => {
  const { id, status, transactionType, refundReason } = req.body;

  // Validate required fields
  if (!id || !status) {
    return res.status(400).json({ message: "ID and status are required" });
  }

  // Validate status
  if (!["Completed", "Failed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Validate transaction type for Completed status
  if (status === "Completed" && !transactionType) {
    return res.status(400).json({ message: "Transaction type is required for completed refunds" });
  }

  // Validate refund reason for Failed status
  if (status === "Failed" && !refundReason) {
    return res.status(400).json({ message: "Refund reason is required for failed refunds" });
  }

  try {
    // Prepare SQL query
    const query = `
      UPDATE account_management_refund
      SET
        status = ?,
        transactionType = ?,
        refundReason = ?
      WHERE id = ?
    `;

    // Execute query
    const [result] = await pool
      .promise()
      .execute(query, [status, transactionType, refundReason, id]);

    // Check if refund was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Refund not found" });
    }

    // Return success response
    res.status(200).json({ message: "Refund updated successfully" });
  } catch (err) {
    console.error("Error updating refund:", err);
    res.status(500).json({ message: "Failed to update refund" });
  }
});


app.get("/api/carstocks", async (req, res) => {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM carstocks");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching car stocks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/cars/:carId", async (req, res) => {
  try {
    const carId = req.params.carId;
    const [rows] = await pool.promise().query("SELECT * FROM carstocks WHERE id = ?", [carId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    console.error("Error fetching car details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }


// Fetch suggested products
app.get("/api/suggested-products", async (req, res) => {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM carstocks LIMIT 6");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching suggested products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

app.get('/api/bookings/confirmed', getConfirmedBookings);
app.get('/api/bookings/canceled', getcanceledBookings);
app.get('/api/Customers/Request', getCarRequestForCustomers);



app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.post('/api/users', upload.single('profile_image'), createUser);

app.get('/api/users', getUsers);
app.get('/api/users/:id', getUserById);    // Added / before :id
app.put('/api/users/:id', upload.single('profile_image'), updateUser);     // Added / before :id
app.delete('/api/users/:id', deleteUser);  // Added / before :id

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.post('/api/users/profile-image', upload.single('profile_image'), uploadProfileImageForNewUser);
app.post('/api/users/:id/profile-image', upload.single('profile_image'), uploadProfileImage);



{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }


app.use('/profile-images', express.static(path.join(__dirname, 'public', 'profile-images')));

// Token blacklist (in-memory storage - consider using Redis in production)
const tokenBlacklist = new Set();

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { emp_id, password } = req.body;

    // Basic validation
    if (!emp_id || !password) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and password are required"
      });
    }

    // Find user by emp_id
    const [users] = await pool.promise().query(
      'SELECT * FROM users WHERE emp_id = ?',
      [emp_id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Employee ID"
      });
    }

    const user = users[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Update user activity status and timestamps
    const currentTime = new Date();
    await pool.promise().query(
      'UPDATE users SET is_active = 1, last_login = ? WHERE emp_id = ?',
      [currentTime, emp_id]
    );

    // Determine navigation path based on role
    let navigatePath;
    switch (user.role) {
      case 'Admin':
        navigatePath = 'Admin';
        break;
      case 'Accessories Management':
        navigatePath = 'Accessories-Management';
        break;
      case 'PDI (Pre-Delivery Inspection) Management':
        navigatePath = 'PreDelivery-Management';
        break;
      case 'Car Stocks Management':
        navigatePath = 'car-stock-Management';
        break;
      case 'Security Clearance Management':
        navigatePath = 'Security-Clearance-Management';
        break;
      case 'Coating Management':
        navigatePath = 'Coating-Management';
        break;
      case "Cashier Management":
        navigatePath = "Cashier-Management";
        break;
      case 'RTO Management':
        navigatePath = 'RTOApp-Management';
        break;
      case 'FastTag Management':
        navigatePath = 'fast-tag-Management';
        break;
      case 'Insurance Management':
        navigatePath = 'insurance-Management';
        break;
      case 'AutoCard Management':
        navigatePath = 'AutoCard-Management';
        break;
      case 'Extended Warranty Management':
        navigatePath = 'Extended-Warranty-Management';
        break;
      case 'Exchange Management':
        navigatePath = 'Exchange-Management';
        break;
      case 'Finance Management':
        navigatePath = 'Finance-Management';
        break;
      case 'Account Management':
        navigatePath = 'account-Management';
        break;
      case 'HR Management':
        navigatePath = 'User-Management';
        break;
      default:
        navigatePath = 'Unknown';
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        emp_id: user.emp_id,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Successful login response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        emp_id: user.emp_id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: 1,
        last_login: currentTime,
        profile_image: user.profile_image
          ? `${req.protocol}://${req.get('host')}${user.profile_image}`
          : null,
        navigate: navigatePath
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Corrected Logout Endpoint
app.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided"
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Add token to blacklist
    tokenBlacklist.add(token);

    // Update user status with proper error handling
    const currentTime = new Date();
    try {
      const [result] = await pool.promise().query(
        'UPDATE users SET is_active = 0, logout_last = ? WHERE emp_id = ?',
        [currentTime, decoded.emp_id]
      );

      if (result.affectedRows === 0) {
        console.error(`No user found with emp_id: ${decoded.emp_id}`);
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to update user status"
      });
    }

    res.status(200).json({
      success: true,
      message: "Logout successful. Token invalidated.",
      logout_time: currentTime
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Authentication Middleware (add this)
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || tokenBlacklist.has(token)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Protected data",
    user: req.user
  });
});


{/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }

// Create a transporter with proper Gmail settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vipinkankal01@gmail.com',
    pass: 'oxaq vmbr dndz bqkj' // Make sure this is a valid App Password
  }
});


const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  keyGenerator: req => req.body.emp_id,
  message: 'Too many OTP requests for this account',
  standardHeaders: true,
  legacyHeaders: false
});

// Input validation middleware
const validateRequestOTP = [
  body('emp_id').trim().isAlphanumeric().withMessage('Invalid employee ID'),
  body('email').trim().isEmail().normalizeEmail()
];

const validateVerifyOTP = [
  body('emp_id').trim().isAlphanumeric(),
  body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric()
];

// Request OTP endpoint
app.post('/api/request-otp', validateRequestOTP, otpLimiter, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { emp_id, email } = req.body;
  let connection;

  try {
    connection = await pool.promise().getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      'SELECT id FROM users WHERE emp_id = ? AND email = ?',
      [emp_id, email]
    );

    if (rows.length > 0) {
      const otp = crypto.randomInt(100000, 999999); // Secure 6-digit OTP
      const otpHash = await bcrypt.hash(otp.toString(), 10);
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await connection.execute(
        'UPDATE users SET otp_secret = ?, otp_expiry = ? WHERE id = ?',
        [otpHash, expiry, rows[0].id]
      );

      await transporter.sendMail({
        from: `"Secure App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP is: ${otp}\nValid for 10 minutes`,
        html: `<p>Your OTP is: <strong>${otp}</strong><br>Valid for 10 minutes</p>`
      });
    }

    await connection.commit();
    res.json({ message: 'If an account exists, an OTP has been sent' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('OTP Request Error:', error);
    res.status(500).json({ message: 'Server error processing request' });
  } finally {
    if (connection) connection.release();
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', validateVerifyOTP, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { emp_id, otp } = req.body;

  try {
    const [rows] = await pool.promise().execute(
      `SELECT id, otp_secret, otp_expiry 
       FROM users WHERE emp_id = ?`,
      [emp_id]
    );

    if (!rows.length || new Date(rows[0].otp_expiry) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const valid = await bcrypt.compare(otp, rows[0].otp_secret);
    if (!valid) return res.status(400).json({ message: 'Invalid OTP' });

    const tokenId = crypto.randomUUID();
    const token = jwt.sign(
      { emp_id, jti: tokenId },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    await pool.promise().execute(
      `INSERT INTO active_tokens (token_id, user_id, expires_at)
       VALUES (?, ?, NOW() + INTERVAL 5 MINUTE)`,
      [tokenId, rows[0].id]
    );

    res.json({ token });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// Validation middleware
const validateUpdatePassword = [
  body('new_password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain at least one special character')
];

// Update password endpoint
app.post('/api/update-password', validateUpdatePassword, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        param: err.path,
        message: err.msg
      }))
    });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }

  let connection;
  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    connection = await pool.promise().getConnection();
    await connection.beginTransaction();

    // Validate token
    const [tokenRows] = await connection.execute(
      `SELECT user_id FROM active_tokens 
       WHERE token_id = ? AND expires_at > NOW()
       FOR UPDATE`,
      [decoded.jti]
    );

    if (tokenRows.length === 0) {
      await connection.rollback();
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user
    const [userRows] = await connection.execute(
      'SELECT id FROM users WHERE emp_id = ?',
      [decoded.emp_id]
    );

    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(req.body.new_password, 12);
    await connection.execute(
      `UPDATE users 
       SET password = ?, otp_secret = NULL, otp_expiry = NULL
       WHERE id = ?`,
      [hashedPassword, userRows[0].id]
    );

    // Remove token
    await connection.execute(
      'DELETE FROM active_tokens WHERE token_id = ?',
      [decoded.jti]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    if (connection) await connection.rollback();

    console.error('Password Update Error:', error);

    const response = {
      success: false,
      message: 'Password update failed'
    };

    if (error instanceof jwt.JsonWebTokenError) {
      response.message = 'Invalid token';
    } else if (error instanceof jwt.TokenExpiredError) {
      response.message = 'Token expired';
    }

    res.status(error.statusCode || 500).json(response);
  } finally {
    if (connection) connection.release();
  }
});

// Security headers middleware (in production)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});


{/*------Customerlogin------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */ }


// POST /api/Customerlogin
app.post("/api/Customerlogin", Customerlogin);

// GET /api/getCustomerProfile
app.get("/api/get/CustomerProfile", verifyToken, getCustomerProfile);




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Real-Time Connection with Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Optional: Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
