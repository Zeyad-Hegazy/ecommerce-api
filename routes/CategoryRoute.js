const express = require("express");

const router = express.Router();

const {
	getCategories,
	createCategory,
	getCategory,
	updateCategory,
	deleteCategory,
} = require("../controllers/categoryController");

const {
	getCategoryValidator,
	createCategoryValidator,
	updateCategoryValidator,
	deleteCategoryValidator,
} = require("../util/validators/categoryValidator");

router
	.route("/")
	.get(getCategories)
	.post(createCategoryValidator, createCategory);
router
	.route("/:id")
	.get(getCategoryValidator, getCategory)
	.put(updateCategoryValidator, updateCategory)
	.delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
