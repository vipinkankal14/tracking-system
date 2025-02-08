const pool = require('../../databaseConnection/mysqlConnection');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// Multer Configuration for File Uploads
const storage = multer.memoryStorage(); // Store files in memory before saving to MySQL
const upload = multer({
  storage: storage,
  limits: { fileSize: 300 * 1024 }, // Max file size: 300KB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('uploadedFile'); // Ensure input name matches frontend


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

const postLoanApplication = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Get file size
      const fileSize = req.file.size;
      
      if (fileSize < 220 * 1024) {
        return res.status(400).json({ error: 'File size must be at least 220KB' });
      }
  
      // Insert file into MySQL
      const { customerId, loanAmount, interestRate, loanDuration, calculatedEMI, employedType } = req.body;
      const fileBuffer = req.file.buffer; // Get file as binary
  
      const loanQuery = 'INSERT INTO loans (customerId, loan_amount, interest_rate, loan_duration, calculated_emi) VALUES (?, ?, ?, ?, ?)';
      pool.query(loanQuery, [customerId, loanAmount, interestRate, loanDuration, calculatedEMI], (err, result) => {
        if (err) {
          console.error('Error inserting loan:', err.message);
          return res.status(500).json({ error: 'Failed to save loan' });
        }
  
        const loanId = result.insertId;
  
        // Insert file into customer_documents table
        const docQuery = 'INSERT INTO customer_documents (loan_id, employed_type, document_name, uploaded_file, file_size) VALUES (?, ?, ?, ?, ?)';
        pool.query(docQuery, [loanId, employedType, req.file.originalname, fileBuffer, fileSize], (err, result) => {
          if (err) {
            console.error('Error saving document:', err.message);
            return res.status(500).json({ error: 'Failed to save document' });
          }
          res.status(200).json({ message: 'Loan and document saved successfully' });
        });
      });
    });
};

module.exports = { getCustomerOrders, postLoanApplication };
