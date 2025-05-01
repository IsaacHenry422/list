const Category = require('../models/categoryModel');
const logger = require('../../utilities/logger');
const AppError = require('../../utilities/customError');
const { validationResult } = require('express-validator');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        logger.info('Retrieved all categories');
        res.status(200).json({
            status: 'success',
            data: {
                categories,
            },
        });
    } catch (error) {
        logger.error('Error fetching all categories:', error);
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Category creation validation failed:', errors.array());
        return next(new AppError(400, 'fail', 'Validation error', errors.array()));
    }

    const { name, description } = req.body;

    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            logger.warn(`Category with name "${name}" already exists`);
            return next(new AppError(409, 'fail', `Category with name "${name}" already exists`));
        }

        const newCategory = new Category({ name, description });
        const savedCategory = await newCategory.save();
        logger.info(`Category created successfully: ${savedCategory.name} (ID: ${savedCategory._id})`);
        res.status(201).json({
            status: 'success',
            data: {
                category: savedCategory,
            },
        });
    } catch (error) {
        logger.error('Error creating category:', error);
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Category update validation failed:', errors.array());
        return next(new AppError(400, 'fail', 'Validation error', errors.array()));
    }

    const { categoryId } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { name, description, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!category) {
            return next(new AppError(404, 'fail', 'Category not found'));
        }

        logger.info(`Category updated successfully: ${category.name} (ID: ${category._id})`);
        res.status(200).json({
            status: 'success',
            data: {
                category,
            },
        });
    } catch (error) {
        logger.error(`Error updating category with ID ${categoryId}:`, error);
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return next(new AppError(404, 'fail', 'Category not found'));
        }

        logger.info(`Category deleted successfully: ${category.name} (ID: ${category._id})`);
        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        logger.error(`Error deleting category with ID ${categoryId}:`, error);
        next(error);
    }
};