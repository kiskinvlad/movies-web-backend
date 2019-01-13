"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
exports.UserSchema = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    firstName: {
        type: String,
        required: true,
        unique: false,
        index: false,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
        index: false,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
        index: false,
        trim: false,
        minlength: [6, 'Password too short']
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
});
exports.UserSchema.pre("save", function (next) {
    if (!exports.UserSchema.createdAt) {
        exports.UserSchema.createdAt = new Date();
    }
    next();
});
