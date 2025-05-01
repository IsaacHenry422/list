 // src/controllers/sellerController.js

const User = require('../models/userModel'); // Assuming seller info is linked to the User model
const Seller = require('../models/sellerModel'); // Or you might have a dedicated Seller model
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');

exports.getProfile = async (req, res, next) => {
    try {
        // Assuming the authenticated user's ID is available in req.user (set by your authentication middleware)
        const userId = req.user.id; // Or however you identify the logged-in user

        // If seller details are in the User model:
        const sellerProfile = await User.findById(userId);

        // If you have a separate Seller model linked to the User model:
        // const seller = await Seller.findOne({ userId: userId }).populate('userId'); // To get user details

        if (!sellerProfile) {
            return next(new AppError(404, 'fail', 'Seller profile not found'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                seller: {
                    _id: sellerProfile._id,
                    // Include relevant profile information from your User or Seller model
                    fullName: sellerProfile.fullName, // Example
                    email: sellerProfile.email,       // Example
                    role: sellerProfile.role,         // Example
                    // ... other relevant fields
                },
            },
        });

    } catch (error) {
        logger.error('Error fetching seller profile:', error);
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // Or however you identify the logged-in user

        // Update logic based on your User or Seller model
        const updatedSeller = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedSeller) {
            return next(new AppError(404, 'fail', 'Seller profile not found'));
        }

        res.status(200).json({
            status: 'success',
            data: { seller: updatedSeller },
        });

    } catch (error) {
        logger.error('Error updating seller profile:', error);
        next(error);
    }
};

exports.updateBio = async (req, res, next) => {
    try {
        const userId = req.user.id; // Or however you identify the logged-in user

        // Update logic for the bio field in your User or Seller model
        const updatedSeller = await User.findByIdAndUpdate(
            userId,
            { bio: req.body.bio },
            { new: true, runValidators: true }
        );

        if (!updatedSeller) {
            return next(new AppError(404, 'fail', 'Seller profile not found'));
        }

        res.status(200).json({
            status: 'success',
            data: { seller: updatedSeller },
        });

    } catch (error) {
        logger.error('Error updating seller bio:', error);
        next(error);
    }
};

module.exports = exports;