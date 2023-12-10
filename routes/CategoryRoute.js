const express = require("express");

const router = express.Router();

const { getCategories } = require("../controllers/CategoryController");

router.get("/", getCategories);

module.exports = router;
