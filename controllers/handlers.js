const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../util/apiError");
const ApiFeatures = require("../util/ApiFeatures");

const deleteOne = (Model, model) =>
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const document = await Model.findById(id);

		if (!document) {
			return next(new ApiError(`No document for this id ${id}`, 404));
		}

		if (document.coverImage || document.image) {
			const imagePath = path.join(
				"uploads",
				model,
				document.coverImage || document.image
			);
			fs.unlink(imagePath, (err) => {
				if (err) {
					throw new Error("Error deleting the file");
				}
			});
		}

		await Model.findByIdAndDelete(id);

		res.status(204).send();
	});

const updateOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});

		if (!document) {
			return next(
				new ApiError(`No document for this id ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ data: document });
	});

const createOne = (Model) =>
	asyncHandler(async (req, res) => {
		const newDocument = await Model.create(req.body);
		res.status(201).json({ data: newDocument });
	});

const getOne = (Model, model) =>
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const document = await Model.findById(id);
		let imageString = "";

		if (document.coverImage || document.image) {
			const imagePath = path.join(
				"uploads",
				model,
				document.coverImage || document.image
			);

			const image = fs.readFileSync(imagePath);

			imageString = image.toString("base64");
		}

		if (!document)
			return next(new ApiError(`No document found by this id: ${id}`, 404));

		res
			.status(200)
			.json({ data: { ...document._doc, coverImage: imageString } });
	});

const getAll = (Model, model) =>
	asyncHandler(async (req, res) => {
		let filter = {};
		if (req.filterObject) {
			filter = req.filterObject;
		}

		const countDocuments = await Model.countDocuments();

		let apiFeatures;
		if (model === "Product") {
			apiFeatures = new ApiFeatures(
				Model.find(filter).populate({
					path: "category",
					select: "name -_id",
				}),
				req.query
			)
				.paginate(countDocuments)
				.filter()
				.sort(model)
				.limitFields()
				.search();
		} else {
			apiFeatures = new ApiFeatures(Model.find(filter), req.query)
				.paginate(countDocuments)
				.filter()
				.sort(model)
				.limitFields()
				.search();
		}

		const { mongooseQuery, paginationResult } = apiFeatures;

		const documents = await mongooseQuery;

		const processImage = async (doc) => {
			if (doc.coverImage || doc.image) {
				const imagePath = path.join(
					"uploads",
					model,
					doc.coverImage || doc.image
				);
				const imageBuffer = await fs.promises.readFile(imagePath);
				return imageBuffer.toString("base64");
			}
			return null;
		};

		await Promise.all(
			documents.map(async (doc) => {
				doc.coverImage = await processImage(doc);
				doc.image = await processImage(doc);
			})
		);

		res
			.status(200)
			.json({ results: documents.length, paginationResult, data: documents });
	});

module.exports = {
	deleteOne,
	updateOne,
	createOne,
	getOne,
	getAll,
};
