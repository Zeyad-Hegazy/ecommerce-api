const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");

// @desc get list of categories
// @route GET /api/v1/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 5;
	const skip = (page - 1) * limit;
	console.log(page, limit);

	const categories = await Category.find({}).skip(skip).limit(limit);
	res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc get single category by it's id
// @route GET /api/v1/categories/:id
// @access Public
const getCategory = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category)
		res.status(404).json({ message: "No Category found by this id" });

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

module.exports = {
	getCategories,
	createCategory,
	getCategory,
};
