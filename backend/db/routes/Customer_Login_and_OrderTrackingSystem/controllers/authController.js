const pool = require('../../../databaseConnection/mysqlConnection');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Customer Login
const loginCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { customerId, password } = req.body;

        const [customers] = await pool.query(
            'SELECT * FROM customers WHERE customerId = ?',
            [customerId]
        );

        if (customers.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const customer = customers[0];
        const isMatch = await bcrypt.compare(password, customer.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { 
                customerId: customer.customerId,
                email: customer.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Optional: Only include if you need it for localStorage
            customer: {
                customerId: customer.customerId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Customer Logout
const logoutCustomer = (req, res) => {
    try {
        // Clear the HTTP-only cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get Customer Profile
const getCustomerProfile = async (req, res) => {
    try {
        // The customerId is extracted from the JWT by the auth middleware
        const customerId = req.customer.customerId;

        const [customers] = await pool.query(
            'SELECT customerId, firstName, lastName, email, createdAt FROM customers WHERE customerId = ?',
            [customerId]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.status(200).json({
            success: true,
            customer: customers[0]
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update Customer Profile
const updateCustomerProfile = async (req, res) => {
    try {
        const customerId = req.customer.customerId;
        const { firstName, lastName, email } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if email is being changed to one that already exists
        const [emailCheck] = await pool.query(
            'SELECT customerId FROM customers WHERE email = ? AND customerId != ?',
            [email, customerId]
        );

        if (emailCheck.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use by another customer'
            });
        }

        await pool.query(
            'UPDATE customers SET firstName = ?, lastName = ?, email = ? WHERE customerId = ?',
            [firstName, lastName, email, customerId]
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            customer: {
                customerId,
                firstName,
                lastName,
                email
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const customerId = req.customer.customerId;
        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const [customers] = await pool.query(
            'SELECT password FROM customers WHERE customerId = ?',
            [customerId]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, customers[0].password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.query(
            'UPDATE customers SET password = ? WHERE customerId = ?',
            [hashedPassword, customerId]
        );

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    loginCustomer,
    logoutCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    changePassword
};