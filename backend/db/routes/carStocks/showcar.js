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


module.exports = { ShowCarStock };