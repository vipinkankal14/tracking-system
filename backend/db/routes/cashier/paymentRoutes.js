const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
 

// Function to handle payment insertion and balance update
const handlePayment = async (req, res) => {
  const { debitedAmount, userId } = req.body;

  try {
    // Insert payment record into management_Cashier table
    const paymentQuery = 'INSERT INTO management_Cashier (debitedAmount, status, user_id) VALUES (?, ?, ?)';
    await pool.query(paymentQuery, [debitedAmount, 'Pending', userId]);

    // Update the customer account balance
    const updateBalanceQuery = 'UPDATE customers SET accountBalance = accountBalance - ? WHERE id = ?';
    await pool.query(updateBalanceQuery, [debitedAmount, userId]);

    res.status(200).json({ message: 'Payment processed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to handle fetching all customers
// Function to fetch all customers
const getAllCustomers = async (req, res) => {
  const query = 'SELECT * FROM customers';

  try {
    // Use await to get the results of the query
    const [results] = await pool.query(query);
    
    res.json(results);  // Send the customer data as JSON
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Error fetching customers' });
  }
};


// Function to handle fetching all cashier transactions

// Use async/await instead of callback functions
const getAllCashierTransactions = async (req, res) => {
  try {
    // Query the database for all cashier transactions
    const [rows] = await pool.query('SELECT * FROM management_Cashier');
    res.status(200).json(rows); // Send the result as JSON
  } catch (error) {
    console.error('Error fetching cashier transactions:', error);
    res.status(500).json({ error: 'Error fetching cashier transactions' });
  }
};

// Export the function via module.exports
module.exports = {
  handlePayment,
  getAllCustomers,
  getAllCashierTransactions,
};
