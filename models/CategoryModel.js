const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Category name is required"],
			unique: [true, "Category must be unique"],
			minlength: [3, "Too short category name"],
			maxlength: [32, "Too long category name"],
		},

		slug: {
			type: String,
			lowercase: true,
		},
	},
	{ timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
