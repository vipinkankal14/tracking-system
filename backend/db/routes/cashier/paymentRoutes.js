const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
 

// Function to handle payment insertion and balance update
const handlePayment = async (req, res) => {
  const { debitedAmount, creditedAmount, userId } = req.body;
  const paymentDate = new Date(); // Automatically sets the current date and time
  const paymentTypeDebit = "Debit"; // Payment type for debit transactions
  const paymentTypeCredit = "Credit"; // Payment type for credit transactions

  try {
    // If debitedAmount is provided, process a debit transaction
    if (debitedAmount) {
      // Insert payment record for debit into management_Cashier table
      const debitPaymentQuery = `
        INSERT INTO management_Cashier (debitedAmount, userpayment_id, paymentDate, paymentType) 
        VALUES (?, ?, ?, ?)`;
      await pool.query(debitPaymentQuery, [debitedAmount, userId, paymentDate, paymentTypeDebit]);

      // Update the customer account balance for debit
      const updateDebitedBalanceQuery = `
        UPDATE customers 
        SET accountBalance = accountBalance - ? 
        WHERE id = ?`;
      await pool.query(updateDebitedBalanceQuery, [debitedAmount, userId]);
    }

    // If creditedAmount is provided, process a credit transaction
    if (creditedAmount) {
      // Insert payment record for credit into management_Cashier table
      const creditPaymentQuery = `
        INSERT INTO management_Cashier (creditedAmount, userpayment_id, paymentDate, paymentType) 
        VALUES (?, ?, ?, ?)`;
      await pool.query(creditPaymentQuery, [creditedAmount, userId, paymentDate, paymentTypeCredit]);

      // Update the customer account balance for credit
      const updateCreditedBalanceQuery = `
        UPDATE customers 
        SET accountBalance = accountBalance + ? 
        WHERE id = ?`;
      await pool.query(updateCreditedBalanceQuery, [creditedAmount, userId]);
    }

    res.status(200).json({ message: 'Payment processed successfully!' });
  } catch (err) {
    console.error('Error processing payment:', err.message);
    res.status(500).json({ error: 'Error processing payment.' });
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
    const [rows] = await pool.query('SELECT * FROM management_Cashier');
    res.status(200).json(rows); // Send the result as JSON
  } catch (error) {
    console.error('Error fetching cashier transactions:', error);
    res.status(500).json({ error: 'Error fetching cashier transactions' });
  }
};


// Function to fetch a specific customer by ID
const getCustomerById = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM customers WHERE id = ?';

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


// Export the function via module.exports
module.exports = {
  handlePayment,
  getAllCustomers,
  getAllCashierTransactions,
  getCustomerById
};
