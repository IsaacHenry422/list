 // src/controllers/productController.js

const Product = require('../models/productModel');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');
const { validationResult } = require('express-validator');
const cloudinary = require('../../utilities/cloudinary');
const fs = require('fs').promises; // For deleting local files

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, sort, page = 1, limit = 10 } = req.query;
    const query = {};
    if (category) query.category = category;

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.startsWith('-') ? [sort.substring(1), -1] : [sort, 1];
      sortOptions[field] = order;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    logger.error('Error fetching all products:', error);
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new AppError(404, 'fail', 'Product not found'));
    }
    res.status(200).json({ status: 'success', data: { product } });
  } catch (error) {
    logger.error(`Error fetching product with ID ${req.params.productId}:`, error);
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Product creation validation failed:', errors.array());
    return next(new AppError(400, 'fail', 'Validation error', errors.array()));
  }

  try {
    const seller = req.session.userId; // Assuming seller ID is in the session
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        images.push({ public_id: result.public_id, url: result.secure_url });
        await fs.unlink(file.path); // Delete local file
      }
    }

    const newProduct = await Product.create({ ...req.body, seller, images });
    logger.info(`Product created successfully: ${newProduct.name} (ID: ${newProduct._id})`);
    res.status(201).json({ status: 'success', data: { product: newProduct } });
  } catch (error) {
    logger.error('Error creating product:', error);
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Product update validation failed:', errors.array());
    return next(new AppError(400, 'fail', 'Validation error', errors.array()));
  }

  try {
    const productId = req.params.productId;
    const sellerId = req.session.userId; // Ensure user is a seller

    const product = await Product.findById(productId);

    if (!product) {
      return next(new AppError(404, 'fail', 'Product not found'));
    }

    if (product.seller.toString() !== sellerId) {
      return next(new AppError(403, 'fail', 'You are not authorized to update this product'));
    }

    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category, // Include category in updates
      updatedAt: Date.now(),
    };

    if (req.files && req.files.length > 0) {
      // Handle image updates - delete old images from Cloudinary and upload new ones
      const oldImagePublicIds = product.images.map(img => img.public_id).filter(id => id);
      for (const publicId of oldImagePublicIds) {
        await cloudinary.uploader.destroy(publicId);
      }

      const newImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        newImages.push({ public_id: result.public_id, url: result.secure_url });
        await fs.unlink(file.path); // Delete local file
      }
      updates.images = newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    logger.info(`Product updated successfully: ${updatedProduct.name} (ID: ${updatedProduct._id})`);
    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct,
      },
    });

  } catch (error) {
    logger.error(`Error updating product with ID ${req.params.productId}:`, error);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const sellerId = req.session.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError(404, 'fail', 'Product not found'));
    }

    if (product.seller.toString() !== sellerId) {
      return next(new AppError(403, 'fail', 'You are not authorized to delete this product'));
    }

    // Delete images from Cloudinary
    const publicIds = product.images.map(img => img.public_id).filter(id => id);
    for (const publicId of publicIds) {
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(productId);
    logger.info(`Product deleted successfully: ID ${productId}`);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    logger.error(`Error deleting product with ID ${req.params.productId}:`, error);
    next(error);
  }
};

module.exports = exports;