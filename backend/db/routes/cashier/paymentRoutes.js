const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
 

// Function to handle payment insertion and balance update
const handlePayment = async (req, res) => {
  const { debitedAmount, creditedAmount, customerId, paymentType } = req.body;
  const paymentDate = new Date(); // Automatically sets the current date and time
  const paymentTypeDebit = "Debit"; // Payment type for debit transactions
  const paymentTypeCredit = "Credit"; // Payment type for credit transactions

  try {
    // Check if customerId exists
    const customerExistsQuery = `SELECT customerId FROM customers WHERE customerId = ?`;
    const [customerExists] = await pool.query(customerExistsQuery, [customerId]);

    if (!customerExists.length) {
      return res.status(404).json({ error: 'Customer does not exist.' });
    }

    // If debitedAmount is provided, process a debit transaction
    if (debitedAmount) {
      const debitPaymentQuery = `
        INSERT INTO cashier (debitedAmount, userpayment_id, paymentDate,transactionType ,paymentType) 
        VALUES (?, ?, ?, ?, ?)`; 
      await pool.query(debitPaymentQuery, [debitedAmount, customerId, paymentDate,paymentTypeDebit,paymentType]);
 
      const updateDebitedBalanceQuery = `
        UPDATE customers 
        SET customer_account_balance = customer_account_balance - ? 
        WHERE customerId = ?`;
      await pool.query(updateDebitedBalanceQuery, [debitedAmount, customerId]);
    }

    // If creditedAmount is provided, process a credit transaction
    if (creditedAmount) {
      const creditPaymentQuery = `
        INSERT INTO cashier (creditedAmount, userpayment_id, paymentDate,transactionType,paymentType) 
        VALUES (?, ?, ?, ?, ?)`;
      await pool.query(creditPaymentQuery, [creditedAmount, customerId, paymentDate , paymentTypeCredit,paymentType]);

      const updateCreditedBalanceQuery = `
        UPDATE customers 
        SET customer_account_balance = customer_account_balance + ? 
        WHERE customerId = ?`;
      await pool.query(updateCreditedBalanceQuery, [creditedAmount, customerId]);
    }

    res.status(200).json({ message: 'Payment processed successfully!' });
  } catch (err) {
    console.error('Error processing payment:', err.message);
    res.status(500).json({ error: 'Error processing payment.' });
  }
};

// Function to fetch a specific customer by ID
const getCustomerById = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM customers WHERE customerId = ?';

  try {
    const [result] = await pool.query(query, [id]);

    if (result.length > 0) {
      res.status(200).json(result[0]); // Send the specific customer data as JSON
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ error: 'Error fetching customer' });
  }
};

 
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
 
// Use async/await instead of callback functions
const getAllCashierTransactions = async (req, res) => {
  try {
    // Query the database for all cashier transactions
    const [rows] = await pool.query('SELECT * FROM cashier');
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
  getCustomerById
};
