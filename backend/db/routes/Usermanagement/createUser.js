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
  try {
    // Handle file upload
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/profile-images/${req.file.filename}`;
    }

    const validation = validateUserData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
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

    // Check for duplicate emp_id
    const [existingEmpId] = await pool.query(
      'SELECT id FROM users WHERE emp_id = ?',
      [emp_id]
    );

    // Check for duplicate email
    const [existingEmail] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    let existingRole = [];
    if (!['Sales Department'].includes(role)) {
      [existingRole] = await pool.query(
        'SELECT id FROM users WHERE role = ?',
        [role]
      );
    }

    // Return specific error messages for each duplicate case
    if (existingEmpId.length > 0 && existingEmail.length > 0) {
      return res.status(409).json({ 
        error: 'Both Employee ID and Email already exist',
        duplicates: {
          emp_id: 'Employee ID already exists',
          email: 'Email already exists'
        }
      });
    } else if (existingEmpId.length > 0) {
      return res.status(409).json({ 
        error: 'Employee ID already exists',
        field: 'emp_id'
      });
    } else if (existingEmail.length > 0) {
      return res.status(409).json({ 
        error: 'Email already exists',
        field: 'email'
      });
    } else if (existingRole.length > 0) {
      return res.status(409).json({ 
        error: 'Role already assigned to another user',
        field: 'role'
      });
    }

    // Generate a random password (8 characters with letters and numbers)
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Insert new user with profile image and password
    const [result] = await pool.query(
      `INSERT INTO users SET ?`,
      {
        emp_id,
        username,
        email,
        password: hashedPassword,
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

    // Get the created user
    const [newUser] = await pool.query(
      'SELECT id, emp_id, username, email, role, profile_image FROM users WHERE id = ?',
      [result.insertId]
    );
    
    // Prepare user response
    const userResponse = {
      ...newUser[0],
      profile_image: newUser[0].profile_image
        ? `${req.protocol}://${req.get('host')}${newUser[0].profile_image}`
        : null
    };

    // Send email with credentials
    try {
      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // Email content
      const mailOptions = {
        from: `"Your Company Name" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Your New Account Credentials',
        html: `
          <p>Hello ${username},</p>
          <p>Your account has been successfully created. Here are your login credentials:</p>
          <p><strong>Employee ID:</strong> ${emp_id}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
          <p>Please login at <a href="${req.protocol}://${req.get('host')}/login">${req.protocol}://${req.get('host')}/login</a> and change your password immediately.</p>
          <p>If you didn't request this account, please contact our support team.</p>
          <br>
          <p>Best regards,</p>
          <p>Your Company Team</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);
      
      // Log success (optional)
      console.log(`Email sent to ${email} with credentials`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    // Return response without the password
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Failed to create user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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