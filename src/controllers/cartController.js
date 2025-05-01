const CartItem = require('../models/cartItemModel');
const Product = require('../models/productModel');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');

exports.addItemToCart = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const { productId, quantity } = req.body;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError(404, 'fail', 'Product not found'));
        }

        // Check if the item is already in the cart for this user
        let cartItem = await CartItem.findOne({ user: userId, product: productId });

        if (cartItem) {
            // If it exists, update the quantity
            cartItem.quantity += quantity;
            await cartItem.save();
            logger.info(`Quantity updated for product ${productId} in user ${userId}'s cart`);
        } else {
            // If it doesn't exist, create a new cart item
            cartItem = await CartItem.create({ user: userId, product: productId, quantity });
            logger.info(`Product ${productId} added to user ${userId}'s cart`);
        }

        const populatedCartItem = await cartItem.populate('product'); // Populate product details

        res.status(201).json({
            status: 'success',
            data: {
                cartItem: populatedCartItem,
            },
        });

    } catch (error) {
        logger.error('Error adding item to cart:', error);
        next(error);
    }
};

exports.getUserCart = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const cartItems = await CartItem.find({ user: userId }).populate('product');
        logger.info(`Retrieved cart for user ${userId}`);
        res.status(200).json({
            status: 'success',
            data: {
                cartItems,
            },
        });
    } catch (error) {
        logger.error('Error getting user cart:', error);
        next(error);
    }
};

exports.updateCartItemQuantity = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        const userId = req.session.userId;

        const cartItem = await CartItem.findById(cartItemId);

        if (!cartItem) {
            return next(new AppError(404, 'fail', 'Cart item not found'));
        }

        if (cartItem.user.toString() !== userId) {
            return next(new AppError(403, 'fail', 'Not authorized to update this cart item'));
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        const populatedCartItem = await cartItem.populate('product');
        logger.info(`Updated quantity for cart item ${cartItemId} to ${quantity}`);
        res.status(200).json({
            status: 'success',
            data: {
                cartItem: populatedCartItem,
            },
        });

    } catch (error) {
        logger.error(`Error updating cart item ${req.params.cartItemId}:`, error);
        next(error);
    }
};

exports.removeCartItem = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.session.userId;

        const cartItem = await CartItem.findById(cartItemId);

        if (!cartItem) {
            return next(new AppError(404, 'fail', 'Cart item not found'));
        }

        if (cartItem.user.toString() !== userId) {
            return next(new AppError(403, 'fail', 'Not authorized to remove this cart item'));
        }

        await CartItem.findByIdAndDelete(cartItemId);
        logger.info(`Removed cart item ${cartItemId} for user ${userId}`);
        res.status(204).send(); // 204 No Content for successful deletion

    } catch (error) {
        logger.error(`Error removing cart item ${req.params.cartItemId}:`, error);
        next(error);
    }
};