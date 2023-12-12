const express = require("express");

const router = express.Router();

const { createSubCategory } = require("../controllers/SubCategoryController");

const {
	createSubCategoryValidator,
} = require("../util/validators/subCategoryValidator");

router.route("/").post(createSubCategoryValidator, createSubCategory);

module.exports = router;
