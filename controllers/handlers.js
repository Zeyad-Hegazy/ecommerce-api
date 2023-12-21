const asyncHandler = require("express-async-handler");
const ApiError = require("../util/apiError");
const ApiFeatures = require("../util/ApiFeatures");
const { model } = require("mongoose");

const deleteOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const document = await Model.findByIdAndDelete(id);

		if (!document) {
			return next(new ApiError(`No document for this id ${id}`, 404));
		}
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

const getOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const { id } = req.params;
		const document = await Model.findById(id);

		if (!document)
			return next(new ApiError(`No document found by this id: ${id}`, 404));

		res.status(200).json({ data: document });
	});

const getAll = (Model, modelName = "") =>
	asyncHandler(async (req, res) => {
		let filter = {};
		if (req.filterObject) {
			filter = req.filterObject;
		}
		const countDocuments = await Model.countDocuments();

		let apiFeatures;
		if (modelName === "Product") {
			apiFeatures = new ApiFeatures(
				Model.find(filter).populate({
					path: "category",
					select: "name -_id",
				}),
				req.query
			)
				.paginate(countDocuments)
				.filter()
				.sort(modelName)
				.limitFields()
				.search();
		} else {
			apiFeatures = new ApiFeatures(Model.find(filter), req.query)
				.paginate(countDocuments)
				.filter()
				.sort(modelName)
				.limitFields()
				.search();
		}

		const { mongooseQuery, paginationResult } = apiFeatures;

		const documents = await mongooseQuery;

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
