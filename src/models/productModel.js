const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    images: [
        {
            public_id: String,
            url: String,
        },
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required'],
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    // Add other fields as needed (e.g., stock, brand)
});

// Middleware to create a slug
productSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;