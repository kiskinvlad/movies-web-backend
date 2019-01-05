"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("./config");
const App_1 = __importDefault(require("./App"));
/**
 * Server port and custom variable
 */
const port = process.env.PORT || 3000;
const name = process.env.NAME;
/**
 * Entry endpoint of express app
 * Starting server
 */
App_1.default.listen(port, (err) => {
    if (err) {
        return config_1.logger.error(err);
    }
    return config_1.logger.info(`Hello ${name}, server is listening on port ${port}`);
});
