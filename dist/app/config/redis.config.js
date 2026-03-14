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
exports.closeRedisConnection = exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("../config/env");
// Redis client configuration
exports.redisClient = (0, redis_1.createClient)({
    username: env_1.envVar.REDIS_USERNAME,
    password: env_1.envVar.REDIS_PASSWORD,
    socket: {
        host: env_1.envVar.REDIS_HOST,
        port: Number(env_1.envVar.REDIS_PORT),
    },
});
// Error handling for Redis client
exports.redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!exports.redisClient.isOpen) {
            yield exports.redisClient.connect();
            console.log("Redis connected successfully!");
        }
    }
    catch (err) {
        console.error('Error connecting to Redis:', err);
    }
});
exports.connectRedis = connectRedis;
const closeRedisConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redisClient.quit();
        console.log("Redis connection closed.");
    }
    catch (err) {
        console.error('Error closing Redis connection:', err);
    }
});
exports.closeRedisConnection = closeRedisConnection;
