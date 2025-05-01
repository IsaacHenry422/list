class AppError extends Error {
  constructor(statusCode, status, message, details = null) {
      super(message);
      this.statusCode = statusCode;
      this.status = status;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;