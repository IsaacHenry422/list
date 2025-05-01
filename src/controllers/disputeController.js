//src/controllers/disputeController.js
const Dispute = require('../models/disputeModel'); // Import the Dispute model
const logger = require('../utilities/logger'); // Import logger
const createDispute = async (req, res, next) => {
  try {
    const dispute = new Dispute({ ...req.body, buyerId: req.userId }); // Create a new dispute object
    await dispute.save(); // Save the dispute to the database
    res.status(201).json(dispute); // Return the created dispute
  } catch (error) {
    logger.error('Error creating dispute:', error); // Log the error
    next(error); // Pass error to error handling middleware
  }
};

const resolveDispute = async (req, res, next) => {
  try {
    const { disputeId } = req.params; // Extract dispute ID from request parameters
    const { resolution, status } = req.body; // Extract resolution and status from request body
    const dispute = await Dispute.findByIdAndUpdate(disputeId, { resolution, status }, { new: true }); // Update the dispute
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' }); // Return 404 if dispute not found
    }
    res.json(dispute); // Return the updated dispute
  } catch (error) {
    logger.error('Error resolving dispute:', error); // Log the error
    next(error); // Pass error to error handling middleware
  }
};

module.exports = { createDispute, resolveDispute };