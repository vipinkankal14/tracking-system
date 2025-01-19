app.put('/api/cancel-order', (req, res) => {
    const { customerId, cancellationReason, isConfirmed } = req.body;
  
    // Determine the new values based on the status
    const status = 'cancel';
    const newCancellationReason = 'confirmed' === status ? null : cancellationReason; // Clear if status is 'confirmed'
    const newIsConfirmed = 'confirmed' === status ? false : isConfirmed; // Clear if status is 'confirmed'
  
    const query = `
      UPDATE customers
      SET 
        status = ?,
        cancellationReason = ?,
        isConfirmed = ?
      WHERE customerId = ?;
    `;
  
    pool.execute(query, [status, newCancellationReason, newIsConfirmed, customerId], (err, results) => {
      if (err) {
        res.status(500).send({ error: 'Failed to cancel the order.' });
        return;
      }
  
      // Check if any rows were affected
      if (results.affectedRows === 0) {
        res.status(404).send({ message: 'Customer not found.' });
        return;
      }
  
      res.send({ message: 'Order canceled successfully.' });
    });
});
  












// API endpoint to get car data by VIN
app.get('/api/car/:vin', (req, res) => {
  const { vin } = req.params;

  const query = 'SELECT * FROM carstocks WHERE vin = ?';
  pool.query(query, [vin], (err, results) => {
    if (err) {
      console.error('Error fetching car data: ', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(results[0]);  // Return the first (and only) result
  });
});

 

// Express route to update car allotment status
app.put('/api/car/update/:vin', (req, res) => {
  const { vin } = req.params;
  const { customerId, allotmentCarStatus } = req.body;  // Get both customerId and allotmentCarStatus from request body

  // SQL query to update both customerId and allotmentCarStatus
  const query = 'UPDATE carstocks SET customerId = ?, allotmentCarStatus = ? WHERE vin = ?';

  pool.query(query, [customerId, allotmentCarStatus, vin], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating car stock' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Car stock updated successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  });
});

