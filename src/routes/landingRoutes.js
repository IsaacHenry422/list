 // src/routes/landingRoutes.js
const express = require('express'); // Import Express.js
const router = express.Router(); // Create a new router instance
const landingController = require('../controllers/landingController'); // Import the landing controller
const { param } = require('express-validator'); // Import the param validator from express-validator
const validate = require('../middleware/validationMiddleware'); // Import the custom validation middleware

// GET /landing/categories/:categoryName - Get products by category name
router.get('/categories/:categoryName', validate([ // Define a GET route with validation
  param('categoryName').notEmpty().withMessage('Category name is required'), // Validate the categoryName parameter
]), landingController.getProductsByCategory); // Use the landing controller's method

module.exports = router; // Export the router