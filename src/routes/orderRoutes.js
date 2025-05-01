const express = require('express');
const router = express.Router();
const { createOrder, completeOrder, getOrderById } = require('../controllers/orderController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/roleMiddleware'); // Import authorize middleware
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// Route to create a new order (POST /) - requires authentication and validation
router.post('/', authenticate, validate([
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    // Optional: Add validation for other potential order details
    // body('paymentMethod').optional().notEmpty().withMessage('Payment method is required'),
    // body('orderTotal').optional().isFloat({ min: 0.01 }).withMessage('Order total must be a positive number'),
]), createOrder);

// Route to complete an order (PATCH /:orderId/complete) - requires authentication and authorization
router.patch('/:orderId/complete', authenticate, authorize(['seller', 'admin']), validate([ // Only sellers or admins can complete orders
    param('orderId').isMongoId().withMessage('Invalid order ID'),
]), completeOrder);

// GET /orders/:orderId - Get order details by ID (requires authentication and validation)
router.get('/:orderId', authenticate, validate([
    param('orderId').isMongoId().withMessage('Invalid order ID'),
]), getOrderById);

module.exports = router;