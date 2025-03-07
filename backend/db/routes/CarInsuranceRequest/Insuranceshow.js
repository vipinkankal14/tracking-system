const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

const Insuranceshow = async (req, res) => {
    const query = `
        SELECT 
            c.customerId,
            c.firstName,
            c.middleName,
            c.lastName,
            c.email,
            c.created_at AS customer_created,
            cr.model,
            cr.version,
            cr.color,
            cir.id AS insurance_id,
            cir.rcDocument,
            cir.salesInvoice,
            cir.identityProof,
            cir.addressProof,
            cir.form21,
            cir.form22,
            cir.tempReg,
            cir.puc,
            cir.status,
            cir.insuranceReason,
            cir.loanDocuments,
            cir.insurance_amount,
            cir.createdAt AS insurance_created,
            cir.updatedAt AS insurance_updated
        FROM customers c
        LEFT JOIN carbooking cr ON c.customerId = cr.customerId
        LEFT JOIN car_insurance_requests cir ON c.customerId = cir.customerId
        WHERE cir.customerId IS NOT NULL AND cir.customerId != '';
    `;

    try {
        const [results] = await pool.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [], // Return an empty array if no data is found
                message: 'No car insurance requests found.',
            });
        }

        // Transform the flat result set into the desired nested structure
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
                    carBooking: {
                        model: row.model,
                        version: row.version,
                        color: row.color
                    },
                    insuranceRequests: []
                });
            }

            const customer = customersMap.get(row.customerId);

            if (row.insurance_id && !customer.insuranceRequests.some(insurance => insurance.id === row.insurance_id)) {
                customer.insuranceRequests.push({
                    id: row.insurance_id,
                    rcDocument: row.rcDocument,
                    salesInvoice: row.salesInvoice,
                    identityProof: row.identityProof,
                    addressProof: row.addressProof,
                    form21: row.form21,
                    form22: row.form22,
                    tempReg: row.tempReg,
                    status : row.status,
                    puc: row.puc,
                    insuranceReason:row.insuranceReason,
                    loanDocuments: row.loanDocuments,
                    insurance_amount: row.insurance_amount,
                    createdAt: row.insurance_created,
                    updatedAt: row.insurance_updated
                });
            }
        });

        const customersArray = Array.from(customersMap.values());

        // Return the transformed results
        res.status(200).json({
            success: true,
            data: customersArray,
        });

    } catch (error) {
        console.error('Error fetching car insurance requests:', error);

        // Return a generic error message to avoid exposing sensitive details
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching car insurance requests.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};

 
module.exports = { Insuranceshow };