const express = require("express");

const router = express.Router({ mergeParams: true });

const {
	setCategoryIdToBody,
	setFilterObject,
	getSubCategories,
	getSubCategory,
	createSubCategory,
	updateSubCategory,
	deleteSubCategory,
} = require("../controllers/SubCategoryController");

const {
	getSubCategoryValidator,
	createSubCategoryValidator,
	updateSubCategoryValidator,
	deleteSubCategoryValidator,
} = require("../util/validators/subCategoryValidator");

router
	.route("/")
	.get(setFilterObject, getSubCategories)
	.post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router
	.route("/:id")
	.get(getSubCategoryValidator, getSubCategory)
	.put(updateSubCategoryValidator, updateSubCategory)
	.delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
