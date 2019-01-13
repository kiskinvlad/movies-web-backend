"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../constants/index");
const express_jwt_1 = __importDefault(require("express-jwt"));
class Jwt {
    static jwtHandler() {
        return express_jwt_1.default({ secret: index_1.secretJwt }).unless({
            path: [
                '/api/auth/login',
                '/api/auth/registration',
                '/api/auth/confirmation',
                '/api/auth/send',
                '/api/auth/reset',
                '/api/auth/resetConfirmation'
            ]
        });
    }
}
exports.default = Jwt;
