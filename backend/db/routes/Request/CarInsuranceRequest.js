const { pool } = require("../../databaseConnection/mysqlConnection");
const fs = require('fs');
const path = require('path');

const handleDatabaseError = (err, connection, res, message) => {
    console.error(message, err);
    connection.rollback(() => {
        connection.release();
        res.status(500).json({ message });
    });
};

const postCarInsuranceRequests = async (req, res) => {
    try {
        const { customerId } = req.body;

        // Get file paths from uploaded files
        const files = req.files;
        if (!files) {
            return res.status(400).json({ message: "No files were uploaded." });
        }

        const rcDocumentPath = files.rcDocument ? files.rcDocument[0].path : null;
        const salesInvoicePath = files.salesInvoice ? files.salesInvoice[0].path : null;
        const identityProofPath = files.identityProof ? files.identityProof[0].path : null;
        const addressProofPath = files.addressProof ? files.addressProof[0].path : null;
        const form21Path = files.form21 ? files.form21[0].path : null;
        const form22Path = files.form22 ? files.form22[0].path : null;
        const tempRegPath = files.tempReg ? files.tempReg[0].path : null;
        const pucPath = files.puc ? files.puc[0].path : null;
        const loanDocumentsPath = files.loanDocuments ? files.loanDocuments[0].path : null;

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

                // Insert into database
                const insertQuery = `
                INSERT INTO car_Insurance_requests (
                    customerId, rcDocument, salesInvoice, identityProof, addressProof, form21, form22, tempReg, puc, loanDocuments,insurance_amount
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [
                    customerId,
                    rcDocumentPath,
                    salesInvoicePath,
                    identityProofPath,
                    addressProofPath,
                    form21Path,
                    form22Path,
                    tempRegPath,
                    pucPath,
                    loanDocumentsPath,
                    2400
                ];
                connection.query(insertQuery, values, (err, results) => {
                    if (err) {
                        return handleDatabaseError(err, connection, res, "Error inserting car Insurance request");
                    }

                    const requestId = results.insertId;

                    // Retrieve old records
                    const selectQuery = `SELECT rcDocument, salesInvoice, identityProof, addressProof, form21, form22, tempReg, puc, loanDocuments,insurance_amount FROM car_Insurance_requests WHERE customerId = ? AND id != ?`;
                    connection.query(selectQuery, [customerId, requestId], (err, oldRecords) => {
                        if (err) {
                            return handleDatabaseError(err, connection, res, "Error retrieving old car Insurance requests");
                        }

                        // Delete old requests
                        const deleteQuery = `DELETE FROM car_Insurance_requests WHERE customerId = ? AND id != ?`;
                        connection.query(deleteQuery, [customerId, requestId], (err) => {
                            if (err) {
                                return handleDatabaseError(err, connection, res, "Error deleting old car Insurance requests");
                            }

                            connection.commit((err) => {
                                if (err) {
                                    return handleDatabaseError(err, connection, res, "Transaction commit error");
                                }
                                connection.release();
                                res.status(200).json({
                                    message: 'Car Insurance request submitted successfully!', requestId,
                                    insurance_amount: 2400
                                 });

                                // Delete old files from filesystem
                                oldRecords.forEach(record => {
                                    const filePaths = [
                                        record.rcDocument,
                                        record.salesInvoice,
                                        record.identityProof,
                                        record.addressProof,
                                        record.form21,
                                        record.form22,
                                        record.tempReg,
                                        record.puc,
                                        record.loanDocuments
                                    ].filter(Boolean); // Remove null or undefined paths

                                    filePaths.forEach(filePath => {
                                        fs.unlink(path.resolve(filePath), (err) => {
                                            if (err) {
                                                console.error(`Error deleting file ${filePath}:`, err);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error submitting car Insurance request:', error);
        res.status(500).json({ message: 'Error submitting car Insurance request' });
    }
};

module.exports = { postCarInsuranceRequests };