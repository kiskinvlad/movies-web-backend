"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv/config");
const method_override_1 = __importDefault(require("method-override"));
const q_1 = __importDefault(require("q"));
const mongoose_1 = __importDefault(require("mongoose")); //import mongoose
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const routes_1 = require("./routes");
class App {
    constructor() {
        /**
         * Use q promise as default
         */
        global.Promise = q_1.default.Promise;
        /**
         * Create express instance
         */
        this.express = express_1.default();
        this.setupConfigurations();
        /**
         * Setup database
         */
        if (process.env.NODE_ENV !== 'test') {
            this.setupMongo();
        }
        this.mountAPIRoutes();
        this.handleErrors();
    }
    /**
     * Setup express
     * Static, middleweares
     */
    setupConfigurations() {
        this.express.use(body_parser_1.default.json());
        this.express.use(body_parser_1.default.urlencoded({ extended: true }));
        this.express.use(method_override_1.default());
        this.express.set('view options', { layout: false });
        this.express.use(express_1.default.static(path_1.default.join(__dirname, process.env.NODE_ENV === 'production' ? 'dist/static' : '/static')));
        this.express.use('/', express_1.default.static(path_1.default.join(__dirname, process.env.NODE_ENV === 'production' ? 'dist/static' : '/static')));
        this.express.use(cors_1.default({ credentials: true, origin: true }));
        this.express.use(config_1.Jwt.jwtHandler());
        config_1.Mailer.setupMailer();
    }
    /**
     * Setup mongoose
     */
    setupMongo() {
        mongoose_1.default.Promise = global.Promise;
        const MONGODB_CONNECTION = "mongodb://localhost:27017/db";
        const connection = mongoose_1.default.connect(MONGODB_CONNECTION, {
            useNewUrlParser: true,
            useCreateIndex: true,
        }, (err) => {
            if (err) {
                config_1.logger.error(err);
            }
        });
    }
    /**
     * Mount api routes
     */
    mountAPIRoutes() {
        this.express.use('/api/auth', routes_1.userApi);
        this.express.use('/api', routes_1.api);
    }
    /**
     * Handle error midlleweares
     */
    handleErrors() {
        this.express.use(morgan_1.default(process.env.NODE_ENV));
        this.express.use(config_1.ErrorHandler.logErrors);
        this.express.use(config_1.ErrorHandler.clientErrorHandler);
        this.express.use(config_1.ErrorHandler.errorHandler);
    }
}
exports.default = new App().express;
