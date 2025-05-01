 // src/models/disputeModel.js
const mongoose = require('mongoose'); // Import Mongoose

const disputeSchema = new mongoose.Schema({ // Define the dispute schema
  orderId: {
    type: mongoose.Schema.Types.ObjectId, // Define the type as ObjectId
    ref: 'Order', // Reference the 'Order' model
    required: true, // Make it a required field
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId, // Define the type as ObjectId
    ref: 'User', // Reference the 'User' model (buyer)
    required: true, // Make it a required field
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId, // Define the type as ObjectId
    ref: 'User', // Reference the 'User' model (seller)
    required: true, // Make it a required field
  },
  reason: {
    type: String, // Define the type as String
    required: true, // Make it a required field
  },
  description: {
    type: String, // Define the type as String
    default: null, // Allow null values
  },
  status: {
    type: String, // Define the type as String
    enum: ['open', 'in progress', 'resolved'], // Define allowed values
    default: 'open', // Set default value
  },
  resolution: {
    type: String, // Define the type as String
    default: null, // Allow null values
  },
  disputeDate: {
    type: Date, // Define the type as Date
    default: Date.now, // Set default value to current date
  },
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

module.exports = mongoose.model('Dispute', disputeSchema); // Export the Dispute model