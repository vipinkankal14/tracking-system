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
const { updateDiscount } = require('./db/routes/carStocks/discount');
      
 
// Use the payment routes
app.post('/api/payments', handlePayment);
app.get('/api/customers', getAllCustomers);
app.get('/api/cashier/all', getAllCashierTransactions); 
app.get("/api/customers/:id", getCustomerById);
app.use('/api/CarStock', addCarStock);
app.get('/api/showAllCarStocks', ShowCarStock);
app.get('/api/ShowCarStockWithCustomers', ShowCarStockWithCustomers);
app.post('/api/updateDiscount', updateDiscount);

 

 // API to get customer details
app.get('/api/customer/:customerId', (req, res) => {
  const { customerId } = req.params;
  const query = 'SELECT * FROM customers WHERE customerId = ?';
  pool.query(query, [customerId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Customer not found');
    res.json(result[0]);
  });
});

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







app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
