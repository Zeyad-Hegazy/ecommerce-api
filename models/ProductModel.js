const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: [3, "Too short product title"],
			maxlength: [100, "Too long product title"],
		},

		slug: {
			type: String,
			lowercase: true,
			required: true,
		},

		description: {
			type: String,
			required: [true, "Product description is required"],
			minlength: [20, "Too short product description"],
		},

		quantity: {
			type: Number,
			required: [true, "product quantity is required"],
		},

		sold: {
			type: Number,
			default: 0,
		},

		price: {
			type: Number,
			required: true,
			trim: true,
			max: [20000, "Too long product price"],
		},

		priceAfterDiscount: {
			type: Number,
		},

		colors: [String],

		coverImage: {
			type: String,
			required: [true, "Cover image is required"],
		},

		images: [String],

		category: {
			type: mongoose.Schema.ObjectId,
			ref: "Category",
			required: [true, "Product must be belong to category"],
		},

		subCategories: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "SubCategory",
			},
		],

		brand: {
			type: mongoose.Schema.ObjectId,
			ref: "Brand",
		},

		ratingsAverage: {
			type: Number,
			min: [1, "Product Average must be above or equal 1.0"],
			min: [5, "Product Average must be below or equal 5.0"],
		},

		ratingsQuantity: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
