const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticationController = require('../controllers/authenticationController');

router.post(
    '/register',
    [
        body('username').trim().notEmpty().withMessage('Username is required'),
        body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
       // body('confirmPassword').custom((value, { req }) => {
          //  if (value !== req.body.password) {
           //     throw new Error('Password confirmation does not match password');
         //   }
         //   return true;
       // })
        // 'fullName' validation is removed here to make it optional
    ],
    authenticationController.register
);

router.get('/verify-email', authenticationController.verifyEmail);

router.post(
    '/login',
    [
        body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    authenticationController.login
);

module.exports = router;