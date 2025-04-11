const { body, validationResult } = require('express-validator');

const validateLogin = [
    body('customerId')
        .trim()
        .notEmpty().withMessage('Customer ID is required'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

const validateUpdateProfile = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 100 }).withMessage('First name too long'),
    
    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 100 }).withMessage('Last name too long'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .isLength({ max: 100 }).withMessage('Email too long')
];

const validateChangePassword = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

module.exports = {
    validateLogin,
    validateUpdateProfile,
    validateChangePassword,
    validationResult
};