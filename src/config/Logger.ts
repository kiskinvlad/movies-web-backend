import * as winston from 'winston';
import * as appRoot from 'app-root-path';
class Logger {

  public winston: winston.Logger;

  constructor() {
    const loggerOptions = this.initializeLoggerOptions();
    this.winston = this.setupWinstonLogger(loggerOptions);
  }
  
  private format() {
    const formatMessage = info => `[${info.timestamp.slice(0, 19).replace('T', ' ')}] ${info.level}: ${info.message}`;
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(formatMessage)
    );
  }

  private initializeLoggerOptions(): any {

    const options = {
      file: {
        level: process.env.NODE_ENV == 'production' ? 'error' : 'debug',
        filename: `${appRoot}/logs/app.log`,
        options: { flags: 'w'},
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
        format: winston.format.json()
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        options: { flags: 'w'},
        json: false,
        colorize: true,
        format: this.format(),
      },
    }
    return options;
  }

  private setupWinstonLogger(options): winston.Logger {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.File(options.file).on('flush', () => {
          process.exit(0);
        }),
        new winston.transports.Console(options.console)
      ],
      exitOnError: false,
    });
    return logger;
  }
  
}

export default new Logger().winston;