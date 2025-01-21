const express = require('express')
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');


const ShowCarStock = async (req, res) => {
    const query = 'SELECT * FROM carStocks';
    
    try {
        
        const [results] = await pool.query(query);
        res.json(results);
        
    } catch (error) {

        console.error('Error fetching car stock:', error);
        res.status(500).json({ error: 'Erroe fetching car stock' });
        
    }
    
}



/*
// Controller to show car stocks with customer details
const ShowCarStockWithCustomers = async (req, res) => {
    const query = `
        SELECT 
            c.customerId,
            c.firstName,
            c.middleName,
            c.lastName,
            s.vin,
            s.chassisNumber,
            s.engineNumber,
            s.fuelType,
            s.manufacturerDate,
            s.dateIn,
            s.model,
            s.color,
            s.version,
            s.allotmentCarStatus
        FROM 
            customers c
        LEFT JOIN 
            carstocks s
        ON 
            c.customerId = s.customerId;
    `;

    try {
        // Execute the query
        const [results] = await pool.query(query);

        // Send results as JSON response
        res.json(results);
    } catch (error) {
        console.error('Error fetching car stock with customer details:', error);
        res.status(500).json({ error: 'Error fetching car stock with customer details' });
    }
};

*/

module.exports = { ShowCarStock };