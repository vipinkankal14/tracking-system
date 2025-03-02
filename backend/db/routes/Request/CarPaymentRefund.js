const pool = require("../../databaseConnection/mysqlConnection");

const getAllAccountManagementRefund = async (req, res) => {
  const query = `
    SELECT *
    FROM customers c
    LEFT JOIN carbooking cb ON c.customerId = cb.customerId
    LEFT JOIN account_management_refund inv ON c.customerId = inv.customerId;
  `;

  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching refund data:", err);
    res.status(500).json({ error: "Error fetching refund data" });
  }
};

module.exports = { getAllAccountManagementRefund };