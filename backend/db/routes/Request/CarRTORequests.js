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

const postRTORequests = async (req, res) => {
    try {
        const { customerId } = req.body;

        // Get file paths from uploaded files
        const files = req.files;
        if (!files) {
            return res.status(400).json({ message: "No files were uploaded." });
        }

        const form20Path = files.form20 ? files.form20[0].path : null;
        const form21Path = files.form21 ? files.form21[0].path : null;
        const form22Path = files.form22 ? files.form22[0].path : null;
        const invoicePath = files.invoice ? files.invoice[0].path : null;
        const insurancePath = files.insurance ? files.insurance[0].path : null;
        const pucPath = files.puc ? files.puc[0].path : null;
        const idProofPath = files.idProof ? files.idProof[0].path : null;
        const roadTaxPath = files.roadTax ? files.roadTax[0].path : null;
        const tempRegPath = files.tempReg ? files.tempReg[0].path : null;
        const form34Path = files.form34 ? files.form34[0].path : null;

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
                INSERT INTO car_rto_requests (
                    customerId, form20, form21, form22, invoice, insurance, puc, idProof, roadTax, tempReg, form34
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [
                    customerId,
                    form20Path,
                    form21Path,
                    form22Path,
                    invoicePath,
                    insurancePath,
                    pucPath,
                    idProofPath,
                    roadTaxPath,
                    tempRegPath,
                    form34Path
                ];
                connection.query(insertQuery, values, (err, results) => {
                    if (err) {
                        return handleDatabaseError(err, connection, res, "Error inserting RTO request");
                    }

                    const requestId = results.insertId;

                    // Retrieve old records
                    const selectQuery = `SELECT form20, form21, form22, invoice, insurance, puc, idProof, roadTax, tempReg, form34 FROM car_rto_requests WHERE customerId = ? AND id != ?`;
                    connection.query(selectQuery, [customerId, requestId], (err, oldRecords) => {
                        if (err) {
                            return handleDatabaseError(err, connection, res, "Error retrieving old RTO requests");
                        }

                        // Delete old requests
                        const deleteQuery = `DELETE FROM car_rto_requests WHERE customerId = ? AND id != ?`;
                        connection.query(deleteQuery, [customerId, requestId], (err) => {
                            if (err) {
                                return handleDatabaseError(err, connection, res, "Error deleting old RTO requests");
                            }

                            connection.commit((err) => {
                                if (err) {
                                    return handleDatabaseError(err, connection, res, "Transaction commit error");
                                }
                                connection.release();
                                res.status(200).json({ message: 'RTO request submitted successfully!', requestId });

                                // Delete old files from filesystem
                                oldRecords.forEach(record => {
                                    const filePaths = [
                                        record.form20,
                                        record.form21,
                                        record.form22,
                                        record.invoice,
                                        record.insurance,
                                        record.puc,
                                        record.idProof,
                                        record.roadTax,
                                        record.tempReg,
                                        record.form34
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
        console.error('Error submitting RTO request:', error);
        res.status(500).json({ message: 'Error submitting RTO request' });
    }
};

module.exports = { postRTORequests };