const Brand = require("../models/BrandModel");
const {
	getAll,
	getOne,
	createOne,
	updateOne,
	deleteOne,
} = require("./handlers");

// @desc get list of brands
// @route GET /api/v1/brands
// @access Public
const getBrands = getAll(Brand);

// @desc get single brand by it's id
// @route GET /api/v1/brands/:id
// @access Public
const getBrand = getOne(Brand);

// @desc create brand
// @route POST /api/v1/brands
// @access Private
const createBrand = createOne(Brand);

// @desc update brand
// @route POST /api/v1/brands/:id
// @access Private
const updateBrand = updateOne(Brand);

// @desc delete brand
// @route DELETE /api/v1/brands/:id
// @access Private
const deleteBrand = deleteOne(Brand);

module.exports = {
	getBrands,
	getBrand,
	createBrand,
	updateBrand,
	deleteBrand,
};
