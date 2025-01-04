const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
 

// Function to add a new car stock entry
const addCarStock = async (req, res) => {
  const {
    vin,
    manufacturerDate,
    dateIn,
    model,
    color,
    fuelType,
    chassisNumber,
    engineNumber,
    version,

 
  } = req.body;

  const insertCarStockQuery = `
    INSERT INTO carStocks (vin, manufacturerDate, dateIn, model, color, fuelType, chassisNumber, engineNumber, version)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Execute the query with the provided data
    await pool.query(insertCarStockQuery, [
      vin,
      manufacturerDate,
      dateIn,
      model,
      color,
      fuelType,
      chassisNumber,
      engineNumber,
      version,
    ]);

    res.status(200).json({ message: 'Car stock added successfully!' });
  } catch (error) {
    console.error('Error adding car stock:', error.message);
    res.status(500).json({ error: 'Error adding car stock.' });
  }
};
 

module.exports = { addCarStock };
