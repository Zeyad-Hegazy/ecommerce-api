const SubCategory = require("../models/SubCategoryModel");
const {
	getAll,
	getOne,
	createOne,
	updateOne,
	deleteOne,
} = require("./handlers");

// @desc if the main category name isn't sent with body access it form params
const setCategoryIdToBody = (req, res, next) => {
	if (!req.body.category) req.body.category = req.params.categoryId;
	next();
};

// @desc set filteration on subcategories by it's pearent category
const setFilterObject = (req, res, next) => {
	let filterObject = {};
	if (req.params.categoryId) filterObject = { category: req.params.categoryId };
	req.filterObject = filterObject;
	next();
};

// @desc get list of subCategories
// @route GET /api/v1/subCategories
// @access Public
const getSubCategories = getAll(SubCategory);

// @desc get single subCategory by it's id
// @route GET /api/v1/subCategories/:id
// @access Public
const getSubCategory = getOne(SubCategory);

// @desc create subCategory
// @route POST /api/v1/subCategories
// @access Private
const createSubCategory = createOne(SubCategory);

// @desc update subCategory
// @route POST /api/v1/subCategories/:id
// @access Private
const updateSubCategory = updateOne(SubCategory);

// @desc delete subCategory
// @route DELETE /api/v1/subCategories/:id
// @access Private
const deleteSubCategory = deleteOne(SubCategory);

module.exports = {
	setCategoryIdToBody,
	setFilterObject,
	getSubCategories,
	getSubCategory,
	createSubCategory,
	updateSubCategory,
	deleteSubCategory,
};
