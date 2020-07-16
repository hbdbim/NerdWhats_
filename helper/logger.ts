import * as Dotenv from 'dotenv';
import * as Winston from 'winston';

Dotenv.config();

export class ApiLogger {
  public static newInstance(): Winston.Logger {
    const consoleTransport = new Winston.transports.Console({
      format: Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.timestamp(),
        Winston.format.align(),
        Winston.format.printf(info => {
          const { timestamp, level, message, ...args } = info;

          const ts = timestamp.slice(0, 19).replace('T', ' ');
          return `${ts} [${level}]: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
          }`;
        })
      ),
      level: process.env.LOG_LEVEL,
    });

      const fileTransport = new Winston.transports.File({
          format: Winston.format.combine(              
              Winston.format.timestamp(),
              Winston.format.printf(info => {
                  const { timestamp, level, message, ...args } = info;

                  const ts = timestamp.slice(0, 19).replace('T', ' ');
                  return `[${ts}] [${level}] - ${message} ${
                      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
                      }`;
              })
          ),
          filename: './log/app.log',
          level: 'error',
          maxsize: 10485760,
          maxFiles:3
      });


      return Winston.createLogger({
          transports: [consoleTransport, fileTransport],
    });
  }
}

export default ApiLogger.newInstance();
