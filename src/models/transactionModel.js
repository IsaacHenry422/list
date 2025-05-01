const mongoose = require('mongoose'); // Import Mongoose

const transactionSchema = new mongoose.Schema({ // Define the transaction schema
  orderId: {
    type: mongoose.Schema.Types.ObjectId, // Define the type as ObjectId
    ref: 'Order', // Reference the 'Order' model
    required: true, // Make it a required field
  },
  paymentReference: {
    type: String, // Define the type as String
    required: true, // Make it a required field
  },
  amount: {
    type: Number, // Define the type as Number
    required: true, // Make it a required field
  },
  transactionDate: {
    type: Date, // Define the type as Date
    default: Date.now, // Set default value to current date
  },
  status: {
    type: String, // Define the type as String
    enum: ['success', 'failed', 'refunded'], // Define allowed values
    default: 'success', // Set default value
  },
  paymentGateway: { // add payment gateway
    type: String,
    default: 'paystack'
  },
  buyerId: { //add buyer id.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerId: { // add seller id.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

module.exports = mongoose.model('Transaction', transactionSchema); 