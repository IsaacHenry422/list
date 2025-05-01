  // src/routes/adminRoutes.js
 const express = require('express'); // 
 const router = express.Router(); // 
 const { getAllUsers } = require('../controllers/adminController'); // Import controller functions
 const authenticate = require('../middleware/authenticationMiddleware'); // Import authentication middleware
 const authorize = require('../middleware/roleMiddleware'); // Import role-based authorization middleware
 
 // Route to get all users (requires authentication and admin role)
 router.get('/users', authenticate, authorize(['admin']), getAllUsers);
 
 module.exports = router; // Export the router