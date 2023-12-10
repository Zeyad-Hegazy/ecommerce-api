const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");

const categoreyRouter = require("./routes/CategoryRoute");

dbConnection();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
	console.log(`mode: Development`);
	app.use(morgan("dev"));
}

// server endpoint routes
app.use("/api/v1/categories", categoreyRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is Running on Port: ${PORT}`);
});
