const { pool } = require("../../databaseConnection/mysqlConnection");

// API endpoint to handle Extended Warranty request submission
const postAutoCardRequest = (req, res) => {
     
    const { customerId } = req.body;

    // Hardcoded confirmation message
    const confirm_Benefits = "I acknowledge the benefits of the Auto Card and confirm my request.";

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
    
            const insertQuery = `
                INSERT INTO car_AutoCard_requests (customerId, confirm_Benefits)
                VALUES (?, ?)
            `;
    
            connection.query(insertQuery, [customerId, confirm_Benefits], (err, results) => {
                if (err) {
                    return handleDatabaseError(err, connection, res, "Error inserting AutoCard request");
                }
    
                const requestId = results.insertId;

                const deleteQuery = `
                    DELETE FROM car_AutoCard_requests
                    WHERE customerId = ? AND id != ?
                    
                    `;
                
    
                connection.query(deleteQuery, [customerId, requestId], (err) => {
                    if (err) {
                        return handleDatabaseError(err, connection, res, "Error deleting old AutoCard requests");
                    }
    
                    connection.commit((err) => {
                        if (err) {
                            return handleDatabaseError(err, connection, res, "Transaction commit error");
                        }
                        connection.release();
                        res.status(200).json({ message: 'AutoCard request submitted successfully', requestId });
                    });
                });
            });
        });
    });
}

const handleDatabaseError = (err, connection, res, message) => {
    console.error(message, err);
    connection.rollback(() => {
        connection.release();
        res.status(500).json({ message });
    });
};

module.exports = { postAutoCardRequest };