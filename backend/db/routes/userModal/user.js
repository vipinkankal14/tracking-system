const pool = require('../../databaseConnection/mysqlConnection');

const getCustomerOrders = async (req, res) => {
    const { customerId } = req.params;

    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE customerId = ?', 
            [customerId]
        );

        for (let order of orders) {
            const [products] = await pool.query(
                'SELECT * FROM order_products WHERE orderId = ?', 
                [order.id]
            );
            order.products = products;
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

module.exports = { getCustomerOrders };
