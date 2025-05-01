const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middleware/authenticationMiddleware');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// Requires authentication for all cart-related routes
router.use(authenticate);

// Add item to cart
router.post('/items', validate([
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]), cartController.addItemToCart);

// Get user's cart
router.get('/', cartController.getUserCart);

// Update quantity of an item in the cart
router.put('/items/:cartItemId', validate([
    param('cartItemId').isMongoId().withMessage('Invalid cart item ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]), cartController.updateCartItemQuantity);

// Remove an item from the cart
router.delete('/items/:cartItemId', validate([
    param('cartItemId').isMongoId().withMessage('Invalid cart item ID'),
]), cartController.removeCartItem);

module.exports = router;
