// src/models/sellerModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming a relationship with your User model
        required: true,
        unique: true,
    },
    // Add other fields specific to the seller profile
    businessName: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    // ... any other seller-specific fields you need
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Seller', sellerSchema);