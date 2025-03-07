const express = require('express')
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');



const showRTO = async (req, res) => {
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
            s.id AS RTO_id,
            s.form20,
            s.form21,
            s.form22,
            s.form34,
            s.invoice,
            s.insurance,
            s.puc,
            s.idProof,
            s.roadTax,
            s.tempReg,
            s.createdAt,
            s.updatedAt,
            s.rto_amount,
            s.status,
            s.rtoReason,
            s.rtoRecipes
        FROM customers c
        LEFT JOIN carbooking cr ON c.customerId = cr.customerId
        LEFT JOIN car_rto_requests s ON c.customerId = s.customerId
        WHERE s.customerId IS NOT NULL AND s.customerId != '';
    `;

    try {
        const [results] = await pool.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [], // Return an empty array if no data is found
                message: 'No car RTO requests found.',
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
                    RTORequests: []
                });
            }

            const customer = customersMap.get(row.customerId);

            if (row.RTO_id && !customer.RTORequests.some(RTO => RTO.id === row.RTO_id)) {
                customer.RTORequests.push({
                    id: row.RTO_id,
                    form20: row.form20,
                    form21: row.form21,
                    form22: row.form22,
                    form34: row.form34,
                    invoice: row.invoice,
                    insurance: row.insurance,
                    puc: row.puc,
                    idProof: row.idProof,
                    roadTax: row.roadTax,
                    tempReg: row.tempReg,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    rto_amount: row.rto_amount,
                    status: row.status,
                    rtoReason: row.rtoReason
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
        console.error('Error fetching car RTO requests:', error);

        // Return a generic error message to avoid exposing sensitive details
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching car RTO requests.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};


 



module.exports = { showRTO };