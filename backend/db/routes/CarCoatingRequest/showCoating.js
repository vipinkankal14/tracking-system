const express = require('express')
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

const showCoating = async (req, res) => {
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
            s.id AS coating_id,
            s.coatingType,
            s.preferredDate,
            s.preferredTime,
            s.additionalNotes,
            s.coating_amount,
            s.durability,
            s.createdAt,
            s.updatedAt,
            s.status,
            s.coatingReason
        FROM customers c
        LEFT JOIN carbooking cr ON c.customerId = cr.customerId
        LEFT JOIN coating_requests s ON c.customerId = s.customerId
        WHERE s.customerId IS NOT NULL AND s.customerId != '';
    `;

    try {
        const [results] = await pool.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No car coating requests found.',
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
                    carBooking: {
                        model: row.model,
                        version: row.version,
                        color: row.color
                    },
                    coatingRequests: []
                });
            }

            const customer = customersMap.get(row.customerId);

            if (row.coating_id && !customer.coatingRequests.some(coating => coating.id === row.coating_id)) {
                customer.coatingRequests.push({
                    id: row.coating_id,
                    coatingType: row.coatingType,
                    preferredDate: row.preferredDate,
                    preferredTime: row.preferredTime,
                    additionalNotes: row.additionalNotes,
                    coating_amount: row.coating_amount,
                    durability: row.durability,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    status: row.status,
                    coatingReason: row.coatingReason
                });
            }
        });

        const customersArray = Array.from(customersMap.values());

        res.status(200).json({
            success: true,
            data: customersArray,
        });

    } catch (error) {
        console.error('Error fetching car coating requests:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching car coating requests.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};

module.exports = { showCoating };