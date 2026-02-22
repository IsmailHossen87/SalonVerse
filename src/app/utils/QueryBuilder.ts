import { Query } from 'mongoose';

// List of fields to exclude from the filter
export const excludeField = ["searchTerm", "sort", "fields", "page", "limit", "dateRange", "make", "model", "year"];

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;  // Mongoose Query object
    public readonly query: Record<string, string>;  // Query parameters from the request

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    // 🔍 Search
    search(searchableField: string[]): this {
        const searchTerm = this.query.searchTerm?.trim();
        console.log("searchTerm", searchTerm);

        if (searchTerm) {
            const searchQuery = {
                $or: searchableField.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);  // Using find() with search query
        }
        return this;
    }

    // 🧩 Filter
    filter(): this {
        const filter = { ...this.query };
        for (const field of excludeField) delete filter[field];
        this.modelQuery = this.modelQuery.find(filter);  // Filter based on the query excluding certain fields
        return this;
    }

    limit(): this {
        const limit = this.query.limit;
        this.modelQuery = this.modelQuery.limit(Number(limit));  // Apply the limit to the query
        return this;
    }

    // 📅 Date Range (weekly, monthly, yearly)
    dateRange(): this {
        const now = new Date();
        const range = this.query.dateRange;

        if (range) {
            let startDate: Date | null = null;

            if (range === "weekly") {
                startDate = new Date();
                startDate.setDate(now.getDate() - 7);  // Set date range to the last 7 days
            } else if (range === "monthly") {
                startDate = new Date();
                startDate.setMonth(now.getMonth() - 1);  // Set date range to the last month
            } else if (range === "yearly") {
                startDate = new Date();
                startDate.setFullYear(now.getFullYear() - 1);  // Set date range to the last year
            }

            if (startDate) {
                const dateCondition = { createdAt: { $gte: startDate, $lte: now } };

                this.modelQuery = this.modelQuery.find({
                    ...((this.modelQuery as any)._conditions || {}),
                    ...dateCondition,
                });
            }
        }

        return this;
    }

    // 🔃 Sort
    sort(): this {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    // 📋 Fields selection
    fields(): this {
        const fields = this.query.fields?.split(",").join(" ") || "";
        if (fields) this.modelQuery = this.modelQuery.select(fields);  // Select specific fields
        return this;
    }

    // 📄 Pagination
    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);  // Apply pagination
        return this;
    }

    // 🚀 Execute final query
    async build() {
        return await this.modelQuery.exec();
    }

    // 📊 Meta info (for pagination)
    async getMeta() {
        const totalDocuments = await this.modelQuery.clone().countDocuments();  // Get the total document count
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(totalDocuments / limit);  // Calculate total pages for pagination

        return { page, limit, total: totalDocuments, totalPage };
    }
}
