const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getUserById,
} = require('../controllers/userController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware'); // This is the line you are adding

// Get user profile (requires authentication)
router.get('/profile', authenticate, getUserProfile);

// Update user profile (requires authentication and input validation)
router.patch('/profile', authenticate, validate([
    //body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
    body('phoneNumber').optional().trim().notEmpty().withMessage('Phone number cannot be empty')
]), updateUserProfile);

// Delete user (requires authentication, admin role, and user ID validation)
router.delete('/:userId', authenticate, authorize(['admin']), validate([
    param('userId').isMongoId().withMessage('Invalid user ID'),
]), deleteUser);

// Get user by ID (requires authentication, admin role, and user ID validation)
router.get('/:userId', authenticate, authorize(['admin']), validate([
    param('userId').isMongoId().withMessage('Invalid user ID'),
]), getUserById);

module.exports = router;