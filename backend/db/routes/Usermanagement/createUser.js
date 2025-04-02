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
    
    // Verify image existence and construct full URL
    const usersWithVerifiedImages = users.map(user => {
      let profile_image = '';
      
      if (user.profile_image) {
        // Construct the correct filesystem path
        const imagePath = path.join(
          __dirname, 
          '../../../public',  
          user.profile_image
        );
        
        // Check if file exists
        if (fs.existsSync(imagePath)) {
          // Construct full URL using base URL from request
          profile_image = `${req.protocol}://${req.get('host')}${user.profile_image}`;
        } else {
          console.warn(`Missing profile image: ${imagePath}`);
        }
      }
      
      return {
        ...user,
        profile_image
      };
    });
    
    res.status(200).json(usersWithVerifiedImages);
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


const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure upload directory exists
const uploadDir = './public/uploads/profile-images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Upload profile image for existing user
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }

    const userId = req.params.id;
    
    // Check if user exists
    const [user] = await pool.query(
      'SELECT id, profile_image FROM users WHERE id = ?', 
      [userId]
    );
    
    if (user.length === 0) {
      // Delete the uploaded file if user doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    
    // Update user's profile image in database
    await pool.query(
      'UPDATE users SET profile_image = ? WHERE id = ?', 
      [imageUrl, userId]
    );
    
    // Delete old profile image if it exists
    if (user[0].profile_image) {
      const oldImagePath = path.join(__dirname, '../public', user[0].profile_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    res.status(200).json({ 
      success: true,
      profile_image: imageUrl,
      message: 'Profile image updated successfully' 
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    
    // Delete the uploaded file if error occurred
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to upload profile image' 
    });
  }
};

// Upload profile image for new user (before creation)
const uploadProfileImageForNewUser = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }

    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    
    res.status(200).json({ 
      success: true,
      profile_image: imageUrl,
      message: 'Profile image uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    
    // Delete the uploaded file if error occurred
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to upload profile image' 
    });
  }
};


module.exports = {createUser, getUsers,getUserById,updateUser,deleteUser,  uploadProfileImage, uploadProfileImageForNewUser,upload };