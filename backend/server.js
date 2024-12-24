const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();  // Load environment variables from .env

const port = process.env.PORT || 5000; // Use the PORT from the .env file, default to 5000

// Middleware
app.use(cors());
app.use(express.json());

// Import the payment function from the paymentRoutes file
const { handlePayment, getAllCashierTransactions, getAllCustomers } = require('./db/routes/cashier/paymentRoutes');

 
// Use the payment routes
app.post('/api/payment', handlePayment);

app.get('/api/customers', getAllCustomers);

app.get('/api/cashier/all', getAllCashierTransactions); 


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
