const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const Product = require("../models/ProductModel");
const {
	getAll,
	getOne,
	createOne,
	updateOne,
	deleteOne,
} = require("./handlers");

const {
	uploadMultibleImages,
} = require("../middlewares/uploadImagesMiddleware");

const uploadProductImages = uploadMultibleImages([
	{
		name: "coverImage",
		maxCount: 1,
	},
	{
		name: "images",
		maxCount: 5,
	},
]);

const resizeProductImages = asyncHandler(async (req, res, next) => {
	if (req.files.coverImage) {
		const imageCoverFileName = `product-${Date.now()}-cover.jpeg`;

		await sharp(req.files.coverImage[0].buffer)
			.resize(2000, 1333)
			.toFormat("jpeg")
			.jpeg({ quality: 95 })
			.toFile(`uploads/products/${imageCoverFileName}`);

		req.body.coverImage = imageCoverFileName;
	}
	if (req.files.images) {
		req.body.images = [];
		await Promise.all(
			req.files.images.map(async (img, index) => {
				const imageName = `product-${Date.now()}-${index + 1}.jpeg`;

				await sharp(img.buffer)
					.resize(2000, 1333)
					.toFormat("jpeg")
					.jpeg({ quality: 95 })
					.toFile(`uploads/products/${imageName}`);

				req.body.images.push(imageName);
			})
		);
	}
	next();
});

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
const getProduct = getOne(Product, "products");

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
const deleteProduct = deleteOne(Product, "products");

module.exports = {
	setFilterObject,
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	uploadProductImages,
	resizeProductImages,
};
