const express = require('express');
const cors = require('cors');
const app = express();

const { pool } = require('./db/databaseConnection/mysqlConnection');

 

require('dotenv').config();  // Load environment variables from .env

const port = process.env.PORT || 5000; // Use the PORT from the .env file, default to 5000

// Middleware
app.use(cors());
app.use(express.json());


// Import the payment function from the paymentRoutes file
const { handlePayment, getAllCashierTransactions, getAllCustomers, getCustomerById } = require('./db/routes/cashier/paymentRoutes');
const { addCarStock } = require('./db/routes/carStocks/addcar');
const { ShowCarStock, ShowCarStockWithCustomers } = require('./db/routes/carStocks/showcar');
const { updateDiscount, updateDiscountForCriteria } = require('./db/routes/carStocks/discount');
      
 
// Use the payment routes
app.post('/api/payments', handlePayment);
app.get('/api/customers', getAllCustomers);
app.get('/api/cashier/all', getAllCashierTransactions); 
app.get("/api/customers/:id", getCustomerById);
app.use('/api/CarStock', addCarStock);
app.get('/api/showAllCarStocks', ShowCarStock);
app.get('/api/ShowCarStockWithCustomers', ShowCarStockWithCustomers);
app.post('/api/updateDiscount', updateDiscount);
app.post('/api/discountForCriteria', updateDiscountForCriteria);

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
          c.rto_tax,
          c.fast_tag,
          c.insurance,
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
          c.customerId = ?;  -- Filter by customerId
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



 // API to get customer details by customerId
/*
app.get('/api/customers/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM customers WHERE customerId = ?';
  pool.query(query, [customerId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Customer not found');
    res.json(result[0]);
  });
});
*/




// API endpoint to get car data by VIN
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

 

// Express route to update car allotment status
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




// Get all cars with filters
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

// Update discount for selected cars
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




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
