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

const addToCart = async (req, res) => {
    const cartData = req.body;
  
    // Validate that customerId exists in the customers table
    const customerCheckQuery = `SELECT id FROM customers WHERE id = ?`;
    const customerId = cartData[0]?.customerId; // Assuming cartData is an array with customerId for all products
  
    try {
      const [rows] = await pool.query(customerCheckQuery, [customerId]);
      if (rows.length === 0) {
        return res.status(400).json({ error: "Customer not found!" });
      }
  
      // Proceed with inserting the cart items
      const insertCartQuery = `
        INSERT INTO cart_accessories (category, name, price, customerid)
        VALUES (?, ?, ?, ?)
      `;
  
      for (const product of cartData) {
        const { category, name, price, customerId } = product;
        await pool.query(insertCartQuery, [category, name, price, customerId]);
      }
  
      res.status(200).json({ message: 'Cart items added successfully!' });
    } catch (error) {
      console.error('Error adding items to cart:', error.message);
      res.status(500).json({ error: 'Error adding items to cart.' });
    }
};


 
  
module.exports = { addAccessory, getAllAccessories,addToCart };

 

