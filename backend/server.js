const express = require('express');
const cors = require('cors');
const app = express();

 

require('dotenv').config();  // Load environment variables from .env

const port = process.env.PORT || 5000; // Use the PORT from the .env file, default to 5000

// Middleware
app.use(cors());
app.use(express.json());

// Import the payment function from the paymentRoutes file
const { handlePayment, getAllCashierTransactions, getAllCustomers, getCustomerById } = require('./db/routes/cashier/paymentRoutes');
const { addCarStock } = require('./db/routes/carStocks/addcar');
  
 
// Use the payment routes
app.post('/api/payments', handlePayment);

app.get('/api/customers', getAllCustomers);

app.get('/api/cashier/all', getAllCashierTransactions); 

// Assuming you already have a connection to MySQL
app.get("/api/customers/:id", getCustomerById);


app.use('/api/CarStock', addCarStock);
 


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
