import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/looger';
import { NotificationModel } from '../modules/notification/notification.model';

let ioInstance: Server;

const socket = (io: Server) => {
    ioInstance = io;

    io.on('connection', (socket) => {
        logger.info(colors.blue('A user connected: ' + socket.id));

        socket.on('disconnect', () => {
            logger.info(colors.red('A user disconnected: ' + socket.id));
        });
    });
};

// 🔥 emit helper
const emit = (channelType: string, data: any) => {
    if (!ioInstance) {
        logger.error('Socket.io not initialized');
        return;
    }

    const channel =
        channelType === 'notification'
            ? `notification::${data.receiver}`
            : `message::${data.receiver}`;

    ioInstance.emit(channel, data);
};

export const saveNotification = async (data: any) => {
    const notification = new NotificationModel(data);
    await notification.save();
};

export const socketHelper = {
    socket,
    emit,
};
