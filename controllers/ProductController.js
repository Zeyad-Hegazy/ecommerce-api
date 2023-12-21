const Product = require("../models/ProductModel");
const {
	getAll,
	getOne,
	createOne,
	updateOne,
	deleteOne,
} = require("./handlers");

// @desc set filteration on products by it's pearent category
const setFilterObject = (req, res, next) => {
	let filterObject = {};
	if (req.params.categoryId) filterObject = { category: req.params.categoryId };
	req.filterObject = filterObject;
	next();
};

// @desc get list of products
// @route GET /api/v1/products
// @access Public
const getProducts = getAll(Product, "Product");

// @desc get single product by it's id
// @route GET /api/v1/products/:id
// @access Public
const getProduct = getOne(Product);

// @desc create product
// @route POST /api/v1/products
// @access Private
const createProduct = createOne(Product);

// @desc update product
// @route POST /api/v1/products/:id
// @access Private
const updateProduct = updateOne(Product);

// @desc delete product
// @route DELETE /api/v1/products/:id
// @access Private
const deleteProduct = deleteOne(Product);

module.exports = {
	setFilterObject,
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};
