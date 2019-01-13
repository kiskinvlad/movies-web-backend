"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class MainRoutes {
    constructor() {
        this.router = express_1.Router();
        this.initializeRouter();
    }
    initializeRouter() {
        /**
         * Default api route
         * @path /api
         */
        this.router.get('/', (req, res) => {
            res.status(200).json({ message: 'Connected!' });
        });
        /**
         * Return not found for not defined api routes
         */
        this.router.get('/*', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const e = { status: 404, message: 'Not Found' };
            res.status(e.status).json({ message: e.message });
            next();
        }));
    }
}
exports.default = new MainRoutes().router;
