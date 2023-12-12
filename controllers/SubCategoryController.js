const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/SubCategoryModel");
const ApiError = require("../util/apiError");

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

module.exports = {
	createSubCategory,
};
