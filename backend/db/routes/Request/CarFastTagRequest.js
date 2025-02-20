const { pool } = require("../../databaseConnection/mysqlConnection"); 
const fs = require('fs');

const postCarFastTagRequest = async (req, res) => {
    try {
        const { customerId, fasttag_amount } = req.body; // Extract fasttag_amount from the request body
        const files = req.files;

        // Ensure all required files are present
        if (!files.rcDocument || !files.aadhaarDocument || !files.panDocument || !files.passportPhoto) {
            return res.status(400).json({ message: "All documents are required" });
        }

        const rcDocumentPath = files.rcDocument[0].path;
        const aadhaarDocumentPath = files.aadhaarDocument[0].path;
        const panDocumentPath = files.panDocument[0].path;
        const passportPhotoPath = files.passportPhoto[0].path;

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

                // Insert new request into the database
                const insertQuery = `
                    INSERT INTO car_fasttag_requests (
                        customerId, rcDocument, aadhaarDocument, panDocument, passportPhoto, fasttag_amount
                    ) VALUES (?, ?, ?, ?, ?, ?)`;
                const values = [
                    customerId,
                    rcDocumentPath,
                    aadhaarDocumentPath,
                    panDocumentPath,
                    passportPhotoPath,
                    1000 // Store fasttag_amount as 1000 automatically
                ];

                connection.query(insertQuery, values, (err, results) => {
                    if (err) {
                        return handleDatabaseError(err, connection, res, "Error inserting car fasttag request");
                    }

                    const requestId = results.insertId;

                    // Retrieve old records for the same customer
                    const selectOldRecordsQuery = `
                        SELECT rcDocument, aadhaarDocument, panDocument, passportPhoto 
                        FROM car_fasttag_requests 
                        WHERE customerId = ? AND id != ?`;
                    connection.query(selectOldRecordsQuery, [customerId, requestId], (err, oldRecords) => {
                        if (err) {
                            return handleDatabaseError(err, connection, res, "Error selecting old fasttag requests");
                        }

                        // Delete old records from the database
                        const deleteQuery = `DELETE FROM car_fasttag_requests WHERE customerId = ? AND id != ?`;
                        connection.query(deleteQuery, [customerId, requestId], (err) => {
                            if (err) {
                                return handleDatabaseError(err, connection, res, "Error deleting fasttag requests");
                            }

                            // Commit the transaction
                            connection.commit((err) => {
                                if (err) {
                                    return handleDatabaseError(err, connection, res, "Transaction commit error");
                                }
                                connection.release();

                                // Delete old files from the filesystem
                                oldRecords.forEach(record => {
                                    const filesToDelete = [
                                        record.rcDocument,
                                        record.aadhaarDocument,
                                        record.panDocument,
                                        record.passportPhoto
                                    ];

                                    filesToDelete.forEach(filePath => {
                                        if (filePath) {
                                            fs.unlink(filePath, (err) => {
                                                if (err) {
                                                    console.error(`Error deleting file ${filePath}:`, err);
                                                } else {
                                                    console.log(`Deleted file ${filePath} successfully`);
                                                }
                                            });
                                        }
                                    });
                                });

                                res.status(200).json({ 
                                    message: 'Car fasttag request submitted successfully!', 
                                    requestId,
                                    fasttag_amount: 1000 // Include fasttag_amount as 1000 in the response
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error submitting car fasttag request:', error);
        res.status(500).json({ message: 'Error submitting car fasttag request' });
    }
};

// Helper function to handle database errors and rollback
const handleDatabaseError = (err, connection, res, message) => {
    console.error(message, err);
    connection.rollback(() => {
        connection.release();
        res.status(500).json({ message });
    });
};

module.exports = { postCarFastTagRequest };