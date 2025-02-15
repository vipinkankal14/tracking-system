const { pool } = require("../../databaseConnection/mysqlConnection");

 
// Handle database errors
const handleDatabaseError = (err, connection, res, message) => {
    connection.rollback(() => {
        connection.release();
        console.error(message, err);
        res.status(500).json({ message, error: err.message });
    });
};

const postCarLoansRequest = async (req, res) => {
    const {
        customerId,
        loanAmount,
        interestRate,
        loanDuration,
        calculatedEMI,
        employedType,
        requiredDocuments,
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

    let connection;
    try {
        connection = await pool.promise().getConnection();
        await connection.beginTransaction();

        // Delete old data
        const deleteOldDataQuery = `DELETE FROM loans WHERE customerId = ?`;
        await connection.query(deleteOldDataQuery, [customerId]);

        // Insert loan details
        const loanQuery = `INSERT INTO loans (customerId, loan_amount, interest_rate, loan_duration, calculated_emi) VALUES (?, ?, ?, ?, ?)`;
        const [loanResult] = await connection.query(loanQuery, [customerId, loanAmount, interestRate, loanDuration, calculatedEMI]);
        const loanId = loanResult.insertId;

        // Insert documents
        const documentPromises = files.map((file, index) => {
            const documentName = requiredDocsArray[index];
            return connection.query(
                `INSERT INTO customer_documents (loan_id, employed_type, document_name, uploaded_file) VALUES (?, ?, ?, ?)`,
                [loanId, employedType, documentName, file.path]
            );
        });
        await Promise.all(documentPromises);

        await connection.commit();
        connection.release();
        res.status(201).json({ message: "Loan application submitted successfully." });
    } catch (error) {
        if (connection) {
            handleDatabaseError(error, connection, res, "Error in loan submission");
        } else {
            console.error("Error in loan submission", error);
            res.status(500).json({ message: "Error in loan submission", error: error.message });
        }
    }
};

module.exports = { postCarLoansRequest };