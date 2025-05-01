const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const logger = require('../../utilities/logger');

exports.sendVerificationEmail = async (user) => {
    try {
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
        const data = {
            from: process.env.EMAIL_FROM || 'your-email@example.com',
            to: [user.email],
            subject: 'Verify Your Email Address',
            html: `
                <p>Hello ${user.fullName},</p>
                <p>Thank you for signing up for Crownlist!</p>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
                <p>This link will expire in [expiry time, e.g., 24 hours].</p>
                <p>If you did not create an account, please ignore this email.</p>
            `
        };
        const result = await mailgun.messages().send(data);
        logger.info(`Verification email sent via Mailgun to: ${user.email} (Message ID: ${result.id})`);
    } catch (error) {
        logger.error('Error sending verification email via Mailgun:', error);
        throw new Error('Failed to send verification email');
    }
};