const express = require("express");

const router = express.Router();

const {
	getCategories,
	createCategory,
	getCategory,
	updateCategory,
	deleteCategory,
} = require("../controllers/CategoryController");

router.route("/").get(getCategories).post(createCategory);
router
	.route("/:id")
	.get(getCategory)
	.put(updateCategory)
	.delete(deleteCategory);

module.exports = router;
