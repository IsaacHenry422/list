const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// GET /seller/profile - Get seller profile (requires authentication and seller role)
router.get('/profile', authenticate, authorize(['seller']), sellerController.getProfile);

// PUT /seller/profile - Update seller profile (requires authentication and seller role)
router.put('/profile', authenticate, authorize(['seller']), validate([
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
    body('phoneNumber').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
    // Add any other relevant fields for the seller profile here with validation
    // Example:
    // body('businessName').optional().trim().notEmpty().withMessage('Business name cannot be empty'),
]), sellerController.updateProfile);

// PUT /seller/bio - Update seller bio (requires authentication and seller role)
router.put('/bio', authenticate, authorize(['seller']), validate([
    body('bio').trim().notEmpty().withMessage('Bio cannot be empty'),
]), sellerController.updateBio);

module.exports = router;