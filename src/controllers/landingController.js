const Product = require('../models/productModel');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');
const { isValidObjectId } = require('mongoose'); // For potential category ID validation

exports.getProductsByCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.params;
        const { page = 1, limit = 20 } = req.query; // Add pagination parameters

        if (!categoryName || categoryName.trim() === '') {
            logger.warn('getProductsByCategory called with empty categoryName');
            return next(new AppError(400, 'fail', 'Category name is required'));
        }

        // If your category is an ObjectId in the Product model, you might validate it:
        // if (!isValidObjectId(categoryName)) {
        //     logger.warn(`getProductsByCategory called with invalid category ID: ${categoryName}`);
        //     return next(new AppError(400, 'fail', 'Invalid category ID'));
        // }

        const skip = (page - 1) * limit;

        const products = await Product.find({ category: categoryName })
            .skip(skip)
            .limit(parseInt(limit))
            // .populate('seller', 'fullName') // Example: Populate seller details
            // .populate('images', 'url')    // Example: Populate image URLs
            .exec();

        const totalProducts = await Product.countDocuments({ category: categoryName });
        const totalPages = Math.ceil(totalProducts / limit);

        logger.info(`Retrieved ${products.length} products for category: ${categoryName}, page ${page}, limit ${limit}`);
        res.status(200).json({
            status: 'success',
            data: {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    limit: parseInt(limit),
                    totalItems: totalProducts,
                },
            },
        });

    } catch (error) {
        logger.error('Error fetching products by category:', error);
        next(error);
    }
};