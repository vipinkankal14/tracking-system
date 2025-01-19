const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
 

 
const handleCancelOrder = (req, res) => {
    const { customerId, cancellationReason, isConfirmed } = req.body;
  
    // Set fixed status and determine other values
    const status = 'cancel';
    const newCancellationReason = status === 'confirmed' ? null : cancellationReason;
    const newIsConfirmed = status === 'confirmed' ? false : isConfirmed;
  
    const query = `
      UPDATE customers
      SET 
        status = ?,
        cancellationReason = ?,
        isConfirmed = ?
      WHERE customerId = ?;
    `;
  
    console.log('Executing query with data:', { status, newCancellationReason, newIsConfirmed, customerId });
  
    pool.execute(query, [status, newCancellationReason, newIsConfirmed, customerId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send({ error: 'Failed to cancel the order.' });
        return;
      }
  
      console.log('Query executed successfully:', results);
  
      if (results.affectedRows === 0) {
        console.log('No rows affected');
        res.status(404).send({ message: 'Customer not found.' });
        return;
      }
  
      console.log('Sending success response');
      res.send({ message: 'Order canceled successfully.' });
    });
  };
  

module.exports = { handleCancelOrder };
