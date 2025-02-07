const express = require('express');
const cors = require('cors');
const http = require('http'); // For creating the HTTP server
const { Server } = require('socket.io'); // For real-time updates
require('dotenv').config(); // Load environment variables from .env

const { pool } = require('./db/databaseConnection/mysqlConnection');
 
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, { cors: { origin: '*' } }); // Initialize Socket.IO

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

 



// Import the payment function from the paymentRoutes file
const { handlePayment, getAllCustomers, getCustomerById } = require('./db/routes/cashier/paymentRoutes');
const { addCarStock } = require('./db/routes/carStocks/addcar');
const { ShowCarStock, ShowCarStockWithCustomers } = require('./db/routes/carStocks/showcar');
const { addAccessory, getAllAccessories } = require('./db/routes/accessories_store/store');
const { getCustomerOrders } = require('./db/routes/userModal/user');
 
/* app.get('/api/cashier/all', getAllCashierTransactions); */ 
 
// Use the payment routes
app.post('/api/payments', handlePayment); // frontend\src\cashier\Payments\PaymentDetails.jsx
app.get('/api/customers', getAllCustomers); //frontend\src\cashier\Payments\PaymentPending.jsx //frontend\src\cashier\CarBooking\CarBookings.jsx // frontend\src\cashier\CarBookingCancel\CarBookingCancel.jsx // frontend\src\cashier\CustomerPaymentDetails\CustomerPaymentDetails.jsx // frontend\src\cashier\Payments\PaymentClear.jsx
app.get("/api/customers/:id", getCustomerById); // frontend\src\cashier\Payments\Payment.jsx
app.use('/api/CarStock', addCarStock); //carStocks\AddCarStock.jsx
app.get('/api/showAllCarStocks', ShowCarStock); // frontend\src\carStocks\CarAllotmentByCustomer.jsx // frontend\src\components\AdditionalDetails.jsx
app.get('/api/showAllCarStocksWithCustomers', ShowCarStockWithCustomers); 
app.post('/api/addAccessory', addAccessory); //frontend\src\Accessories\AddedUploadView\Store\AccessoriesTable.jsx
app.get('/api/getAllAccessories', getAllAccessories); // frontend\src\carStocks\CarAllotmentByCustomer.jsx // frontend\src\components\AdditionalDetails.jsx
app.get('/orders/:customerId', getCustomerOrders);

app.post('/api/submitCart', (req, res) => {
  const { customerId, totalAmount, products } = req.body;

  console.log("Received cart data:", req.body); // Log received data

  if (!customerId || !Array.isArray(products)) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  // First, delete the products associated with the customer order
  const deleteProductsQuery = `
    DELETE FROM order_products WHERE orderId IN (
      SELECT id FROM orders WHERE customerId = ?
    );
  `;

  pool.query(deleteProductsQuery, [customerId], (err) => {
    if (err) {
      console.error("Error deleting old products:", err);
      return res.status(500).json({ message: "Error deleting old products." });
    }

    // Then, delete the order itself
    const deleteOrderQuery = `
      DELETE FROM orders WHERE customerId = ?;
    `;

    pool.query(deleteOrderQuery, [customerId], (err) => {
      if (err) {
        console.error("Error deleting order:", err);
        return res.status(500).json({ message: "Error deleting order." });
      }

      const insertOrderQuery = `INSERT INTO orders (customerId, totalAmount) VALUES (?, ?)`;
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

app.post('/api/submitCoatingRequest', (req, res) => {
  console.log("Request Body:", req.body);

  const { customerId, coatingType, preferredDate, preferredTime, additionalNotes } = req.body;

  if (!customerId) {
    return res.status(400).json({ message: 'Customer ID is required' });
  }

  // First, check if a request with the same customerId already exists
  const checkDuplicateQuery = 'SELECT * FROM coating_requests WHERE customerId = ?';
  
  pool.query(checkDuplicateQuery, [customerId], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate coating request:', err);
      return res.status(500).json({ message: 'Error checking for duplicate coating request' });
    }

    if (results.length > 0) {
      // If a duplicate is found, return an error response
      return res.status(409).json({ message: 'Duplicate coating request detected. A request with this Customer already exists.' });
    }

    // If no duplicate is found, proceed to insert the new request
    const insertQuery = `
      INSERT INTO coating_requests (customerId, coatingType, preferredDate, preferredTime, additionalNotes)
      VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(insertQuery, [customerId, coatingType, preferredDate, preferredTime, additionalNotes], (err, results) => {
      if (err) {
        console.error('Error inserting coating request:', err);
        return res.status(500).json({ message: 'Error submitting coating request' });
      }
      res.status(200).json({ message: 'Coating request submitted successfully', requestId: results.insertId });
    });
  });
});


// Endpoint to save loan and document details
app.post('/api/loans', (req, res) => {
  const { customerId, loanAmount, interestRate, loanDuration, calculatedEMI, employedType, uploadedFiles } = req.body;

  // Insert into loans table
  const loanQuery = 'INSERT INTO loans (customerId, loan_amount, interest_rate, loan_duration, calculated_emi) VALUES (?, ?, ?, ?, ?)';
  pool.query(loanQuery, [customerId, loanAmount, interestRate, loanDuration, calculatedEMI], (err, result) => {
    if (err) throw err;

    const loanId = result.insertId;

    // Insert into customer_documents table
    const documentQueries = Object.keys(uploadedFiles).map(doc => {
      return new Promise((resolve, reject) => {
        const docQuery = 'INSERT INTO customer_documents (loan_id, employed_type, document_name, uploaded_file_name) VALUES (?, ?, ?, ?)';
        pool.query(docQuery, [loanId, employedType, doc, uploadedFiles[doc]], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });

    Promise.all(documentQueries)
      .then(() => res.status(200).send('Loan and documents saved successfully'))
      .catch(err => res.status(500).send(err));
  });
});



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
app.get('/api/PaymentHistory/:customerId', (req, res) => {
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
  const query = 'SELECT * FROM customers WHERE customerId = ?';

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
  const { customerId, allotmentCarStatus } = req.body;  // Get both customerId and allotmentCarStatus from request body

  // SQL query to update both customerId and allotmentCarStatus
  const query = 'UPDATE carstocks SET customerId = ?, allotmentCarStatus = ? WHERE vin = ?';

  pool.query(query, [customerId, allotmentCarStatus, vin], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating car stock' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Car stock updated successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  });
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
