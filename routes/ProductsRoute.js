const express = require("express");

const router = express.Router({ mergeParams: true });

const {
	setFilterObject,
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	uploadProductImages,
	resizeProductImages,
} = require("../controllers/ProductController");

const {
	getProductValidator,
	createProductValidator,
	updateProductValidator,
	deleteProductValidator,
} = require("../util/validators/productValidator");

router
	.route("/")
	.get(setFilterObject, getProducts)
	.post(
		uploadProductImages,
		resizeProductImages,
		createProductValidator,
		createProduct
	);

router
	.route("/:id")
	.get(getProductValidator, getProduct)
	.put(updateProductValidator, updateProduct)
	.delete(deleteProductValidator, deleteProduct);

module.exports = router;
