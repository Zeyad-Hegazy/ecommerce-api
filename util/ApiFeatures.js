class ApiFeatures {
	constructor(mongooseQuery, queryString) {
		this.mongooseQuery = mongooseQuery;
		this.queryString = queryString;
	}

	paginate(countDocuments) {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 5;
		const skip = (page - 1) * limit;
		const endIndex = page * limit;

		const pagination = {};
		pagination.currentPage = page;
		pagination.limit = limit;
		pagination.numberOfPages = Math.ceil(countDocuments / limit);

		if (endIndex < countDocuments) {
			pagination.next = page + 1;
		}

		if (skip > 0) {
			pagination.prev = page - 1;
		}

		this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);

		this.paginationResult = pagination;

		return this;
	}

	filter() {
		const queryStringObject = { ...this.queryString };
		const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
		excludeFields.forEach((feild) => delete queryStringObject[feild]);
		let queryStr = JSON.stringify(queryStringObject);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join(" ");
			this.mongooseQuery = this.mongooseQuery.sort(sortBy);
		} else {
			this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const selectBy = this.queryString.fields.split(",").join(" ");
			this.mongooseQuery = this.mongooseQuery.select(selectBy);
		} else {
			this.mongooseQuery = this.mongooseQuery.select("-__v");
		}
		return this;
	}

	search() {
		if (this.queryString.keyword) {
			const query = {};
			query.$or = [
				{ title: { $regex: this.queryString.keyword, $options: "i" } },
				{ description: { $regex: this.queryString.keyword, $options: "i" } },
			];
			this.mongooseQuery = this.mongooseQuery.find(query);
		}
		return this;
	}
}

module.exports = ApiFeatures;
