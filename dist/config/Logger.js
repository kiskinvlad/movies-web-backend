"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
const appRoot = __importStar(require("app-root-path"));
class Logger {
    constructor() {
        const loggerOptions = this.initializeLoggerOptions();
        this.winston = this.setupWinstonLogger(loggerOptions);
    }
    format() {
        const formatMessage = info => `[${info.timestamp.slice(0, 19).replace('T', ' ')}] ${info.level}: ${info.message}`;
        return winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.printf(formatMessage));
    }
    initializeLoggerOptions() {
        const options = {
            file: {
                level: process.env.NODE_ENV == 'production' ? 'error' : 'debug',
                filename: `${appRoot}/logs/app.log`,
                options: { flags: 'w' },
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
                options: { flags: 'w' },
                json: false,
                colorize: true,
                format: this.format(),
            },
        };
        return options;
    }
    setupWinstonLogger(options) {
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
exports.default = new Logger().winston;
