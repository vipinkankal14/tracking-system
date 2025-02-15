

app.post('/api/submitCarExchangeRequest',
  uploadCarExchange.fields([
    { name: 'rcDocument', maxCount: 1 },
    { name: 'insurancePolicy', maxCount: 1 },
    { name: 'pucCertificate', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'loanClearance', maxCount: 1 },
    { name: 'serviceHistory', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      console.log('Request body:', req.body); // Add this log
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
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
      console.error('Error processing car exchange request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);


app.post("/api/loans", uploadCarloans.array("documents"), (req, res) => {
  const { 
    customerId, 
    loanAmount, 
    interestRate, 
    loanDuration, 
    calculatedEMI, 
    employedType, 
    requiredDocuments 
  } = req.body;
  const files = req.files;

  // Validate required fields
  if (!customerId || !loanAmount || !interestRate || !loanDuration || !employedType || !requiredDocuments) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanDuration)) {
    return res.status(400).json({ message: "Invalid loan details provided." });
  }

  // Validate uploaded files
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded." });
  }

  const allowedMimeTypes = ["application/pdf"];
  for (const file of files) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Only PDF files are allowed." });
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({ message: "File size should not exceed 5MB." });
    }
  }

  const requiredDocsArray = JSON.parse(requiredDocuments);
  if (files.length !== requiredDocsArray.length) {
    return res.status(400).json({ message: `Please upload all required documents for ${employedType}.` });
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

      try {
        // Delete old data
        const deleteOldDataQuery = `DELETE FROM loans WHERE customerId = ?`;
        connection.query(deleteOldDataQuery, [customerId], (err) => {
          if (err) {
            return handleDatabaseError(err, connection, res, "Error deleting old loan data");
          }

          // Insert loan details
          const loanQuery = `INSERT INTO loans (customerId, loan_amount, interest_rate, loan_duration, calculated_emi) VALUES (?, ?, ?, ?, ?)`;
          connection.query(loanQuery, [customerId, loanAmount, interestRate, loanDuration, calculatedEMI], (err, loanResult) => {
            if (err) {
              return handleDatabaseError(err, connection, res, "Error inserting loan details");
            }

            const loanId = loanResult.insertId;

            // Insert documents
            const documentPromises = files.map((file, index) => {
              const documentName = requiredDocsArray[index];
              return new Promise((resolve, reject) => {
                connection.query(
                  `INSERT INTO customer_documents (loan_id, employed_type, document_name, uploaded_file) VALUES (?, ?, ?, ?)`,
                  [loanId, employedType, documentName, file.path],
                  (err) => {
                    if (err) {
                      return reject(err);
                    }
                    resolve();
                  }
                );
              });
            });

            Promise.all(documentPromises)
              .then(() => {
                connection.commit((err) => {
                  if (err) {
                    return handleDatabaseError(err, connection, res, "Transaction commit error");
                  }
                  connection.release();
                  res.status(201).json({ message: "Loan application submitted successfully." });
                });
              })
              .catch((error) => {
                handleDatabaseError(error, connection, res, "Error inserting documents");
              });
          });
        });
      } catch (error) {
        handleDatabaseError(error, connection, res, "Error in loan submission");
      }
    });
  });
});
const handleDatabaseError = (err, connection, res, message) => {
  connection.rollback(() => {
    connection.release();
    console.error(message, err);
    res.status(500).json({ message, error: err.message });
  });
};


app.post('/api/submitCoatingRequest', (req, res) => {
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
});