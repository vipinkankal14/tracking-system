const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');


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

       // Update the customer's account balance in the invoice_summary table
      const updateDebitedBalanceQuery = `
        UPDATE invoice_summary 
        SET grand_total = grand_total - ?, 
            customer_account_balance = customer_account_balance - ? 
        WHERE customerId = ?`;
      await pool.query(updateDebitedBalanceQuery, [debitedAmount, debitedAmount, customerId]);
    }

    // Handle credit transaction
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

      // Format the adjusted credited amount to 2 decimal places
      const formattedCreditedAmount = parseFloat(adjustedCreditedAmount.toFixed(2));

      // If adjusted credited amount is less than credited amount, inform the user
      if (formattedCreditedAmount < creditedAmount) {
        return res.status(400).json({
          error: `Only ${formattedCreditedAmount} can be credited, as the total on-road price is already covered by the current balance.`,
        });
      }

      // Proceed with the credit operation
      const creditPaymentQuery = `
      INSERT INTO cashier (creditedAmount, customerId, paymentDate, transactionType, paymentType) 
      VALUES (?, ?, ?, ?, ?)`;
      await pool.query(creditPaymentQuery, [
        formattedCreditedAmount,
        customerId,
        paymentDate,
        transactionType, // Use the transactionType from the request body
        paymentType,
      ]);

      const updateCreditedBalanceQuery = `
      UPDATE invoice_summary 
      SET customer_account_balance = customer_account_balance + ? 
      WHERE customerId = ?`;
      await pool.query(updateCreditedBalanceQuery, [formattedCreditedAmount, customerId]);
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
    const paymentStatus = customer_account_balance >= grand_total ? "Paid" : "Unpaid";

    // Update the payment_status in the database
    const updatePaymentStatusQuery = `
      UPDATE invoice_summary 
      SET payment_status = ? 
      WHERE customerId = ?`;
    await pool.query(updatePaymentStatusQuery, [paymentStatus, customerId]);

    // Update the account_management status to 'pending' if payment is successful
    const updateAccountStatusQuery = `
      UPDATE account_management 
      SET status = 'pending' 
      WHERE customerId = ?`;
    await pool.query(updateAccountStatusQuery, [customerId]);

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
    SELECT 
      c.*,
      cb.*,
      inv.*,
      ai.*,
      -- Include exchange data if exchange is 'Yes'
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.rcDocument
        ELSE NULL
      END AS rcDocument,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.insurancePolicy
        ELSE NULL
      END AS insurancePolicy,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.pucCertificate
        ELSE NULL
      END AS pucCertificate,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.identityProof
        ELSE NULL
      END AS identityProof,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.addressProof
        ELSE NULL
      END AS addressProof,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.loanClearance
        ELSE NULL
      END AS loanClearance,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.serviceHistory
        ELSE NULL
      END AS serviceHistory,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.carOwnerFullName
        ELSE NULL
      END AS carOwnerFullName,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.carMake
        ELSE NULL
      END AS carMake,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.carModel
        ELSE NULL
      END AS carModel,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.carColor
        ELSE NULL
      END AS carColor,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.carRegistration
        ELSE NULL
      END AS carRegistration,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.carYear
        ELSE NULL
      END AS carYear,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.exchangeAmount
        ELSE NULL
      END AS exchangeAmount,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.exchangeReason
        ELSE NULL
      END AS exchangeReason,
      CASE 
        WHEN ai.exchange = 'Yes' THEN cer.status
        ELSE NULL
      END AS exchangeStatus,
      -- Include loan data if finance is 'Yes'
      CASE 
        WHEN ai.finance = 'Yes' THEN l.loan_amount
        ELSE NULL
      END AS loan_amount,
      CASE 
        WHEN ai.finance = 'Yes' THEN l.interest_rate
        ELSE NULL
      END AS interest_rate,
      CASE 
        WHEN ai.finance = 'Yes' THEN l.loan_duration
        ELSE NULL
      END AS loan_duration,
      CASE 
        WHEN ai.finance = 'Yes' THEN l.calculated_emi
        ELSE NULL
      END AS calculated_emi,
       CASE 
        WHEN ai.finance = 'Yes' THEN l.status
        ELSE NULL
      END AS financestatus,
      CASE 
        WHEN ai.finance = 'Yes' THEN l.financeReason
        ELSE NULL
      END AS financeReason
      
    FROM customers c
    LEFT JOIN carbooking cb ON c.customerId = cb.customerId
    LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
    LEFT JOIN additional_info ai ON c.customerId = ai.customerId
    LEFT JOIN car_exchange_requests cer ON c.customerId = cer.customerId
    LEFT JOIN loans l ON c.customerId = l.customerId
    WHERE c.customerId = ?
  `;

  try {
    const [result] = await pool.query(query, [id]);

    if (result.length > 0) {
      const customerData = result[0];

      // Transform the result into a nested structure
      const response = {
        ...customerData,
        carExchangeRequests: customerData.exchange === 'Yes' ? {
          rcDocument: customerData.rcDocument,
          insurancePolicy: customerData.insurancePolicy,
          pucCertificate: customerData.pucCertificate,
          identityProof: customerData.identityProof,
          addressProof: customerData.addressProof,
          loanClearance: customerData.loanClearance,
          serviceHistory: customerData.serviceHistory,
          carOwnerFullName: customerData.carOwnerFullName,
          carMake: customerData.carMake,
          carModel: customerData.carModel,
          carColor: customerData.carColor,
          carRegistration: customerData.carRegistration,
          carYear: customerData.carYear,
          exchangeAmount: customerData.exchangeAmount,
          exchangeReason: customerData.exchangeReason,
          status: customerData.exchangeStatus
        } : null,
      loans: customerData.finance === 'Yes' ? {
          loan_amount: customerData.loan_amount,
          interest_rate: customerData.interest_rate,
          loan_duration: customerData.loan_duration,
          calculated_emi: customerData.calculated_emi,
          financeReason: customerData.financeReason,
          financestatus : customerData.financestatus
        } : null
      };

      res.status(200).json(response); // Send the transformed customer data as JSON
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
    left JOIN account_management ac ON c.customerId = ac.customerId
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

  


// Function to fetch all customers
const ACMApprovedRejected = async (req, res) => {
  const query = `
      SELECT *
    FROM customers c
    LEFT JOIN carbooking cb ON c.customerId = cb.customerId
    LEFT JOIN account_management inv ON c.customerId = inv.customerId;
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


// Export the function via module.exports
module.exports = {
  handlePayment,
  getAllCustomers,
  getAllCashierTransactions,
  getCustomerById,
  ACMApprovedRejected
};
