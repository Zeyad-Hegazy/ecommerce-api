const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");

const getCategories = asyncHandler(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 5;
	const skip = (page - 1) * limit;
	console.log(page, limit);

	const categories = await Category.find({}).skip(skip).limit(limit);
	res.status(200).json({ results: categories.length, page, data: categories });
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
