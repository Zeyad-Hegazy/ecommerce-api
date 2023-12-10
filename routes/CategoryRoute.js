const express = require("express");

const router = express.Router();

const {
	getCategories,
	createCategory,
} = require("../controllers/CategoryController");

router.route("/").get(getCategories).post(createCategory);

module.exports = router;
