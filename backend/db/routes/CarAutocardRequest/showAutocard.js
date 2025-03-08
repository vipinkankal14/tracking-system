const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

const showAutocard = async (req, res) => {
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
            cir.id AS autocard_id,
            cir.confirm_Benefits,
            cir.autocard_amount,
            cir.status,
            cir.autoCardReason,
            cir.createdAt AS insurance_created,
            cir.updatedAt AS insurance_updated
        FROM customers c
        LEFT JOIN carbooking cr ON c.customerId = cr.customerId
        LEFT JOIN car_autocard_requests cir ON c.customerId = cir.customerId
        WHERE cir.customerId IS NOT NULL AND cir.customerId != '';
    `;

    try {
        const [results] = await pool.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [], // Return an empty array if no data is found
                message: 'No extended autocard requests found.',
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
                    autocardRequests: []
                });
            }

            const customer = customersMap.get(row.customerId);

            if (row.autocard_id && !customer.autocardRequests.some(autocard => autocard.id === row.autocard_id)) {
                customer.autocardRequests.push({
                    id: row.autocard_id,
                    confirmBenefits: row.confirm_Benefits,
                    autocardAmount: row.autocard_amount,
                    status: row.status,
                    autoCardReason: row.autoCardReason,
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
        console.error('Error fetching extended autocard requests:', error);

        // Return a generic error message to avoid exposing sensitive details
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching extended autocard requests.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};

module.exports = { showAutocard };