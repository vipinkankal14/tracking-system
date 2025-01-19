const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
 

// Function to handle payment insertion and balance update
const handlePayment = async (req, res) => {
  const { debitedAmount, creditedAmount, customerId, paymentType } = req.body;
  const paymentDate = new Date();
  const paymentTypeDebit = "Debit";
  const paymentTypeCredit = "Credit";

  try {
    // Check if customer exists
    const customerExistsQuery = `SELECT customerId FROM customers WHERE customerId = ?`;
    const [customerExists] = await pool.query(customerExistsQuery, [customerId]);

    if (!customerExists.length) {
      return res.status(404).json({ error: "Customer does not exist." });
    }

    if (debitedAmount) {
      // Handle debit
      const debitPaymentQuery = `
        INSERT INTO cashier (debitedAmount, customerId, paymentDate, transactionType, paymentType) 
        VALUES (?, ?, ?, ?, ?)`;
      await pool.query(debitPaymentQuery, [
        debitedAmount,
        customerId,
        paymentDate,
        paymentTypeDebit,
        paymentType,
      ]);

      const updateDebitedBalanceQuery = `
        UPDATE customers 
        SET customer_account_balance = customer_account_balance - ? 
        WHERE customerId = ?`;
      await pool.query(updateDebitedBalanceQuery, [debitedAmount, customerId]);
    }

    if (creditedAmount) {
      // Handle credit
      const fetchCustomerDetailsQuery = `
        SELECT customer_account_balance, total_onroad_price 
        FROM customers 
        WHERE customerId = ?`;
      
      const [customerDetails] = await pool.query(fetchCustomerDetailsQuery, [customerId]);
    
      if (customerDetails.length === 0) {
        return res.status(404).json({ error: "Customer not found." });
      }
    
      const { customer_account_balance, total_onroad_price } = customerDetails[0];
      const currentBalance = customer_account_balance; // current balance before credit
      const requiredPayment = total_onroad_price - currentBalance; // remaining amount to reach total price
    
      // Check if any payment is required
      if (requiredPayment <= 0) {
        return res
          .status(400)
          .json({ error: "Total on-road price is already covered. Extra payment is not accepted." });
      }
    
      // Calculate adjusted credited amount
      const adjustedCreditedAmount = Math.min(creditedAmount, requiredPayment);
    
      // If adjusted credited amount is less than credited amount, inform the user
      if (adjustedCreditedAmount < creditedAmount) {
        return res.status(400).json({
          error: `Only ${adjustedCreditedAmount} can be credited, as the total on-road price is already covered by the current balance.`,
        });
      }
    
      // Proceed with the credit operation
      const creditPaymentQuery = `
        INSERT INTO cashier (creditedAmount, customerId, paymentDate, transactionType, paymentType) 
        VALUES (?, ?, ?, ?, ?)`;
      
      await pool.query(creditPaymentQuery, [
        adjustedCreditedAmount,
        customerId,
        paymentDate,
        paymentTypeCredit,
        paymentType,
      ]);
    
      const updateCreditedBalanceQuery = `
        UPDATE customers 
        SET customer_account_balance = customer_account_balance + ? 
        WHERE customerId = ?`;
      
      await pool.query(updateCreditedBalanceQuery, [adjustedCreditedAmount, customerId]);
    
      return res.status(200).json({ message: `Successfully credited ${adjustedCreditedAmount}.` });
    }
    
    res.status(200).json({ message: "Payment processed successfully!" });
  } catch (err) {
    console.error("Error processing payment:", err.message);
    res.status(500).json({ error: "Error processing payment." });
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
