 // src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../../utilities/multer'); // For image uploads
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// Public routes for getting products
router.get('/', validate([
  query('category').optional().isString().withMessage('Category must be a string'),
  query('sort').optional().isString().withMessage('Sort format is invalid'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be a positive integer up to 100'),
]), productController.getAllProducts);

router.get('/:productId', validate([
  param('productId').isMongoId().withMessage('Invalid product ID'),
]), productController.getProductById);

// Protected routes for sellers to manage products
router.post('/', authenticate, authorize(['seller']), upload.array('images', 5), validate([
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Product price must be a number'),
  body('category').notEmpty().withMessage('Product category is required'),
  // Add more validation rules as needed
]), productController.createProduct);

router.put('/:productId', authenticate, authorize(['seller']), upload.array('images', 5), validate([
  param('productId').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Product description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Product price must be a number'),
  body('category').optional().notEmpty().withMessage('Product category is required'),
  // Add more validation rules as needed for updates
]), productController.updateProduct);

router.delete('/:productId', authenticate, authorize(['seller']), validate([
  param('productId').isMongoId().withMessage('Invalid product ID'),
]), productController.deleteProduct);

module.exports = router;