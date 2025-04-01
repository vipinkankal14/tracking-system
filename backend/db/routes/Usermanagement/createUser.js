const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

// Helper function to validate user data
const validateUserData = (data) => {
  const requiredFields = ['emp_id', 'username', 'email', 'role'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return { 
      isValid: false, 
      error: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const validation = validateUserData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const {
      emp_id,
      username,
      email,
      role,
      phone_number = '',
      current_salary = 0,
      profile_image = '',
      aadhar_number = '',
      pan_number = '',
      street_address = '',
      city = '',
      state = '',
      postal_code = '',
      country = 'India',
      employment_start_date = new Date().toISOString().split('T')[0],
      employment_end_date = null,
       is_active = true
    } = req.body;

    // Check if user already exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE emp_id = ? OR email = ?',
      [emp_id, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'User with this ID or email already exists' });
    }

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO users SET ?`,
      {
        emp_id,
        username,
        email,
        role,
        phone_number,
        current_salary,
        profile_image,
        aadhar_number,
        pan_number,
        street_address,
        city,
        state,
        postal_code,
        country,
        employment_start_date,
        employment_end_date,
         is_active
      }
    );

    // Return the created user
    const [newUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const [user] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const validation = validateUserData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const userId = req.params.id;
    const {
      emp_id,
      username,
      email,
      role,
      phone_number,
      current_salary,
      profile_image,
      aadhar_number,
      pan_number,
      street_address,
      city,
      state,
      postal_code,
      country,
      employment_start_date,
      employment_end_date,
       is_active
    } = req.body;

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check for duplicate emp_id or email
    const [duplicate] = await pool.query(
      'SELECT id FROM users WHERE (emp_id = ? OR email = ?) AND id != ?',
      [emp_id, email, userId]
    );

    if (duplicate.length > 0) {
      return res.status(409).json({ error: 'User with this ID or email already exists' });
    }

    // Update user
    await pool.query(
      'UPDATE users SET ? WHERE id = ?',
      [
        {
          emp_id,
          username,
          email,
          role,
          phone_number,
          current_salary,
          profile_image,
          aadhar_number,
          pan_number,
          street_address,
          city,
          state,
          postal_code,
          country,
          employment_start_date,
          employment_end_date,
           is_active
        },
        userId
      ]
    );

    // Return updated user
    const [updatedUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Routes


module.exports = {createUser, getUsers,getUserById,updateUser,deleteUser};