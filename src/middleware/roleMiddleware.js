 // src/middleware/roleMiddleware.js

const AppError = require('../../utilities/customError');

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'fail', 'You do not have permission to access this resource'));
    }
    next();
  };
};

module.exports = authorize;