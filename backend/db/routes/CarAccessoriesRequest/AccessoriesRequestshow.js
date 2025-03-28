const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

const AccessoriesRequestshow = async (req, res) => {
  const query = `
    SELECT 
      c.customerId,
      c.firstName,
      c.middleName,
      c.lastName,
      c.email,
      c.mobileNumber1,
      c.mobileNumber2,
      c.createdAt AS customer_created,
      cr.model,
      cr.version,
      cr.color,
      o.id AS orderId, -- Include orderId for grouping
      o.totalAmount,
      o.status,
      o.accessorieReason,
      o.accessorieRecipes,
      o.updatedAt,
      o.createdAt,
      p.category,
      p.name,
      p.price
    FROM customers c
    LEFT JOIN carbooking cr ON c.customerId = cr.customerId
    LEFT JOIN orders_accessories_request o ON c.customerId = o.customerId
    LEFT JOIN order_products p ON o.id = p.orderId
    WHERE o.customerId IS NOT NULL AND o.customerId != '';
  `;

  try {
    const [results] = await pool.query(query);

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        data: [], // Return an empty array if no data is found
        message: 'No car exchange requests found.',
      });
    }

    // Transform the flat result set into the desired nested structure
    const customersMap = new Map();

    results.forEach((row) => {
      if (!customersMap.has(row.customerId)) {
        customersMap.set(row.customerId, {
          customerId: row.customerId,
          firstName: row.firstName,
          middleName: row.middleName,
          lastName: row.lastName,
          email: row.email,
          mobileNumber1: row.mobileNumber1,
          mobileNumber2: row.mobileNumber2,
          created_at: row.customer_created,
          carBooking: {
            model: row.model,
            version: row.version,
            color: row.color,
          },
          orders: [], // Initialize orders array
        });
      }

      const customer = customersMap.get(row.customerId);

      // Check if the order already exists
      let order = customer.orders.find((o) => o.orderId === row.orderId);
      if (!order) {
        order = {
          orderId: row.orderId,
          totalAmount: row.totalAmount,
          status: row.status,
          accessorieReason: row.accessorieReason,
          accessorieRecipes: row.accessorieRecipes,
          updatedAt: row.updatedAt,
          createdAt: row.createdAt,
          products: [],
        };
        customer.orders.push(order);
      }

      // Add product to the order
      if (row.category && row.name && row.price) {
        order.products.push({
          category: row.category,
          name: row.name,
          price: row.price,
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
    console.error('Error fetching car exchange requests:', error);

    // Return a generic error message to avoid exposing sensitive details
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching car exchange requests.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

module.exports = { AccessoriesRequestshow };