"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = exports.excludeField = void 0;
// List of fields to exclude from the filter
exports.excludeField = ["searchTerm", "sort", "fields", "page", "limit", "dateRange", "make", "model", "year"];
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // 🔍 Search
    search(searchableField) {
        var _a;
        const searchTerm = (_a = this.query.searchTerm) === null || _a === void 0 ? void 0 : _a.trim();
        console.log("searchTerm", searchTerm);
        if (searchTerm) {
            const searchQuery = {
                $or: searchableField.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery); // Using find() with search query
        }
        return this;
    }
    // 🧩 Filter
    filter() {
        const filter = Object.assign({}, this.query);
        for (const field of exports.excludeField)
            delete filter[field];
        this.modelQuery = this.modelQuery.find(filter); // Filter based on the query excluding certain fields
        return this;
    }
    limit() {
        const limit = this.query.limit;
        this.modelQuery = this.modelQuery.limit(Number(limit)); // Apply the limit to the query
        return this;
    }
    // 📅 Date Range (weekly, monthly, yearly)
    dateRange() {
        const now = new Date();
        const range = this.query.dateRange;
        if (range) {
            let startDate = null;
            if (range === "weekly") {
                startDate = new Date();
                startDate.setDate(now.getDate() - 7); // Set date range to the last 7 days
            }
            else if (range === "monthly") {
                startDate = new Date();
                startDate.setMonth(now.getMonth() - 1); // Set date range to the last month
            }
            else if (range === "yearly") {
                startDate = new Date();
                startDate.setFullYear(now.getFullYear() - 1); // Set date range to the last year
            }
            if (startDate) {
                const dateCondition = { createdAt: { $gte: startDate, $lte: now } };
                this.modelQuery = this.modelQuery.find(Object.assign(Object.assign({}, (this.modelQuery._conditions || {})), dateCondition));
            }
        }
        return this;
    }
    // 🔃 Sort
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    // 📋 Fields selection
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        if (fields)
            this.modelQuery = this.modelQuery.select(fields); // Select specific fields
        return this;
    }
    // 📄 Pagination
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit); // Apply pagination
        return this;
    }
    // 🚀 Execute final query
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.modelQuery.exec();
        });
    }
    // 📊 Meta info (for pagination)
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocuments = yield this.modelQuery.clone().countDocuments(); // Get the total document count
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalPage = Math.ceil(totalDocuments / limit); // Calculate total pages for pagination
            return { page, limit, total: totalDocuments, totalPage };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
