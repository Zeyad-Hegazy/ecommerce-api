const Category = require("../../models/CategoryModel");
const { param, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const getCategoryValidator = [
	param("id").isMongoId().withMessage("Invalid category id format"),
	validatorMiddleware,
];

const createCategoryValidator = [
	body("name")
		.isAlpha()
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
	param("id")
		.isMongoId.withMessage("Invalid category id format")
		.body("name")
		.notEmpty()
		.isAlpha(),
	validatorMiddleware,
];

const deleteCategoryValidator = [
	param("id").isMongoId().withMessage("Invalid category id format"),
	validatorMiddleware,
];

module.exports = {
	getCategoryValidator,
	createCategoryValidator,
	updateCategoryValidator,
	deleteCategoryValidator,
};
