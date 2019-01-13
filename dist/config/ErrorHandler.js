"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class ErrorHandler {
    static logErrors(err, req, res, next) {
        index_1.logger.error(err.stack);
        next(err);
    }
    static clientErrorHandler(err, req, res, next) {
        if (req.xhr) {
            res.status(500).send({ error: 'Something failed!' });
        }
        else if (err.name === 'UnauthorizedError') {
            return res.status(500).json({ error: 'Invalid Token' });
        }
        else {
            next(err);
        }
    }
    static errorHandler(err, req, res, next) {
        res.status(500).send({ message: err.message, name: err.name });
    }
}
exports.default = ErrorHandler;
