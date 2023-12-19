const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/ProductModel");
const ApiError = require("../util/apiError");

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
const getProducts = asyncHandler(async (req, res) => {
	const queryStringObject = { ...req.query };
	const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
	excludeFields.forEach((feild) => delete queryStringObject[feild]);

	let queryStr = JSON.stringify(queryStringObject);
	queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 5;
	const skip = (page - 1) * limit;

	let mongooseQuery = Product.find({
		...req.filterObject,
		...JSON.parse(queryStr),
	})
		.skip(skip)
		.limit(limit)
		.populate({ path: "category", select: "name -_id" });

	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		mongooseQuery = mongooseQuery.sort(sortBy);
	}

	if (req.query.fields) {
		const selectBy = req.query.fields.split(",").join(" ");
		mongooseQuery = mongooseQuery.select(selectBy);
	} else {
		mongooseQuery = mongooseQuery.select("-__v");
	}

	if (req.query.keyword) {
		const query = {};
		query.$or = [
			{ title: { $regex: req.query.keyword, $options: "i" } },
			{ description: { $regex: req.query.keyword, $options: "i" } },
		];
		mongooseQuery = mongooseQuery.find(query);
	}

	const products = await mongooseQuery;

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
	setFilterObject,
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};
