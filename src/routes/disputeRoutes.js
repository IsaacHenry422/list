// src/routes/disputeRoutes.js
const express = require('express'); // Import Express.js framework
const router = express.Router(); // Create an Express router instance
const { createDispute, resolveDispute } = require('../controllers/disputeController'); // Import controller functions
const authenticate = require('../middleware/authenticationMiddleware'); // Import authentication middleware
const { param, body } = require('express-validator'); // Import express-validator for input validation
const { validate } = require('../middleware/validationMiddleware'); // Correctly import the validate middleware function

// Route to create a new dispute (POST /) - requires authentication and validation
router.post('/', authenticate, validate([
  body('orderId').notEmpty().withMessage('Order ID is required'), // Validate orderId: must not be empty
  body('reason').notEmpty().withMessage('Reason is required'), // Validate reason: must not be empty
  // You might want to add more validation rules here
]), createDispute); // Apply validation middleware, then call the createDispute controller

// Route to resolve a dispute (PATCH /:disputeId) - requires authentication and validation
router.patch('/:disputeId', authenticate, validate([
  param('disputeId').isMongoId().withMessage('Invalid dispute ID'), // Validate disputeId: must be a valid MongoDB ObjectId
  body('resolution').notEmpty().withMessage('Resolution is required'), // Validate resolution: must not be empty
  body('status').isIn(['open', 'in progress', 'resolved']).withMessage('Invalid status'), // Validate status: must be one of the specified values
]), resolveDispute); // Apply validation middleware, then call the resolveDispute controller

module.exports = router; // Export the router for use in app.js
/*Explanation of Inlines:

Imports: Each import is explained, clarifying its purpose.
Route Definitions: Each route is documented with its HTTP method, path, and the middleware/controller functions it uses.
Validation: The validation rules for each field (orderId, reason, disputeId, resolution, status) are explained, including which fields are validated and what type of validation is performed.
Authentication: The use of authenticate middleware is explained, highlighting the security requirements of the route.
Controller Calls: The calls to the relevant controller functions (createDispute, resolveDispute) are also included.
Export: The exporting of the router is explained.*/