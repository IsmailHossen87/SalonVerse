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
exports.socketHelper = exports.saveNotification = void 0;
const colors_1 = __importDefault(require("colors"));
const looger_1 = require("../shared/looger");
const notification_model_1 = require("../modules/notification/notification.model");
let ioInstance;
const socket = (io) => {
    ioInstance = io;
    io.on('connection', (socket) => {
        looger_1.logger.info(colors_1.default.blue('A user connected: ' + socket.id));
        socket.on('disconnect', () => {
            looger_1.logger.info(colors_1.default.red('A user disconnected: ' + socket.id));
        });
    });
};
// 🔥 emit helper
const emit = (channelType, data) => {
    if (!ioInstance) {
        looger_1.logger.error('Socket.io not initialized');
        return;
    }
    const channel = channelType === 'notification'
        ? `notification::${data.receiver}`
        : `message::${data.receiver}`;
    ioInstance.emit(channel, data);
};
const saveNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = new notification_model_1.NotificationModel(data);
    yield notification.save();
});
exports.saveNotification = saveNotification;
exports.socketHelper = {
    socket,
    emit,
};
