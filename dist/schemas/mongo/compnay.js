"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.companyMongoSchema = new mongoose_1.Schema({
    createdAt: Date,
    name: {
        type: String,
        required: [true, 'Please fill company name'],
        unique: true,
        index: true,
        trim: true,
    },
    address: {
        type: String,
        required: false,
        unique: false,
        index: false,
        trim: true,
    }
});
exports.companyMongoSchema.pre("save", function (next) {
    if (!exports.companyMongoSchema.createdAt) {
        exports.companyMongoSchema.createdAt = new Date();
    }
    next();
});
