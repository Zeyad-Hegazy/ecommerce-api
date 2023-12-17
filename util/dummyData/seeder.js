const fs = require("fs");
const dotenv = require("dotenv");
const Product = require("../../models/ProductModel");
const dbConnection = require("../../config/database.js");

dotenv.config({ path: "../../config.env" });

dbConnection();

const products = JSON.parse(fs.readFileSync("./products.json"));

const insertData = async () => {
	try {
		await Product.create(products);
		console.log("DATA CREATED");
		process.exit(1);
	} catch (error) {
		console.log(error);
	}
};

const destroyData = async () => {
	try {
		await Product.deleteMany();
		console.log("DATA DESTROYED");
	} catch (error) {
		console.log(error);
	}
};

if (process.argv[2] === "-i") {
	insertData();
} else if (process.argv[2] === "-d") {
	destroyData();
}
