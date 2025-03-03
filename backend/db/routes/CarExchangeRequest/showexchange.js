const express = require('express')
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');



const showexchange = async (req, res) => {
    const query = `
        SELECT 
            c.customerId,
            c.firstName,
            c.middleName,
            c.lastName,
            s.rcDocument,
            s.insurancePolicy,
            s.pucCertificate,
            s.identityProof,
            s.addressProof,
            s.loanClearance,
            s.serviceHistory,
            s.carOwnerFullName,
            s.carMake,
            s.carModel,
            s.carColor,
            s.carRegistration,
            s.carYear,
            s.status,
            s.exchangeAmount,
            s.exchangeReason
        FROM 
            customers c
        LEFT JOIN 
            car_exchange_requests s
        ON 
            c.customerId = s.customerId;
    `;

    try {
        const [results] = await pool.query(query);

        // Always return an array, even if empty
        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [], // Return an empty array instead of a 404
                message: 'No car exchange requests found.',
            });
        }

        // Return the results
        res.status(200).json({
            success: true,
            data: results,
        });

    } catch (error) {
        console.error('Error fetching car exchange requests:', error);

        // Return a generic error message to avoid exposing sensitive details
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching car exchange requests.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};



module.exports = { showexchange };