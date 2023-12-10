const express = require("express");

const router = express.Router();

const {
	getCategories,
	createCategory,
	getCategory,
} = require("../controllers/CategoryController");

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").get(getCategory);

module.exports = router;
