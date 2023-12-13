const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");
const ApiError = require("../util/apiError");

// @desc get list of categories
// @route GET /api/v1/categories?page=1&limit=5
// @access Public
const getCategories = asyncHandler(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 5;
	const skip = (page - 1) * limit;

	const categories = await Category.find({}).skip(skip).limit(limit);
	res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc get single category by it's id
// @route GET /api/v1/categories/:id
// @access Public
const getCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const category = await Category.findById(id);

	if (!category)
		return next(new ApiError(`No Category found by this id: ${id}`, 404));

	res.status(200).json({ data: category });
});

// @desc create category
// @route POST /api/v1/categories
// @access Private
const createCategory = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const category = await Category.create({ name, slug: slugify(name) });
	res.status(201).json({ data: category });
});

// @desc update category
// @route POST /api/v1/categories/:id
// @access Private
const updateCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { name } = req.body;

	const category = await Category.findByIdAndUpdate(
		id,
		{ name, slug: slugify(name) },
		{ new: true }
	);
	if (!category)
		return next(new ApiError(`No Category found by this id: ${id}`, 404));

	res.status(200).json({ data: category });
});

// @desc delete category
// @route DELETE /api/v1/categories/:id
// @access Private
const deleteCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const category = await Category.findByIdAndDelete(id);

	if (!category)
		return next(new ApiError(`No Category found by this id: ${id}`, 404));

	res.status(200).json({ message: "Category deleted" });
});

module.exports = {
	getCategories,
	createCategory,
	getCategory,
	updateCategory,
	deleteCategory,
};
