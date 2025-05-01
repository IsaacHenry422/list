const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
const logger = require('../utilities/logger');
const AppError = require('../utilities/customError');

module.exports = {
    initializePayment: async (email, amount) => {
        try {
            const response = await Paystack.transaction.initialize({ email, amount: amount * 100 });
            logger.info('Paystack payment initialization successful:', response);
            return response;
        } catch (error) {
            logger.error('Error initializing Paystack payment:', error);
            throw new AppError(500, 'fail', 'Failed to initialize Paystack payment', error);
        }
    },

    verifyPayment: async (reference) => {
        try {
            const response = await Paystack.transaction.verify({ reference });
            logger.info('Paystack payment verification successful:', response);
            return response;
        } catch (error) {
            logger.error('Error verifying Paystack payment:', error);
            throw new AppError(500, 'fail', 'Failed to verify Paystack payment', error);
        }
    }
};