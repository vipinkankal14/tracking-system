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


const getCustomerLoans = async (req, res) => {
  const { customerId } = req.params;

  try {
      // Fetch loans for the customer
      const [loans] = await pool.query(
          'SELECT * FROM loans WHERE customerId = ?', 
          [customerId]
      );

      // Fetch documents for each loan
      for (let loan of loans) {
          const [products] = await pool.query(
              'SELECT * FROM customer_documents WHERE loan_id = ?', 
              [loan.id]
          );
          loan.products = products;
      }

      res.status(200).json({ loans });
  } catch (error) {
      console.error('Error fetching loan:', error.message);
      res.status(500).json({ error: 'Failed to fetch loan' });
  }
};

 

module.exports = { getCustomerOrders, getCustomerLoans };
