const SubCategory = require("../../models/SubCategoryModel");
const { param, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// const getCategoryValidator = [
// 	param("id").isMongoId().withMessage("Invalid category id format"),
// 	validatorMiddleware,
// ];

const createSubCategoryValidator = [
	body("name")
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
	body("category").isMongoId().withMessage("Invalid category id format"),
	validatorMiddleware,
];

// const updateCategoryValidator = [
// 	param("id")
// 		.isMongoId.withMessage("Invalid category id format")
// 		.body("name")
// 		.notEmpty()
// 		.isAlpha(),
// 	validatorMiddleware,
// ];

// const deleteCategoryValidator = [
// 	param("id").isMongoId().withMessage("Invalid category id format"),
// 	validatorMiddleware,
// ];

module.exports = {
	// getCategoryValidator,
	createSubCategoryValidator,
	// updateCategoryValidator,
	// deleteCategoryValidator,
};
