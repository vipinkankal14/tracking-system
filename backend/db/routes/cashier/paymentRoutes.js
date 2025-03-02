const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
 

// Function to handle payment insertion and balance update
const handlePayment = async (req, res) => {
  const { debitedAmount, creditedAmount, customerId, paymentType, transactionType } = req.body;
  const paymentDate = new Date();

  try {
    // Check if customer exists
    const customerExistsQuery = `SELECT customerId FROM customers WHERE customerId = ?`;
    const [customerExists] = await pool.query(customerExistsQuery, [customerId]);

    if (!customerExists.length) {
      return res.status(404).json({ error: "Customer does not exist." });
    }

    // Variable to store the payment status
    let paymentStatus;

    // Handle debit transaction
    if (debitedAmount) {
      const debitPaymentQuery = `
        INSERT INTO cashier (debitedAmount, customerId, paymentDate, transactionType, paymentType) 
        VALUES (?, ?, ?, ?, ?)`;
      await pool.query(debitPaymentQuery, [
        debitedAmount,
        customerId,
        paymentDate,
        "Debit", // Hardcoded as "Debit" for debit transactions
        paymentType,
      ]);

      const updateDebitedBalanceQuery = `
        UPDATE invoice_summary 
        SET customer_account_balance = customer_account_balance - ? 
        WHERE customerId = ?`;
      await pool.query(updateDebitedBalanceQuery, [debitedAmount, customerId]);
    }

    // Handle credit transaction (including exchangeCredit and financeCredit)
    if (creditedAmount) {
  const fetchCustomerDetailsQuery = `
    SELECT customer_account_balance, grand_total 
    FROM invoice_summary 
    WHERE customerId = ?`;
  const [customerDetails] = await pool.query(fetchCustomerDetailsQuery, [customerId]);

  if (customerDetails.length === 0) {
    return res.status(404).json({ error: "Customer not found in invoice summary." });
  }

  const { customer_account_balance, grand_total } = customerDetails[0];
  const currentBalance = customer_account_balance; // Current balance before credit
  const requiredPayment = grand_total - currentBalance; // Remaining amount to reach total price

  // Check if any payment is required
  if (requiredPayment <= 0) {
    return res.status(400).json({
      error: "Total on-road price is already covered. Extra payment is not accepted.",
    });
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
    transactionType, // Use the transactionType from the request body
    paymentType,
  ]);

  const updateCreditedBalanceQuery = `
    UPDATE invoice_summary 
    SET customer_account_balance = customer_account_balance + ? 
    WHERE customerId = ?`;
  await pool.query(updateCreditedBalanceQuery, [adjustedCreditedAmount, customerId]);
}

    // Fetch updated customer details to check payment status
    const updatedCustomerDetailsQuery = `
      SELECT customer_account_balance, grand_total 
      FROM invoice_summary 
      WHERE customerId = ?`;
    const [updatedCustomerDetails] = await pool.query(updatedCustomerDetailsQuery, [customerId]);

    if (updatedCustomerDetails.length === 0) {
      return res.status(404).json({ error: "Customer details not found after payment processing." });
    }

    const { customer_account_balance, grand_total } = updatedCustomerDetails[0];

    // Determine payment status
    paymentStatus = customer_account_balance >= grand_total ? "Paid" : "Unpaid";

    // Update the payment_status in the database
    const updatePaymentStatusQuery = `
      UPDATE invoice_summary 
      SET payment_status = ? 
      WHERE customerId = ?`;
    await pool.query(updatePaymentStatusQuery, [paymentStatus, customerId]);

    // Send success response
    res.status(200).json({
      message: "Payment processed successfully!",
      payment_status: paymentStatus,
      customer_details: {
        customerId,
        paymentDate,
        debitedAmount: debitedAmount || 0,
        creditedAmount: creditedAmount || 0,
        customer_account_balance,
        grand_total,
      },
    });
  } catch (err) {
    console.error("Error processing payment:", err.message);
    res.status(500).json({ error: "Error processing payment." });
  }
};


// Function to fetch a specific customer by ID {setp 1}
const getCustomerById = async (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT *
FROM customers c
LEFT JOIN carbooking cb ON c.customerId = cb.customerId
LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
WHERE c.customerId = ?
  `;

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
  const query = `
  SELECT *
FROM customers c
LEFT JOIN carbooking cb ON c.customerId = cb.customerId
LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId;
`;

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
