 // src/controllers/userController.js

const User = require('../models/userModel');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return next(new AppError(404, 'fail', 'User not found'));
        }
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        logger.error('Error fetching user profile:', error);
        next(error);
    }
};

exports.updateUserProfile = async (req, res, next) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['fullName', 'email', 'address', 'phoneNumber'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return next(new AppError(400, 'fail', 'Invalid updates!'));
        }

        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            return next(new AppError(404, 'fail', 'User not found'));
        }

        res.status(200).json({ status: 'success', data: { user } });

    } catch (error) {
        logger.error('Error updating user profile:', error);
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return next(new AppError(404, 'fail', 'User not found'));
        }

        res.status(204).json({ status: 'success', data: null }); // 204 No Content for successful deletion
    } catch (error) {
        logger.error(`Error deleting user with ID ${req.params.userId}:`, error);
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return next(new AppError(404, 'fail', 'User not found'));
        }

        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        logger.error(`Error fetching user with ID ${req.params.userId}:`, error);
        next(error);
    }
};