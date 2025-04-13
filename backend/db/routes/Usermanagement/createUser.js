const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');
const bcrypt = require('bcrypt'); 
const nodemailer = require('nodemailer');


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
  let connection;
  try {
    // Handle file upload
    let imageUrl = ''; 
    if (req.file) {
      imageUrl = `/uploads/profile-images/${req.file.filename}`;
    }

    // Validate user data
    const validation = validateUserData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed",
        details: validation.errors 
      });
    }

    const {
      emp_id,
      username,
      email,
      role,
      teamRole = null,
      teamLeaderName = null,
      phone_number = '',
      current_salary = '',
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

    // Get database connection
    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check for duplicates
      const [existing] = await connection.query(
        `SELECT 
          SUM(emp_id = ?) as emp_id_count,
          SUM(email = ?) as email_count,
          ${!['Sales Department'].includes(role) ? `SUM(role = ?) as role_count` : '0 as role_count'}
        FROM users FOR UPDATE`,
        ['Sales Department'].includes(role) ? [emp_id, email] : [emp_id, email, role]
      );

      const { emp_id_count, email_count, role_count } = existing[0];

      if (emp_id_count > 0 || email_count > 0 || role_count > 0) {
        await connection.rollback();
        const errors = {};
        if (emp_id_count > 0) errors.emp_id = 'Employee ID exists';
        if (email_count > 0) errors.email = 'Email exists';
        if (role_count > 0) errors.role = 'Role already assigned';
        
        return res.status(409).json({
          success: false,
          error: 'Duplicate entries',
          details: errors
        });
      }

     
      let emailSent = false;

 


      // Password handling
let hashedPassword = null;
let generatedPassword = null;

if (role !== 'Sales Department') {
  // Generate password only for non-Sales users
  generatedPassword = Math.random().toString(36).slice(-8);
  hashedPassword = await bcrypt.hash(generatedPassword, 10);
}

      // Insert user with null password for Sales Department
      const [result] = await connection.query(
        `INSERT INTO users SET ?`,
        {
          emp_id,
          username,
          email,
          password: role === 'Sales Department' ? null : hashedPassword,
          role,
          teamRole,
          teamLeaderName,
          phone_number,
          current_salary,
          profile_image: imageUrl,
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

      // Email handling
      if (process.env.NODE_ENV !== 'test') {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
            }
          });

          if (role === 'Sales Department') {
            await transporter.sendMail({
              from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: 'Welcome to Sales Team',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                  <h2 style="color: #2c3e50;">Welcome to Our Sales Team!</h2>
                  <p>Hello ${username},</p>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <p><strong>Employee ID:</strong> ${emp_id}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Role:</strong> ${role}</p>
                  </div>
                  <p>HR will contact you with onboarding details.</p>
                </div>
              `
            });
            emailSent = true;
          } else {
            await transporter.sendMail({
              from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: 'Your Account Credentials',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                  <h2 style="color: #2c3e50;">Welcome to Our Company!</h2>
                  <p>Hello ${username},</p>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <p><strong>Employee ID:</strong> ${emp_id}</p>
                    <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
                  </div>
                  <p>Login at: <a href="${req.protocol}://${req.get('host')}/login">${req.protocol}://${req.get('host')}/login</a></p>
                  <p style="color: #e74c3c;">Please change your password after first login.</p>
                </div>
              `
            });
            emailSent = true;
          }
        } catch (emailError) {
          console.error('Email failed:', emailError);
        }
      }

      await connection.commit();

      // Get created user without sensitive data
      const [newUser] = await connection.query(
        `SELECT id, emp_id, username, email, role, profile_image 
         FROM users WHERE id = ?`,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: role === 'Sales Department'
          ? 'Sales user created successfully (no password)'
          : 'User created with credentials',
        user: {
          ...newUser[0],
          profile_image: newUser[0].profile_image
            ? `${req.protocol}://${req.get('host')}${newUser[0].profile_image}`
            : null
        },
        emailStatus: emailSent ? 'sent' : 'not_sent'
      });

    } catch (dbError) {
      await connection.rollback();
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? dbError.message : null
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  } finally {
    if (connection) connection.release();
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

const updateUser = async (req, res) => {
  let newImagePath;
  try {
    const userId = req.params.id;

    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle file upload
    let profileImagePath = existingUser[0].profile_image;
    if (req.file) {
      // Set new image path
      profileImagePath = `/uploads/profile-images/${req.file.filename}`;
      newImagePath = path.join(
        __dirname,
        '../public/uploads/profile-images',
        req.file.filename
      );

      // Delete old image if it exists and isn't default
      if (existingUser[0].profile_image && 
          existingUser[0].profile_image !== '/default-avatar.png') {
        const oldImagePath = path.join(
          __dirname, 
          '../public',
          existingUser[0].profile_image
        );
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    }

    // Validate request body
    const validation = validateUserData(req.body);
    if (!validation.isValid) {
      cleanUpFile(newImagePath);
      return res.status(400).json({ error: validation.error });
    }

    const {
      emp_id,
      username,
      email,
      role,
      teamRole = null,
      teamLeaderName = null,
      phone_number,
      current_salary,
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

    // Check for duplicates
    const [duplicate] = await pool.query(
      'SELECT id FROM users WHERE (emp_id = ? OR email = ?) AND id != ?',
      [emp_id, email, userId]
    );

    if (duplicate.length > 0) {
      cleanUpFile(newImagePath);
      return res.status(409).json({ error: 'User with this ID or email already exists' });
    }

    // Prepare update data
    const updateData = {
      emp_id,
      username,
      email,
      role,
      teamRole,
      teamLeaderName,
      phone_number,
      current_salary,
      profile_image: profileImagePath,
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
    };

    // Update user in database
    await pool.query(
      'UPDATE users SET ? WHERE id = ?',
      [updateData, userId]
    );

    // Get updated user data
    const [updatedUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    // Construct full image URL for response
    const userWithImageUrl = {
      ...updatedUser[0],
      profile_image: updatedUser[0].profile_image
        ? `${req.protocol}://${req.get('host')}${updatedUser[0].profile_image}`
        : null
    };
    
    res.status(200).json(userWithImageUrl);
  } catch (error) {
    console.error('Error updating user:', error);
    cleanUpFile(newImagePath);
    res.status(500).json({ 
      error: 'Failed to update user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to clean up uploaded files
function cleanUpFile(filePath) {
  if (!filePath) return;
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Error cleaning up file:', err);
  }
}

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