const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const emailService = require('../services/emailService');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Registration validation failed:', errors.array());
        return next(new AppError(400, 'fail', 'Validation error', errors.array()));
    }

    const { username, email, password } = req.body; // 
    try {
        let user = await User.findOne({ email });
        if (user) {
            logger.warn(`Registration attempted with existing email: ${email}`);
            return next(new AppError(409, 'fail', 'Email address is already registered'));
        }

        const verificationToken = uuidv4();
        user = new User({ username, email, password, verificationToken }); 
        await user.save();
        logger.info(`User registered successfully: ${user.email} (ID: ${user._id})`);

        await emailService.sendVerificationEmail(user);

        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });

    } catch (error) {
        logger.error('Error registering user:', error);
        return next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    const { token } = req.query;

    if (!token) {
        logger.warn('Verify email request with missing token.');
        return next(new AppError(400, 'fail', 'Verification token is missing.'));
    }

    try {
        const user = await User.findOne({ verificationToken: token, isVerified: false });

        if (user) {
            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();
            logger.info(`Email verified successfully for user: ${user.email} (ID: ${user._id})`);
            return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
        } else {
            logger.warn(`Invalid or expired verification token: ${token}`);
            return next(new AppError(400, 'fail', 'Invalid or expired verification token.'));
        }
    } catch (error) {
        logger.error('Error verifying email:', error);
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            logger.warn(`Login failed: User not found with email: ${email}`);
            return next(new AppError(401, 'fail', 'Incorrect email and password combination.'));
        }

        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
            logger.warn(`Login failed: Incorrect password for user: ${email}`);
            return next(new AppError(401, 'fail', 'Incorrect email and password combination.'));
        }

        if (!user.isVerified) {
            logger.warn(`Login attempted for unverified user: ${email}`);
            return next(new AppError(403, 'fail', 'Your account has not been verified. Please check your email.'));
        }

        req.session.userId = user._id;
        req.session.isLoggedIn = true;
        req.session.email = user.email;
        logger.info(`User logged in successfully: ${user.email} (ID: ${user._id})`);

        res.status(200).json({ message: 'Login successful.', user: { _id: user._id, username: user.username, fullName: user.fullName, email: user.email } }); // Included username in response

    } catch (error) {
        logger.error('Error during login:', error);
        return next(error);
    }
};