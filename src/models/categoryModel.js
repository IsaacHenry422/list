const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true // Ensures category names are unique
    },
    description: {
        type: String,
        trim: true,
    },
    slug: { // For SEO-friendly URLs
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to generate a slug before saving
categorySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;