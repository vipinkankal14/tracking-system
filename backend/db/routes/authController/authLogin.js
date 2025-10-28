const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { pool } from "../../databaseConnection/mysqlConnection.js"; // Adjust the path as necessary

 
const router = express.Router();

// ✅ User Login (POST /login)
const loginpost = async (req, res) => {
  try {
    const { emp_id, password } = req.body;

    if (!emp_id || !password) {
      return res.status(400).json({ message: 'Both emp_id and password are required' });
    }

    // 🔍 Check if user exists in DB
    const sql = `SELECT id, emp_id, username, password, role FROM users WHERE emp_id = ?`;
    const [users] = await pool.execute(sql, [emp_id]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // 🔒 Compare Passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🎟️ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, emp_id: user.emp_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, emp_id: user.emp_id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {loginpost};
