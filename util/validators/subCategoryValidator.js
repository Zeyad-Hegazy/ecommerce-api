const SubCategory = require("../../models/SubCategoryModel");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const getSubCategoryValidator = [
	check("id").isMongoId().withMessage("Invalid category id format"),
	validatorMiddleware,
];

const createSubCategoryValidator = [
	check("name")
		.notEmpty()
		.withMessage("The name should contain only letters and should be unique.")
		.custom(async (value) => {
			const existingCategory = await SubCategory.findOne({ name: value });
			if (existingCategory) throw new Error("SubCategory name must be unique");
		})
		.isLength({ min: 2 })
		.withMessage("Too short subCategory name")
		.isLength({ max: 32 })
		.withMessage("Too long subCategory name"),
	check("category").isMongoId().withMessage("Invalid category id format"),
	validatorMiddleware,
];

const updateSubCategoryValidator = [
	check("id").isMongoId().withMessage("Invalid subCategory id format"),
	check("name").notEmpty(),
	validatorMiddleware,
];

const deleteSubCategoryValidator = [
	check("id").isMongoId().withMessage("Invalid subCategory id format"),
	validatorMiddleware,
];

module.exports = {
	getSubCategoryValidator,
	createSubCategoryValidator,
	updateSubCategoryValidator,
	deleteSubCategoryValidator,
};
