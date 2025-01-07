// Import necessary modules
const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');


// Function to fetch customer by customerId
const fetchCustomer = (customerId) => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM customer WHERE customerId = ?', [customerId], (err, results) => {
        if (err) {
          console.error('Error fetching customer data:', err);
          reject(err);  // Reject if there's an error
          return;
        }
  
        if (results.length === 0) {
          console.log('Customer not found');
          resolve(null);  // Resolve with null if customer is not found
          return;
        }
  
        resolve(results[0]);  // Resolve with the customer data
      });
    });
  };
  
  
  
  
  

// Export the fetchCustomer function
module.exports = { fetchCustomer };
