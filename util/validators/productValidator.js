const Product = require("../../models/ProductModel");
const Category = require("../../models/CategoryModel");
const SubCategory = require("../../models/SubCategoryModel");
const slugify = require("slugify");
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
		.isLength({ min: 5 })
		.withMessage("Too short product title")
		.isLength({ max: 50 })
		.withMessage("Too long product title")
		.custom((title, { req }) => {
			req.body.slug = slugify(title);
			return true;
		}),
	check("description")
		.notEmpty()
		.withMessage("Product description is required")
		.isLength({ max: 400 })
		.withMessage("Too long description"),
	check("quantity")
		.notEmpty()
		.withMessage("product quantity is required")
		.isNumeric()
		.withMessage("price must be a number"),
	check("sold")
		.optional()
		.isNumeric()
		.withMessage("sold quantity must be number"),
	check("price")
		.notEmpty()
		.withMessage("price is required")
		.isNumeric()
		.withMessage("price must be number")
		.isLength({ max: 32 })
		.withMessage("Too long price number"),
	check("priceAfterDiscount")
		.isNumeric()
		.withMessage("price after discount must be a number")
		.custom((value, { req }) => {
			if (req.body.price <= value) {
				throw new Error("price after discount must be lower than price");
			}
			return true;
		}),
	check("colors")
		.optional()
		.isArray()
		.withMessage("colors must be an array of string"),
	check("coverImage").notEmpty().withMessage("Cover image is required"),
	check("images")
		.optional()
		.isArray()
		.withMessage("images must be an array of string"),
	check("category")
		.notEmpty()
		.withMessage("product must belong to category")
		.isMongoId()
		.withMessage("Invalid id format")
		.custom(async (value) => {
			const category = await Category.findById(value);
			if (!category) throw new Error("this category not exist");
		}),

	check("subCategories")
		.optional()
		.isMongoId()
		.withMessage("Invalid ID formate")
		.custom((subcategoriesIds) =>
			SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
				(result) => {
					if (result.length < 1 || result.length !== subcategoriesIds.length) {
						return Promise.reject(new Error(`Invalid subcategories Ids`));
					}
				}
			)
		)
		.custom((val, { req }) =>
			SubCategory.find({ category: req.body.category }).then(
				(subcategories) => {
					const subCategoriesIdsInDB = [];
					subcategories.forEach((subCategory) => {
						subCategoriesIdsInDB.push(subCategory._id.toString());
					});

					const checker = (target, arr) => target.every((v) => arr.includes(v));
					if (!checker(val, subCategoriesIdsInDB)) {
						return Promise.reject(
							new Error(`subcategories not belong to category`)
						);
					}
				}
			)
		),

	check("brand").optional().isMongoId().withMessage("Invalid id format"),
	check("ratingsAverage")
		.optional()
		.isNumeric()
		.withMessage("ratings Average must be a number")
		.isLength({ min: 1 })
		.withMessage("Product Average must be above or equal 1.0")
		.isLength({ max: 5 })
		.withMessage("Product Average must be below or equal 5.0"),
	check("ratingsQuantity")
		.optional()
		.isNumeric()
		.withMessage("ratings quantity must be a number"),
	validatorMiddleware,
];

const updateProductValidator = [
	check("id").isMongoId().withMessage("Invalid product id format"),
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
