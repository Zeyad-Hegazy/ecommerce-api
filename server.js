const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const ApiError = require("./util/apiError");
const globalError = require("./middlewares/errorMiddleware");
const categoreyRouter = require("./routes/CategoryRoute");

dbConnection();

const app = express();

app.use(express.json());

console.log(`mode: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/api/v1/categories", categoreyRouter);

app.all("*", (req, res, next) => {
	next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
	console.log(`Server is Running on Port: ${PORT}`);
});

process.on("unhandledRejection", (err) => {
	console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
	server.close(() => {
		console.error("SERVER DOWN");
		process.exit(1);
	});
});
