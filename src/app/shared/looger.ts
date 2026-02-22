import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';
import { TransformableInfo } from 'logform';

const { combine, timestamp, label, printf } = format;

const SERVER_NAME = 'MY-SERVER';

// ✅ Custom log format
const myFormat = printf((info: TransformableInfo) => {
  const { level, message } = info;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logLabel = (info as any).label || SERVER_NAME;

 const ts =
  typeof info.timestamp === 'string' || typeof info.timestamp === 'number'
    ? new Date(info.timestamp)
    : new Date();


  const hour = String(ts.getHours()).padStart(2, '0');
  const minutes = String(ts.getMinutes()).padStart(2, '0');
  const seconds = String(ts.getSeconds()).padStart(2, '0');

  let emoji = '';
  if (level === 'info') emoji = 'ℹ️';
  if (level === 'warn') emoji = '⚠️';
  if (level === 'error') emoji = '❌';
  if (level === 'debug') emoji = '🐛';

  return `${ts.toDateString()} ${hour}:${minutes}:${seconds} [${logLabel}] ${emoji} ${level.toUpperCase()}: ${message}`;
});

// ✅ Info Logger
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: SERVER_NAME }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'winston', 'success', '%DATE%-success.log'),
      datePattern: 'DD-MM-YYYY-HH',
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
});

// ✅ Error Logger
const errorLogger = createLogger({
  level: 'error',
  format: combine(
    label({ label: SERVER_NAME }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'winston', 'error', '%DATE%-error.log'),
      datePattern: 'DD-MM-YYYY-HH',
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
});

export { logger, errorLogger };
