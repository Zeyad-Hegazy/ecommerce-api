const express = require("express");

const router = express.Router();

const {
	getBrands,
	getBrand,
	createBrand,
	updateBrand,
	deleteBrand,
} = require("../controllers/BrandsController");

const {
	getBrandValidator,
	createBrandValidator,
	updateBrandValidator,
	deleteBrandValidator,
} = require("../util/validators/BrandsValidator");

router.route("/").get(getBrands).post(createBrandValidator, createBrand);

router
	.route("/:id")
	.get(getBrandValidator, getBrand)
	.put(updateBrandValidator, updateBrand)
	.delete(deleteBrandValidator, deleteBrand);

module.exports = router;
