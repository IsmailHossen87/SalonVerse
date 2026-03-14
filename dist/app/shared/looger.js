"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const winston_1 = require("winston");
const { combine, timestamp, label, printf } = winston_1.format;
const SERVER_NAME = 'MY-SERVER';
// ✅ Custom log format
const myFormat = printf((info) => {
    const { level, message } = info;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logLabel = info.label || SERVER_NAME;
    const ts = typeof info.timestamp === 'string' || typeof info.timestamp === 'number'
        ? new Date(info.timestamp)
        : new Date();
    const hour = String(ts.getHours()).padStart(2, '0');
    const minutes = String(ts.getMinutes()).padStart(2, '0');
    const seconds = String(ts.getSeconds()).padStart(2, '0');
    let emoji = '';
    if (level === 'info')
        emoji = 'ℹ️';
    if (level === 'warn')
        emoji = '⚠️';
    if (level === 'error')
        emoji = '❌';
    if (level === 'debug')
        emoji = '🐛';
    return `${ts.toDateString()} ${hour}:${minutes}:${seconds} [${logLabel}] ${emoji} ${level.toUpperCase()}: ${message}`;
});
// ✅ Info Logger
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: SERVER_NAME }), timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'winston', 'success', '%DATE%-success.log'),
            datePattern: 'DD-MM-YYYY-HH',
            maxSize: '20m',
            maxFiles: '7d',
        }),
    ],
});
exports.logger = logger;
// ✅ Error Logger
const errorLogger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: SERVER_NAME }), timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'winston', 'error', '%DATE%-error.log'),
            datePattern: 'DD-MM-YYYY-HH',
            maxSize: '20m',
            maxFiles: '7d',
        }),
    ],
});
exports.errorLogger = errorLogger;
