const express = require('express')
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');



const showexchange = async (req, res) => {
    const { status } = req.query;
    
    const query = `
        SELECT 
            c.customerId,
            c.firstName,
            c.middleName,
            c.lastName,
            c.email,
            c.mobileNumber1,
            c.mobileNumber2,

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
            s.exchangeReason,
            s.createdAt,
            s.updatedAt,
            
            adi.exchange
        FROM customers c
        INNER JOIN additional_info adi ON c.customerId = adi.customerId AND adi.exchange = 'YES'
        LEFT JOIN car_exchange_requests s ON c.customerId = s.customerId
        ${status ? 'WHERE s.status = ?' : ''}
        ORDER BY s.createdAt DESC
    `;

    try {
        const [results] = await pool.query(query, status ? [status] : []);

        // Filter to only include records with exchange request data
        const exchangeRequests = results.filter(row => row.carMake !== null);

        res.status(200).json({
            success: true,
            count: exchangeRequests.length,
            data: exchangeRequests,
            message: exchangeRequests.length > 0
                ? 'Car exchange requests retrieved successfully'
                : 'No car exchange requests found for customers with exchange=YES'
        });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch car exchange requests',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};



module.exports = { showexchange };