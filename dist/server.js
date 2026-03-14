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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const looger_1 = require("./app/shared/looger");
const redis_config_1 = require("./app/config/redis.config");
const seed_SuperAdmin_1 = require("./app/utils/seed.SuperAdmin");
const socketHelper_1 = require("./app/helpers/socketHelper");
const socket_io_1 = require("socket.io");
let server;
// servers connected
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVar.DB_URL);
        looger_1.logger.info("Server Connected Sucessfully");
        const port = typeof env_1.envVar.PORT === 'number' ? env_1.envVar.PORT : Number(env_1.envVar.PORT);
        //USE port and IP address
        server = app_1.default.listen(port, () => {
            looger_1.logger.info("🔥🔥Server is Running");
        });
        // 🔥 Initialize Socket.io
        //socket
        const io = new socket_io_1.Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: '*',
            },
        });
        socketHelper_1.socketHelper.socket(io);
        //@ts-ignore
        global.io = io;
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield startServer();
    yield (0, seed_SuperAdmin_1.seedSuperAdmin)();
}))();
// unhandle rejection error
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected... Server shutting down.", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// uncaught  Exception error
process.on("uncaughtException", (err) => {
    console.log("uncaught Exception  detected... Server shutting down.", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Sigtram  Exception error
process.on("SIGTERM", () => {
    console.log("Sigter sigmal   recieved... Server shutting down.");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Sigtram  Exception error
process.on("SIGINT", () => {
    console.log("SIGINT signal   recieved... Server shutting down.");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
