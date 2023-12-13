const Category = require("../../models/CategoryModel");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const getCategoryValidator = [
	check("id").isMongoId().withMessage("Invalid category id format"),
	validatorMiddleware,
];

const createCategoryValidator = [
	check("name")
		.notEmpty()
		.withMessage("The name should contain only letters and should be unique.")
		.custom(async (value) => {
			const existingCategory = await Category.findOne({ name: value });
			if (existingCategory) throw new Error("Category name must be unique");
		})
		.isLength({ min: 2 })
		.withMessage("Too short category name")
		.isLength({ max: 32 })
		.withMessage("Too long category name"),
	validatorMiddleware,
];

const updateCategoryValidator = [
	check("id").isMongoId().withMessage("Invalid category id format"),
	check("name").notEmpty(),
	validatorMiddleware,
];

const deleteCategoryValidator = [
	check("id").isMongoId().withMessage("Invalid category id format"),
	validatorMiddleware,
];

module.exports = {
	getCategoryValidator,
	createCategoryValidator,
	updateCategoryValidator,
	deleteCategoryValidator,
};
