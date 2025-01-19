const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');



const updateDiscount = async (req, res) => {
    const { selectedCars, discount } = req.body;
  
    // Validate input
    if (!Array.isArray(selectedCars) || selectedCars.length === 0 || isNaN(discount)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    // Prepare the SQL query
    const placeholders = selectedCars.map(() => '?').join(', '); // Create placeholders for VINs
    const updateDiscountQuery = `
      UPDATE carStocks
      SET cardiscount = ?
      WHERE vin IN (${placeholders})
    `;
  
    try {
      // Combine discount with the VINs for execution
      const queryParams = [discount, ...selectedCars]; // Spread VINs after discount
      await pool.query(updateDiscountQuery, queryParams); // Execute query with combined params
  
      res.status(200).json({ message: 'Discounts updated successfully!' });
    } catch (error) {
      console.error('Error updating discounts:', error.message);
      res.status(500).json({ error: 'Error updating discounts.' });
    }
};
  

const updateDiscountForCriteria = async (req, res) => {
  const { model, color, version, discount } = req.body;

  if (!model || !color || !version || isNaN(discount)) {
    return res.status(400).json({ error: 'Invalid input data.' });
  }

  const query = `
    UPDATE carStocks
    SET cardiscount = ?
    WHERE model = ? AND color = ? AND version = ?
  `;

  try {
    const [result] = await pool.query(query, [discount, model, color, version]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No rows matched the criteria.' });
    }

    res.status(200).json({ message: 'Discount updated successfully!' });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Database error occurred.' });
  }
};



 


  
  
  // Export the updateDiscount function
module.exports = { updateDiscount ,updateDiscountForCriteria};