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

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Customer ID is required'
    });
  }

  const query = `
    SELECT 
    c.customerId,
    c.firstName,
    c.middleName,
    c.lastName,
    c.email,
    c.mobileNumber1,
    c.mobileNumber2,
    c.country,
    c.address,
    c.city,
    c.state,
    c.createdAt AS customer_created,
    c.updatedAt AS customer_updated,
    
    -- Loan information
    l.id AS loan_id,
    l.loan_amount,
    l.interest_rate,
    l.loan_duration,
    l.status AS loan_status,
    l.financeReason,
    l.financeAmount,
    l.calculated_emi,
    l.createdAt AS loan_created,
    l.updatedAt AS loan_updated,
    
    -- Document information
    d.id AS document_id,
    d.employed_type,
    d.document_name,
    d.uploaded_file AS document_path,
    d.uploaded_at AS document_uploaded,
    
    -- Car booking information
    cb.model,
    cb.version,
    cb.color,
    cb.carType,
    cb.exShowroomPrice,
    cb.bookingAmount,
    cb.bookingType,
    cb.createdAt AS car_booking_created,
    
    -- Car exchange information
    cer.id AS exchange_id,
    cer.rcDocument,
    cer.insurancePolicy,
    cer.pucCertificate,
    cer.identityProof,
    cer.addressProof,
    cer.loanClearance,
    cer.serviceHistory,
    cer.carOwnerFullName,
    cer.carMake,
    cer.carModel,
    cer.carColor,
    cer.carRegistration,
    cer.carYear,
    cer.status AS exchange_status,
    cer.exchangeAmount,
    cer.exchangeReason,
    cer.createdAt AS exchange_created,
    cer.updatedAt AS exchange_updated,

           inv.invoice_id,
              inv.invoice_date,
              inv.due_date,
              inv.total_on_road_price,
              inv.total_charges,
              inv.grand_total AS invoice_grand_total,
              inv.payment_status,
              inv.customer_account_balance,

    adi.finance,
    adi.exchange
    
    FROM customers c

                LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId


    -- Join additional_info first
    LEFT JOIN additional_info adi ON c.customerId = adi.customerId

    -- Then join loans with the finance condition
    LEFT JOIN loans l ON c.customerId = l.customerId AND adi.finance = 'Yes'

    -- Then join documents
    LEFT JOIN customer_documents d ON l.id = d.loan_id

    -- Join other tables
    LEFT JOIN carbooking cb ON c.customerId = cb.customerId
    LEFT JOIN car_exchange_requests cer ON c.customerId = cer.customerId AND adi.exchange = 'Yes'

    WHERE c.customerId = ?
  `;

  try {
    const [results] = await pool.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Process results into structured format
    const customerData = {
      customerId: results[0].customerId,
      firstName: results[0].firstName,
      middleName: results[0].middleName,
      lastName: results[0].lastName,
      email: results[0].email,
      mobileNumbers: [
        results[0].mobileNumber1,
        results[0].mobileNumber2
      ].filter(Boolean),
      createdAt: results[0].customer_created,
      updatedAt: results[0].customer_updated,
      address : results[0]. address,
      city : results[0].city,
      state : results[0].state,
      country : results[0].country,

      carBooking: results[0].model ? {
        model: results[0].model,
        version: results[0].version,
        color: results[0].color,
        carType: results[0].carType,

        
        exShowroomPrice: results[0].exShowroomPrice,
        bookingType: results[0].bookingType,
        team_Leader: results[0].team_Leader,
        team_Member: results[0].team_Member,
        
        bookingAmount: results[0].bookingAmount,
        createdAt: results[0].car_booking_created
      } : null,
      invoiceInfo: {
                        invoice_id: results[0].invoice_id || '',
                        invoice_date: results[0].invoice_date || null,
                        due_date: results[0].due_date || null,
                        total_on_road_price: results[0].total_on_road_price || 0,
                        total_charges: results[0].total_charges || 0,
                        grand_total: results[0].invoice_grand_total || 0,
        payment_status: results[0].payment_status || '',
        customer_account_balance: results[0].customer_account_balance || '',
                    },

      additional_info: {
        finance: results[0].finance || null,
        exchange: results[0].exchange || null
      },
      loans: [],
      carExchange: results[0].exchange_id ? {
        id: results[0].exchange_id,
        rcDocument: results[0].rcDocument,
        insurancePolicy: results[0].insurancePolicy,
        pucCertificate: results[0].pucCertificate,
        identityProof: results[0].identityProof,
        addressProof: results[0].addressProof,
        loanClearance: results[0].loanClearance,
        serviceHistory: results[0].serviceHistory,
        carOwnerFullName: results[0].carOwnerFullName,
        carMake: results[0].carMake,
        carModel: results[0].carModel,
        carColor: results[0].carColor,
        carRegistration: results[0].carRegistration,
        carYear: results[0].carYear,
        status: results[0].exchange_status,
        exchangeAmount: results[0].exchangeAmount,
        exchangeReason: results[0].exchangeReason,
        createdAt: results[0].exchange_created,
        updatedAt: results[0].exchange_updated
      } : null
    };

    // Process loans and documents
    const loanMap = new Map();
    results.forEach(row => {
      if (row.loan_id && !loanMap.has(row.loan_id)) {
        const loan = {
          id: row.loan_id,
          loanAmount: row.loan_amount,
          interestRate: row.interest_rate,
          duration: row.loan_duration,
          status: row.loan_status,
          financeReason: row.financeReason,
          financeAmount: row.financeAmount,
          calculatedEMI: row.calculated_emi,
          createdAt: row.loan_created,
          updatedAt: row.loan_updated,
          documents: []
        };
        loanMap.set(row.loan_id, loan);
        customerData.loans.push(loan);
      }

      if (row.document_id) {
        const loan = loanMap.get(row.loan_id);
        if (loan) {
          loan.documents.push({
            id: row.document_id,
            employedType: row.employed_type,
            documentName: row.document_name,
            filePath: row.document_path,
            uploadedAt: row.document_uploaded
          });
        }
      }
    });

    

    res.status(200).json({
      success: true,
      data: customerData
    });

  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer details',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
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
