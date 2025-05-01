const logger = require('./logger');
const AppError = require('./customError');

const errorHandler = (err, req, res, next) => {
    logger.error('Error:', err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            details: err.details,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

module.exports = errorHandler;