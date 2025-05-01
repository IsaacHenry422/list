// src/routes/transactionRoutes.js
const express = require('express'); // Import Express.js framework
const router = express.Router(); // Create an Express router instance
const { createTransaction, getTransactionsByOrder } = require('../controllers/transactionController'); // Import controller functions
const authenticate = require('../middleware/authenticationMiddleware'); // Import authentication middleware
const { body, param } = require('express-validator'); // Import express-validator for input validation
const { validate } = require('../middleware/validationMiddleware'); // Correctly import the validate middleware function

// Route to create a new transaction (POST /) - requires authentication and validation
router.post('/', authenticate, validate([
  body('orderId').isMongoId().withMessage('Invalid order ID'), // Validate orderId: must be a valid MongoDB ObjectId
  body('paymentReference').notEmpty().withMessage('Payment reference is required'), // Validate paymentReference: must not be empty
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'), // Validate amount: must be a positive float
]), createTransaction); // Apply validation middleware, then call the createTransaction controller

// Route to get transactions by order ID (GET /:orderId) - requires authentication and validation
router.get('/:orderId', authenticate, validate([
  param('orderId').isMongoId().withMessage('Invalid order ID'), // Validate orderId: must be a valid MongoDB ObjectId parameter
]), getTransactionsByOrder); // Apply validation middleware, then call the getTransactionsByOrder controller

module.exports = router; // Export the router for use in app.js

/*
xplanation of Inlines:

Imports: Each import is explained, clarifying its purpose.
Route Definitions: Each route is documented with its HTTP method, path, and the middleware/controller functions it uses.
Validation: The validation rules for each field (orderId, paymentReference, amount) and parameter (orderId) are explained, including which fields are validated and what type of validation is performed.
Authentication: The use of authenticate middleware is explained, highlighting the security requirements of the route.
Controller Calls: The calls to the relevant controller functions (createTransaction, getTransactionsByOrder) are also included.
Export: The exporting of the router is explained.





*/