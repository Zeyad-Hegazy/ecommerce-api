const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");

const getCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find({});
	res.status(200).json({results:categories.length, data:categories})
});

const createCategory = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const category = await Category.create({ name, slug: slugify(name) });
	res.status(201).json({ data: category });
});

module.exports = {
	getCategories,
	createCategory,
};
