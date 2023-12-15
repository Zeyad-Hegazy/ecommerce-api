const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/ProductModel");
const ApiError = require("../util/apiError");

// @desc get list of products
// @route GET /api/v1/products?page=1&limit=5
// @access Public
const getProducts = asyncHandler(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 5;
	const skip = (page - 1) * limit;

	const products = await Product.find({})
		.skip(skip)
		.limit(limit)
		.populate({ path: "category", select: "name -_id" });
	res.status(200).json({ results: products.length, page, data: products });
});

// @desc get single product by it's id
// @route GET /api/v1/products/:id
// @access Public
const getProduct = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const product = await Product.findById(id).populate({
		path: "category",
		select: "name -_id",
	});
	if (!product)
		return next(new ApiError(`No product found by this id: ${id}`, 404));

	res.status(200).json({ data: product });
});

// @desc create product
// @route POST /api/v1/products
// @access Private
const createProduct = asyncHandler(async (req, res) => {
	req.body.slug = slugify(req.body.title);
	const product = await Product.create(req.body);
	res.status(201).json({ data: product });
});

// @desc update product
// @route POST /api/v1/products/:id
// @access Private
const updateProduct = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	if (req.body.title) {
		req.body.slug = slugify(req.body.title);
	}
	const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
	if (!product)
		return next(new ApiError(`No product found by this id: ${id}`, 404));

	res.status(200).json({ data: product });
});

// @desc delete product
// @route DELETE /api/v1/products/:id
// @access Private
const deleteProduct = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const product = await Product.findByIdAndDelete(id);

	if (!product)
		return next(new ApiError(`No product found by this id: ${id}`, 404));

	res.status(200).json({ message: "product deleted" });
});

module.exports = {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};
