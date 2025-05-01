const User = require('../models/userModel');
const logger = require('../utilities/logger');

const authenticate = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            if (user) {
                req.user = user;
                return next();
            } else {
                logger.warn('Authentication failed: User ID in session not found in database');
                return res.status(401).json({ message: 'Not authorized' });
            }
        } catch (error) {
            logger.error('Error during authentication:', error);
            return res.status(500).json({ message: 'Internal server error during authentication' });
        }
    } else {
        logger.warn('Authentication failed: No session or user ID found');
        return res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = authenticate;