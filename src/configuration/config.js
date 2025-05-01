require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000, // Add a default port if not in .env
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET, // Important for session security
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || 'yourActualPaystackSecretKey',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'yourActualCloudinaryCloudName',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'yourActualCloudinaryApiKey',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'yourActualCloudinaryApiSecret',
    EMAIL_USER: process.env.EMAIL_USER || 'yourActualEmailUser',
    EMAIL_PASS: process.env.EMAIL_PASS || 'yourActualEmailPassword',
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || 'yourActualMailgunApiKey',
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || 'yourMailgunDomain.com',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000', // For CORS and email links
    NODE_ENV: process.env.NODE_ENV || 'development', // To determine environment
};