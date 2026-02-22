import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/looger';

let ioInstance: Server;

const socket = (io: Server) => {
    ioInstance = io;

    io.on('connection', (socket) => {
        logger.info(colors.blue('A user connected'));

        socket.on('disconnect', () => {
            logger.info(colors.red('A user disconnected'));
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

    ioInstance.to(channel).emit(channel, data);
};

export const socketHelper = {
    socket,
    emit,
};

