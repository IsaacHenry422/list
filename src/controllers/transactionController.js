const Transaction = require('../models/transactionModel'); // Assuming you have a Transaction model
const Order = require('../models/orderModel'); // Assuming you have an Order model
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');

exports.createTransaction = async (req, res, next) => {
    try {
        const { orderId, paymentReference, amount } = req.body;

        // Verify if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new AppError(404, 'fail', 'Order not found'));
        }

        // Potentially check if the amount matches the order total (optional)
        // if (amount !== order.totalAmount) {
        //     return next(new AppError(400, 'fail', 'Payment amount does not match order total'));
        // }

        const newTransaction = new Transaction({
            order: orderId, // Use orderId to reference the Order
            paymentReference,
            amount,
            status: 'pending', // Initial status
            // Associate the transaction with the logged-in user
            user: req.user._id,
        });

        const savedTransaction = await newTransaction.save();
        logger.info('New transaction created:', savedTransaction);
        res.status(201).json({ status: 'success', data: { transaction: savedTransaction } });

    } catch (error) {
        logger.error('Error creating transaction:', error);
        next(error);
    }
};

exports.getTransactionsByOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Verify if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new AppError(404, 'fail', 'Order not found'));
        }

        // Depending on your authorization rules, you might want to ensure
        // that the logged-in user is associated with this order before
        // allowing them to view transactions.

        const transactions = await Transaction.find({ order: orderId });
        logger.info(`Transactions found for order ID ${orderId}:`, transactions);
        res.status(200).json({ status: 'success', data: { transactions } });

    } catch (error) {
        logger.error('Error fetching transactions by order ID:', error);
        next(error);
    }
};

module.exports = { createTransaction, getTransactionsByOrder };