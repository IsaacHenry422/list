const imageService = require('../services/imageService');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');

exports.uploadSingleImage = async (req, res, next) => {
    try {
        const imageUrl = await imageService.uploadImage(req, res, next);
        logger.info('Image uploaded successfully:', imageUrl);
        res.status(200).json({ message: 'Image uploaded successfully', imageUrl: imageUrl });
    } catch (error) {
        logger.error('Error handling image upload in controller:', error);
        next(error); // Pass the error to your error handler
    }
};