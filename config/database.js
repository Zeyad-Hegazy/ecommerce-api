const mongoose = require("mongoose");

const dbConnection = () => {
	mongoose
		.connect(process.env.DB_URI)
		.then((con) => {
			console.log(`Database Connected: ${con.connection.host}`);
		})
		.catch((err) => {
			console.error(`Database Error: ${err}`);
			process.exit(1);
		});
};

module.exports = dbConnection;
