const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/BrandModel");
const ApiError = require("../util/apiError");
const ApiFeatures = require("../util/ApiFeatures");

// @desc get list of brands
// @route GET /api/v1/brands?page=1&limit=5
// @access Public
const getBrands = asyncHandler(async (req, res) => {
	const countDocuments = await Brand.countDocuments();
	const apiFeatures = new ApiFeatures(Brand.find(), req.query)
		.paginate(countDocuments)
		.filter()
		.sort()
		.limitFields()
		.search();

	const { mongooseQuery, paginationResult } = apiFeatures;

	const brands = await mongooseQuery;

	res
		.status(200)
		.json({ results: brands.length, paginationResult, data: brands });
});

// @desc get single brand by it's id
// @route GET /api/v1/brands/:id
// @access Public
const getBrand = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const brand = await Brand.findById(id);

	if (!brand)
		return next(new ApiError(`No brand found by this id: ${id}`, 404));

	res.status(200).json({ data: brand });
});

// @desc create brand
// @route POST /api/v1/brands
// @access Private
const createBrand = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const brand = await Brand.create({ name, slug: slugify(name) });
	res.status(201).json({ data: brand });
});

// @desc update brand
// @route POST /api/v1/brands/:id
// @access Private
const updateBrand = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { name } = req.body;

	const brand = await Brand.findByIdAndUpdate(
		id,
		{ name, slug: slugify(name) },
		{ new: true }
	);
	if (!brand)
		return next(new ApiError(`No brand found by this id: ${id}`, 404));

	res.status(200).json({ data: brand });
});

// @desc delete brand
// @route DELETE /api/v1/brands/:id
// @access Private
const deleteBrand = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const brand = await Brand.findByIdAndDelete(id);

	if (!brand)
		return next(new ApiError(`No brand found by this id: ${id}`, 404));

	res.status(200).json({ message: "brand deleted" });
});

module.exports = {
	getBrands,
	getBrand,
	createBrand,
	updateBrand,
	deleteBrand,
};
