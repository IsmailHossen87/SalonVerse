"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormDataMiddleware = void 0;
const parseFormDataMiddleware = (req, res, next) => {
    var _a;
    try {
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
            const parsed = JSON.parse(req.body.data);
            req.body = Object.assign({}, parsed);
        }
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format in form-data "data" field',
        });
    }
};
exports.parseFormDataMiddleware = parseFormDataMiddleware;
