const Brand = require("../../models/BrandModel");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const getBrandValidator = [
	check("id").isMongoId().withMessage("Invalid brand id format"),
	validatorMiddleware,
];

const createBrandValidator = [
	check("name")
		.notEmpty()
		.withMessage(
			"The brand name should contain only letters and should be unique."
		)
		.custom(async (value) => {
			const existingBrand = await Brand.findOne({ name: value });
			if (existingBrand) throw new Error("Brand name must be unique");
		})
		.isLength({ min: 2 })
		.withMessage("Too short brand name")
		.isLength({ max: 32 })
		.withMessage("Too long brand name"),
	validatorMiddleware,
];

const updateBrandValidator = [
	check("id").isMongoId().withMessage("Invalid brand id format"),
	check("name").notEmpty(),
	validatorMiddleware,
];

const deleteBrandValidator = [
	check("id").isMongoId().withMessage("Invalid brand id format"),
	validatorMiddleware,
];

module.exports = {
	getBrandValidator,
	createBrandValidator,
	updateBrandValidator,
	deleteBrandValidator,
};
