const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/SubCategoryModel");
const ApiError = require("../util/apiError");

// @desc if the main category name isn't sent with body access it form params
const setCategoryIdToBody = (req, res, next) => {
	if (!req.body.category) req.body.category = req.params.categoryId;
	next();
};

// @desc get list of subCategories
// @route GET /api/v1/subCategories?page=1&limit=5
// @access Public
const getSubCategories = asyncHandler(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 5;
	const skip = (page - 1) * limit;

	const subCategories = await SubCategory.find({}).skip(skip).limit(limit);
	res
		.status(200)
		.json({ results: subCategories.length, page, data: subCategories });
});

// @desc get single subCategory by it's id
// @route GET /api/v1/subCategories/:id
// @access Public
const getSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const subCategory = await SubCategory.findById(id);

	if (!subCategory)
		return next(new ApiError(`No subCategory found by this id: ${id}`, 404));

	res.status(200).json({ data: subCategory });
});

// @desc create subCategory
// @route POST /api/v1/subCategories
// @access Private
const createSubCategory = asyncHandler(async (req, res) => {
	const { name, category } = req.body;
	const subCategory = await SubCategory.create({
		name,
		slug: slugify(name),
		category,
	});
	res.status(201).json({ data: subCategory });
});

// @desc update subCategory
// @route POST /api/v1/subCategories/:id
// @access Private
const updateSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { name, category } = req.body;

	const subCategory = await SubCategory.findByIdAndUpdate(
		id,
		{ name, slug: slugify(name), category },
		{ new: true }
	);
	if (!subCategory)
		return next(new ApiError(`No subCategory found by this id: ${id}`, 404));

	res.status(200).json({ data: subCategory });
});

// @desc delete subCategory
// @route DELETE /api/v1/subCategories/:id
// @access Private
const deleteSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const subCategory = await SubCategory.findByIdAndDelete(id);

	if (!subCategory)
		return next(new ApiError(`No subCategory found by this id: ${id}`, 404));

	res.status(200).json({ message: "subCategory deleted" });
});

module.exports = {
	setCategoryIdToBody,
	getSubCategories,
	getSubCategory,
	createSubCategory,
	updateSubCategory,
	deleteSubCategory,
};
