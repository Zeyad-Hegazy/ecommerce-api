const express = require("express");

const router = express.Router();

const {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/ProductController");

const {
	getProductValidator,
	createProductValidator,
	updateProductValidator,
	deleteProductValidator,
} = require("../util/validators/productValidator");

router.route("/").get(getProducts).post(createProductValidator, createProduct);

router
	.route("/:id")
	.get(getProductValidator, getProduct)
	.put(updateProductValidator, updateProduct)
	.delete(deleteProductValidator, deleteProduct);

module.exports = router;
