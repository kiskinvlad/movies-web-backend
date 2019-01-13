"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.TokenSchema = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        expires: 60 * 5,
        default: Date.now
    },
    _userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    }
});
exports.TokenSchema.pre("save", function (next) {
    if (!exports.TokenSchema.createdAt) {
        exports.TokenSchema.createdAt = new Date();
    }
    next();
});
