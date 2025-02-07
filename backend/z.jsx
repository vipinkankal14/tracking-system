app.get('/orders/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
      const [orders] = await pool.promise().query('SELECT * FROM orders WHERE customerId = ?', [customerId]);

      for (let order of orders) {
          const [products] = await pool.promise().query('SELECT * FROM order_products WHERE orderId = ?', [order.id]);
          order.products = products;
      }

      res.json({ orders });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch orders' });
  }
});