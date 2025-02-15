const { pool } = require("../../databaseConnection/mysqlConnection");
 
// Handle database errors
const handleDatabaseError = (err, connection, res, message) => {
  connection.rollback(() => {
    connection.release();
    console.error(message, err);
    res.status(500).json({ message, error: err.message });
  });
};

const postCoatingRequest = (req, res) => {
  console.log("Coating request received");

  const { customerId, coatingType, preferredDate, preferredTime, amount, durability, additionalNotes } = req.body;

  if (!customerId) {
    return res.status(400).json({ message: 'Customer ID is required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Transaction error:", err);
        return res.status(500).json({ message: "Transaction error" });
      }

      // Insert the new request
      const insertQuery = `
        INSERT INTO coating_requests (customerId, coatingType, preferredDate, preferredTime, amount, durability, additionalNotes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(insertQuery, [customerId, coatingType, preferredDate, preferredTime, amount, durability, additionalNotes], (err, results) => {
        if (err) {
          return handleDatabaseError(err, connection, res, "Error inserting coating request");
        }

        const requestId = results.insertId;

        // Delete old requests
        const deleteQuery = `DELETE FROM coating_requests WHERE customerId = ? AND id != ?`;
        connection.query(deleteQuery, [customerId, requestId], (err) => {
          if (err) {
            return handleDatabaseError(err, connection, res, "Error deleting old coating requests");
          }

          connection.commit((err) => {
            if (err) {
              return handleDatabaseError(err, connection, res, "Transaction commit error");
            }
            connection.release();
            res.status(200).json({ message: 'Coating request submitted successfully', requestId });
          });
        });
      });
    });
  });
};

// Export the module
module.exports = { postCoatingRequest };