const Category = require("../models/CategoryModel");

const getCategories = (req, res) => {
	const { name } = req.body;

	const newCategory = new Category({ name });
	newCategory
		.save()
		.then((doc) => {
			res.json(doc);
		})
		.catch((err) => {
			console.error(err);
		});
};

module.exports = {
	getCategories,
};
