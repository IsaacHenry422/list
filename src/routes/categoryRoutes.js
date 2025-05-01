const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// Public route to get all categories
router.get('/', categoryController.getAllCategories);

// Admin-protected routes for managing categories
router.post('/admin/categories', authenticate, authorize(['admin']), validate([
    body('name').notEmpty().withMessage('Category name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
]), categoryController.createCategory);

router.put('/admin/categories/:categoryId', authenticate, authorize(['admin']), validate([
    param('categoryId').isMongoId().withMessage('Invalid category ID'),
    body('name').optional().notEmpty().withMessage('Category name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
]), categoryController.updateCategory);

router.delete('/admin/categories/:categoryId', authenticate, authorize(['admin']), validate([
    param('categoryId').isMongoId().withMessage('Invalid category ID'),
]), categoryController.deleteCategory);

module.exports = router;