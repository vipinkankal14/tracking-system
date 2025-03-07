const { pool } = require('./db/databaseConnection/mysqlConnection');

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors');

const http = require('http'); // For creating the HTTP server
const { Server } = require('socket.io'); // For real-time updates
require('dotenv').config(); // Load environment variables from .env


const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, { cors: { origin: '*' } }); // Initialize Socket.IO

const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase limit for large file uploads




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
 
/* app.get('/api/cashier/all', getAllCashierTransactions); */

// Use the payment routes
app.get('/api/getAllAccountManagementRefund', getAllAccountManagementRefund);
app.get('/api/ACMApprovedRejected', ACMApprovedRejected);
app.get('/api/customers', getAllCustomers); //frontend\src\cashier\Payments\PaymentPending.jsx //frontend\src\cashier\CarBooking\CarBookings.jsx // frontend\src\cashier\CarBookingCancel\CarBookingCancel.jsx // frontend\src\cashier\CustomerPaymentDetails\CustomerPaymentDetails.jsx // frontend\src\cashier\Payments\PaymentClear.jsx
app.get("/api/customers/:id", getCustomerById); // frontend\src\cashier\Payments\Payment.jsx
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
  const { customerId, totalAmount,products } = req.body;

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



{/*-------------------------------------------------------------------- */}

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

{/*-------------------------------------------------------------------- */}


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

{/*-------------------------------------------------------------------- */}

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
app.post("/api/submitAutoCardRequest",postAutoCardRequest);



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
  const status = 'cancel';
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
    const [invoicesummary] = await pool.promise().query('SELECT * FROM invoice_summary WHERE customerId = ?', [customerId]);
    const [ordersprebookingdate] = await pool.promise().query('SELECT * FROM orders_prebooking_date WHERE customerId = ?', [customerId]);

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
      onRoadPriceDetails: onRoadPriceDetails[0], // Assuming one entry per invoice
      additionalCharges: additionalCharges[0],
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


app.put('/api/refund/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, refundReason, refundAmount } = req.body;

  // Check if the customerId exists in account_management_refund
  const checkSql = `SELECT * FROM account_management_refund WHERE customerId = ?`;

  pool.query(checkSql, [customerId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error:", checkErr);
      return res.status(500).json({ error: checkErr.message });
    }

    if (checkResult.length === 0) {
      // CustomerId not found: Insert a new record
      const insertSql = `
        INSERT INTO account_management_refund 
        (customerId, status, refundReason, refundAmount) 
        VALUES (?, ?, ?, ?)
      `;
      pool.query(
        insertSql,
        [customerId, status, refundReason, refundAmount],
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
        UPDATE account_management_refund
        SET 
          refundAmount = ?,
          refundReason = ?,
          status = ?
        WHERE customerId = ?
      `;
      pool.query(
        updateSql,
        [refundAmount, refundReason, status, customerId],
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


 
// showexchange

app.use('/uploads', express.static(path.join(__dirname, 'CarExchangeRequest')));
app.get('/api/showexchange', showexchange);

// update car exchange request status

app.put('/api/exchange/update-status/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { status, exchangeReason , exchangeAmount  } = req.body;

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
        [customerId, status, exchangeReason , exchangeAmount ],
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
        [exchangeAmount , exchangeReason, status, customerId],
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
  const { status, exchangeReason} = req.body;

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
        [customerId, status, exchangeReason ],
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
        [ exchangeReason, status, customerId],
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
  const { status, financeReason , financeAmount  } = req.body;

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
        [customerId, status, financeReason , financeAmount ],
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
        [financeAmount , financeReason, status, customerId],
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
  const { status, financeReason} = req.body;

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
        [customerId, status, financeReason ],
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
        [ financeReason, status, customerId],
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
  const { status  } = req.body;

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
        [customerId, status ],
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
  const { status, insuranceReason   } = req.body;

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
        [customerId, status, insuranceReason  ],
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
        [ insuranceReason, status, customerId],
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
  const { status  } = req.body;

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
        [customerId, status ],
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
        [customerId, status, fasttagReason  ],
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
        [ fasttagReason, status, customerId],
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
