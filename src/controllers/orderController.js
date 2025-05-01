const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');

exports.createOrder = async (req, res, next) => {
    try {
        const { productId, quantity, shippingAddress } = req.body;
        const buyer = req.user._id; // Buyer is the authenticated user

        // 1. Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError(404, 'fail', 'Product not found'));
        }

        // 2. Check if there's enough stock (i might need to implement a stock management system)
        // For now, we'll assume there's enough stock

        // 3. Calculate the order total for this product
        const orderTotal = product.price * quantity;

        // 4. Create the order
        const newOrder = new Order({
            buyer,
            seller: product.user, //  Product model has a 'user' field referencing the seller
            products: [{
                product: productId,
                quantity,
                name: product.name,
                price: product.price,
            }],
            shippingAddress,
            totalAmount: orderTotal,
            // Initial status will be 'pending' by default
        });

        // 5. Save the order to the database
        const savedOrder = await newOrder.save();

        logger.info('New order created:', savedOrder);

        // 6. Respond with the created order
        res.status(201).json({
            status: 'success',
            data: {
                order: savedOrder,
            },
        });

    } catch (error) {
        logger.error('Error creating order:', error);
        next(error);
    }
};

exports.completeOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        // Implement the logic to find and update the order status to 'completed'
        // i'll likely want to add checks for authorization here as well
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status: 'completed' },
            { new: true } // To get the updated document
        );

        if (!order) {
            return next(new AppError(404, 'fail', 'Order not found'));
        }

        logger.info(`Order ${orderId} marked as completed`);

        res.status(200).json({
            status: 'success',
            data: {
                order,
            },
        });

    } catch (error) {
        logger.error('Error completing order:', error);
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate('buyer', 'fullName email') // Populate buyer details
            .populate('seller', 'fullName email') // Populate seller details
            .populate('products.product', 'name description price images') // Populate product details
            .populate('transaction'); // Populate transaction details if available

        if (!order) {
            return next(new AppError(404, 'fail', 'Order not found'));
        }

        // Authorization: Check if the logged-in user is the buyer or the seller
        // associated with the order, or an admin (you'll need to implement role checking)
        if (order.buyer.toString() !== req.user._id.toString() &&
            order.seller.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin') { // Assuming you have a 'role' property on the user
            return next(new AppError(403, 'fail', 'Not authorized to view this order'));
        }

        logger.info(`Order ${orderId} details retrieved by user ${req.user._id}`);

        res.status(200).json({
            status: 'success',
            data: {
                order,
            },
        });

    } catch (error) {
        logger.error('Error fetching order by ID:', error);
        next(error);
    }
};