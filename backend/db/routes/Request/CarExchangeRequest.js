const { pool } = require("../../databaseConnection/mysqlConnection");

 
const handleDatabaseError = (err, connection, res, message) => {
    console.error(message, err);
    connection.rollback(() => {
        connection.release();
        res.status(500).json({ message });
    });
};

const postCarExchangeRequests = async (req, res) => {
    try {
        const {
            customerId,
            carOwnerFullName,
            carMake,
            carModel,
            carColor,
            carRegistration,
            carYear,
        } = req.body;

        // Get file paths from uploaded files
        const files = req.files;
        const rcDocumentPath = files.rcDocument[0].path;
        const insurancePolicyPath = files.insurancePolicy[0].path;
        const pucCertificatePath = files.pucCertificate[0].path;
        const identityProofPath = files.identityProof[0].path;
        const addressProofPath = files.addressProof[0].path;
        const loanClearancePath = files.loanClearance ? files.loanClearance[0].path : null;
        const serviceHistoryPath = files.serviceHistory ? files.serviceHistory[0].path : null;

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
                INSERT INTO car_exchange_requests (
                    customerId, rcDocument, insurancePolicy, pucCertificate,
                    identityProof, addressProof, loanClearance, serviceHistory,
                    carOwnerFullName, carMake, carModel, carColor, carRegistration, carYear
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const values = [
                    customerId,
                    rcDocumentPath,
                    insurancePolicyPath,
                    pucCertificatePath,
                    identityProofPath,
                    addressProofPath,
                    loanClearancePath,
                    serviceHistoryPath,
                    carOwnerFullName,
                    carMake,
                    carModel,
                    carColor,
                    carRegistration,
                    carYear,
                ];
                connection.query(insertQuery, values, (err, results) => {
                    if (err) {
                        return handleDatabaseError(err, connection, res, "Error inserting car exchange request");
                    }

                    const requestId = results.insertId;

                    // Delete old requests
                    const deleteQuery = `DELETE FROM car_exchange_requests WHERE customerId = ? AND id != ?`;
                    connection.query(deleteQuery, [customerId, requestId], (err) => {
                        if (err) {
                            return handleDatabaseError(err, connection, res, "Error deleting old car exchange requests");
                        }

                        connection.commit((err) => {
                            if (err) {
                                return handleDatabaseError(err, connection, res, "Transaction commit error");
                            }
                            connection.release();
                            res.status(200).json({ message: 'Car exchange request submitted successfully!', requestId });
                        });
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error submitting car exchange request:', error);
        res.status(500).json({ message: 'Error submitting car exchange request' });
    }
};

module.exports = { postCarExchangeRequests };