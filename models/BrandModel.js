const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Brand name is required"],
			unique: [true, "Brand must be unique"],
			maxlength: [32, "Too long Brand name"],
		},

		slug: {
			type: String,
			lowercase: true,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;
