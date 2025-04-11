const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../../databaseConnection/mysqlConnection');

// Your login route (updated)
const loginCustomer = async (req, res) => {
    try {
        const { customerId, password } = req.body;

        if (!customerId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Customer ID and password are required'
            });
        }

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
            sameSite: 'none',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
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
const logoutCustomer = (req, res) => {
    try {
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
            message: 'Logout failed'
        });
    }
};

module.exports = { loginCustomer, logoutCustomer };