const multer = require("multer");
const ApiError = require("../util/apiError");

const multerOptions = () => {
	const multerStorage = multer.memoryStorage();

	const multerFilters = (req, file, cb) => {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb(new ApiError("Only images allowed", 400), false);
		}
	};

	const upload = multer({ storage: multerStorage, fileFilter: multerFilters });

	return upload;
};

const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

const uploadMultibleImages = (arrayOfFields) =>
	multerOptions().fields(arrayOfFields);

module.exports = {
	uploadSingleImage,
	uploadMultibleImages,
};
