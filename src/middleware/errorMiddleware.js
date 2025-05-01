const AppError = require('../../utilities/customError');
const logger = require('../../utilities/logger');

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error('Global Error Handler:', err);

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (error.name === 'CastError') {
            error = new AppError(400, 'fail', `Invalid ${error.path}: ${error.value}`);
        }

        if (error.code === 11000) {
            error = new AppError(400, 'fail', 'Duplicate field value. Please use another value.');
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            error = new AppError(400, 'fail', `Invalid input data. ${errors.join('. ')}`);
        }

        res.status(error.statusCode).json({
            status: error.status,
            message: error.message || 'Something went wrong!',
        });
    }

    next();
};

module.exports = errorMiddleware;