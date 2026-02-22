import { createClient } from 'redis';
import { envVar } from "../config/env";

// Redis client configuration
export const redisClient = createClient({
    username: envVar.REDIS_USERNAME,
    password: envVar.REDIS_PASSWORD,
    socket: {
        host: envVar.REDIS_HOST,
        port: Number(envVar.REDIS_PORT),
    },
});



// Error handling for Redis client
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});


export const connectRedis = async () => {
    try {

        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Redis connected successfully!");
        }
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
};

export const closeRedisConnection = async () => {
    try {
        await redisClient.quit();
        console.log("Redis connection closed.");
    } catch (err) {
        console.error('Error closing Redis connection:', err);
    }
};
