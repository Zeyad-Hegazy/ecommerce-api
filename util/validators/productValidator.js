const Product = require("../../models/ProductModel");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const getProductValidator = [
	check("id").isMongoId().withMessage("Invalid product id format"),
	validatorMiddleware,
];

const createProductValidator = [
	check("title")
		.notEmpty()
		.withMessage("The title should contain only letters and should be unique.")
		.custom(async (value) => {
			const existingProduct = await Product.findOne({ title: value });
			if (existingProduct) throw new Error("product title must be unique");
		})
		.isLength({ min: 2 })
		.withMessage("Too short product name")
		.isLength({ max: 32 })
		.withMessage("Too long product name"),
	validatorMiddleware,
];

const updateProductValidator = [
	check("id").isMongoId().withMessage("Invalid product id format"),
	check("title").notEmpty(),
	validatorMiddleware,
];

const deleteProductValidator = [
	check("id").isMongoId().withMessage("Invalid product id format"),
	validatorMiddleware,
];

module.exports = {
	getProductValidator,
	createProductValidator,
	updateProductValidator,
	deleteProductValidator,
};
