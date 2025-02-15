const pool = require('../../databaseConnection/mysqlConnection');


// Function to add a new accessory
const addAccessory = async (req, res) => {
    const { category, name, price, quantity } = req.body;

    const insertAccessoryQuery = `
        INSERT INTO accessories_store (category, name, price, quantity) 
        VALUES (?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
            quantity = quantity + VALUES(quantity), 
            date_updated = CURRENT_TIMESTAMP
    `;

    try {
        await pool.query(insertAccessoryQuery, [category, name, price, quantity]);
        res.status(200).json({ message: 'Accessory added successfully!' });
    } catch (error) {
        console.error('Error adding accessory:', error.message);
        res.status(500).json({ error: 'Error adding accessory.' });
    }
};


// Function to get all accessories
const getAllAccessories = async (req, res) => {
    const getAllAccessoriesQuery = 'SELECT * FROM accessories_store';

    try {
        const [rows] = await pool.query(getAllAccessoriesQuery);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching accessories:', error.message);
        res.status(500).json({ error: 'Error fetching accessories.' });
    }
};

    


 
  
module.exports = { addAccessory, getAllAccessories };

 

