const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

const financeshow = async (req, res) => {
    const query = `
    SELECT 
        c.customerId,
        c.firstName,
        c.middleName,
        c.lastName,
        c.email,
        c.createdAt AS customer_created,
        l.id AS loan_id,
        l.loan_amount,
        l.interest_rate,
        l.loan_duration,
        l.status,
        l.financeReason,
        l.financeAmount,
        l.calculated_emi,
        l.createdAt AS loan_created,
        d.id AS document_id,
        d.employed_type,
        d.document_name,
        d.uploaded_file AS document_path,
        d.uploaded_at AS document_uploaded,
        cr.model,
        cr.version,
        cr.color
    FROM customers c
    LEFT JOIN loans l ON c.customerId = l.customerId
    LEFT JOIN carbooking cr ON c.customerId = cr.customerId
    LEFT JOIN customer_documents d ON l.id = d.loan_id
    `;

    try {
        const [results] = await pool.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No car exchange requests found.',
            });
        }

        const customersMap = new Map();

        results.forEach(row => {
            if (!customersMap.has(row.customerId)) {
                customersMap.set(row.customerId, {
                    customerId: row.customerId,
                    firstName: row.firstName,
                    middleName: row.middleName,
                    lastName: row.lastName,
                    email: row.email,
                    created_at: row.customer_created,
                    model: row.model,
                    version: row.version,
                    color: row.color,
                    loans: []
                });
            }

            const customer = customersMap.get(row.customerId);

            // Process loan data
            if (row.loan_id) {
                let loan = customer.loans.find(loan => loan.id === row.loan_id);
                if (!loan) {
                    loan = {
                        id: row.loan_id,
                        loan_amount: row.loan_amount,
                        interest_rate: row.interest_rate,
                        loan_duration: row.loan_duration,
                        status: row.status,
                        financeReason: row.financeReason,
                        financeAmount: row.financeAmount,
                        calculated_emi: row.calculated_emi,
                        created_at: row.loan_created,
                        documents: []
                    };
                    customer.loans.push(loan);
                }

                // Process document data
                if (row.document_id) {
                    const existingDoc = loan.documents.find(doc => doc.id === row.document_id);
                    if (!existingDoc) {
                        loan.documents.push({
                            id: row.document_id,
                            employed_type: row.employed_type,
                            document_name: row.document_name,
                            document_path: row.document_path,
                            uploaded_at: row.document_uploaded
                        });
                    }
                }
            }
        });

        const customersArray = Array.from(customersMap.values());

        res.status(200).json({
            success: true,
            data: customersArray,
        });

    } catch (error) {
        console.error('Error fetching car exchange requests:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching car exchange requests.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};

module.exports = { financeshow };