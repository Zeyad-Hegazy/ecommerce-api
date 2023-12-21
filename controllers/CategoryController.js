const Category = require("../models/CategoryModel");
const {
	getAll,
	getOne,
	createOne,
	updateOne,
	deleteOne,
} = require("./handlers");

// @desc get list of categories
// @route GET /api/v1/categories
// @access Public
const getCategories = getAll(Category);

// @desc get single category by it's id
// @route GET /api/v1/categories/:id
// @access Public
const getCategory = getOne(Category);

// @desc create category
// @route POST /api/v1/categories
// @access Private
const createCategory = createOne(Category);

// @desc update category
// @route POST /api/v1/categories/:id
// @access Private
const updateCategory = updateOne(Category);

// @desc delete category
// @route DELETE /api/v1/categories/:id
// @access Private
const deleteCategory = deleteOne(Category);

module.exports = {
	getCategories,
	createCategory,
	getCategory,
	updateCategory,
	deleteCategory,
};
