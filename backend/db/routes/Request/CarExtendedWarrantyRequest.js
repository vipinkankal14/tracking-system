const { pool } = require("../../databaseConnection/mysqlConnection");

const postCarExtendedWarrantyRequests = async (req, res) => {
    try {
        const { customerId } = req.body;
        const request_extended_warranty	 = "I acknowledge that I am requesting an extended warranty for my vehicle.";

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
                INSERT INTO car_extended_warranty_requests (customerId, request_extended_warranty, extendedwarranty_amount)
                VALUES (?, ?, 2000)`;
                const values = [customerId, request_extended_warranty];

                connection.query(insertQuery, values, (err, result) => {
                    if (err) {
                        return handleDatabaseError(err, connection, res, "Error inserting Car Extended Warranty request");
                    }

                    const deleteOldRequestsQuery = `
                    DELETE FROM car_extended_warranty_requests
                    WHERE customerId = ? AND id != ?`;
                    const deleteValues = [customerId, result.insertId];

                    connection.query(deleteOldRequestsQuery, deleteValues, (err, deleteResult) => {
                        if (err) {
                            return handleDatabaseError(err, connection, res, "Error deleting old Car Extended Warranty requests");
                        }

                        connection.commit((err) => {
                            if (err) {
                                return handleDatabaseError(err, connection, res, "Error committing transaction");
                            }

                            connection.release();
                            res.status(200).json({
                                message: "Car Extended Warranty request submitted successfully" ,
                                extendedwarranty_amount: 2000
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Error submitting Car Extended Warranty request:", error);
        res.status(500).json({ message: "An error occurred while submitting the Car Extended Warranty request" });
    }
};

const handleDatabaseError = (err, connection, res, message) => {
    console.error(message, err);
    connection.rollback(() => {
        connection.release();
        res.status(500).json({ message });
    });
};

module.exports = { postCarExtendedWarrantyRequests };