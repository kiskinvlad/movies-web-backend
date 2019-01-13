"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../schemas/mongo/index");
const index_2 = require("../../constants/index");
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.initializeMongoRouter();
    }
    /**
      * Mongo router
      */
    initializeMongoRouter() {
        /**
         * Create User mongo model
         */
        const User = mongoose_1.default.model("User", index_1.UserSchema);
        const Token = mongoose_1.default.model("Token", index_1.TokenSchema);
        /**
         * Update user
         */
        this.router.patch('/update', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const body = req.body;
            try {
                res.status(200).json(yield User.updateOne({ email: email }, body));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Get all users
         */
        this.router.get('/all', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json(yield User.find({}));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Create new user
         */
        this.router.post('/registration', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.registrationModel.email;
                const password = req.body.registrationModel.password;
                const BCRYPT_SALT_ROUNDS = 12;
                const exist = yield User.findOne({ email });
                if (!exist) {
                    try {
                        req.body.registrationModel.password = yield bcrypt_1.default.hash(password, BCRYPT_SALT_ROUNDS);
                    }
                    catch (e) {
                        e.name = "SOMETHING_WRONG";
                        res.status(500).json({ message: e.message, name: e.name });
                    }
                    const user = yield User.create(req.body.registrationModel);
                    const token = new Token({
                        _userId: user._id,
                        token: crypto_1.default.randomBytes(16).toString('hex')
                    });
                    token.save().then(() => {
                        var mailOptions = {
                            from: 'Favorite movies <kiskinvlad@gmail.com>',
                            to: `Recipient <${email}>`,
                            subject: 'Account Verification Token',
                            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' +
                                'localhost:4200' + '\/auth' + '\/confirmation?token=' + token.token + '&email=' + email + '.\n'
                        };
                        config_1.Mailer.transporter.sendMail(mailOptions, (err) => {
                            if (err) {
                                return res.status(500).json({ msg: err.message });
                            }
                            res.status(200).json('A verification email has been sent to ' + email + '.');
                        });
                    }).catch((err) => {
                        res.status(500).json({ msg: err.message });
                    });
                }
                else {
                    const e = { status: 409, message: 'User with this email already exist', name: "USER_EMAIL_EXIST" };
                    res.status(e.status).json({ message: e.message, name: e.name });
                }
            }
            catch (e) {
                if (e.message.includes('email cannot be null')) {
                    e.name = "EMAIL_IS_NULL";
                    res.status(500).json({ message: e.message, name: e.name });
                }
                else {
                    e.name = "SOMETHING_WRONG";
                    res.status(500).json({ message: e.message, name: e.name });
                }
            }
        }));
        /**
         * Resend email
         */
        this.router.post('/send', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const user = yield User.findOne({ email });
                if (!user) {
                    const e = { status: 409, message: 'User email not exist', name: "EMAIL_IS_NULL" };
                    res.status(e.status).json({ message: e.message, name: e.name });
                }
                const token = new Token({
                    _userId: user._id,
                    token: crypto_1.default.randomBytes(16).toString('hex')
                });
                token.save().then(() => {
                    var mailOptions = {
                        from: 'Favorite movies <kiskinvlad@gmail.com>',
                        to: `Recipient <${email}>`,
                        subject: 'Account Verification Token',
                        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/'
                            + 'localhost:4200' + '\/auth' + '\/confirmation?token=' + token.token + '&email=' + email + '.\n'
                    };
                    config_1.Mailer.transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                            return res.status(500).json({ msg: err.message });
                        }
                        res.status(200).json('A verification email has been sent to ' + email + '.');
                    });
                });
            }
            catch (e) {
                e.name = "SOMETHING_WRONG";
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Confirm user registration
         */
        this.router.post('/confirmation', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            const email = req.body.email;
            Token.findOne({ token: token }, (err, token) => {
                if (!token)
                    return res.status(400).json({
                        name: 'TOKEN_NOT_VERIFIED',
                        message: 'We were unable to find a valid token. Your token may have expired.'
                    });
                User.findOne({ _id: token._userId, email: email }, (err, user) => {
                    if (!user)
                        return res.status(400).json({ name: 'USER_TOKEN_NOT_FOUND', message: 'We were unable to find a user for this token.' });
                    if (user.isVerified)
                        return res.status(400).json({ name: 'ALREADY_VERIFIED', message: 'This user has already been verified.' });
                    user.isVerified = true;
                    user.save((err) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                        res.status(200).json({ name: 'ACCOUNT_VERIFIED', message: "Registration success. Please log in." });
                    });
                });
            });
        }));
        /**
         * Auth user
         */
        this.router.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.loginModel.email;
                const password = req.body.loginModel.password;
                const user = yield User.findOne({ 'email': email });
                let compared = false;
                try {
                    compared = yield bcrypt_1.default.compare(password, user.password);
                }
                catch (e) {
                    e = { status: 409, message: 'Wrong email or/and password', name: "USER_NOT_EXIST" };
                    res.status(e.status).json({ message: e.message, name: e.name });
                }
                if (!user || !compared) {
                    const e = { status: 409, message: 'Wrong email or/and password', name: "USER_NOT_EXIST" };
                    res.status(e.status).json({ message: e.message, name: e.name });
                }
                else if (user && !user.isVerified) {
                    const e = { status: 409, message: 'User not verfified, please check email', name: "USER_NOT_VERIFIED" };
                    res.status(e.status).json({ message: e.message, name: e.name });
                }
                else {
                    const token = jsonwebtoken_1.sign({ sub: user.id }, index_2.secretJwt);
                    const jwtUserModel = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        image: user.image || null,
                        token: token
                    };
                    res.status(201).json(jwtUserModel);
                }
            }
            catch (e) {
                if (e.message.includes('email cannot be null')) {
                    e.name = "EMAIL_IS_NULL";
                    res.status(500).json({ message: e.message, name: e.name });
                }
                else {
                    e.name = "SOMETHING_WRONG";
                    res.status(500).json({ message: e.message, name: e.name });
                }
            }
        }));
        /**
        * Send not found for other not existing routes
        */
        this.router.post('/getUser', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            try {
                const user = yield User.findOne({ email });
                res.status(201).json(user);
            }
            catch (e) {
                console.log(e);
                e = { status: 409, message: 'User email not exist', name: "USER_NOT_EXIST" };
                res.status(e.status).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Reset password
         */
        this.router.post('/reset', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            try {
                const user = yield User.findOne({ email });
                if (user) {
                    if (!user.isVerified)
                        return res.status(400).json({ name: 'USER_NOT_VERIFIED', message: 'User not verified' });
                    const token = new Token({
                        _userId: user._id,
                        token: crypto_1.default.randomBytes(16).toString('hex')
                    });
                    token.save().then(() => {
                        var mailOptions = {
                            from: 'Favorite movies <kiskinvlad@gmail.com>',
                            to: `Recipient <${email}>`,
                            subject: 'Reset Verification Token',
                            text: 'Hello,\n\n' + 'Please verify your email by clicking the link: \nhttp:\/\/' +
                                'localhost:4200' + '\/auth' + '\/resetConfirmation?token=' + token.token + '&email=' + email + '.\n'
                        };
                        config_1.Mailer.transporter.sendMail(mailOptions, (err) => {
                            if (err) {
                                return res.status(500).json({ msg: err.message });
                            }
                            res.status(200).json('A verification email has been sent to ' + email + '.');
                        });
                    }).catch((err) => {
                        res.status(500).json({ msg: err.message });
                    });
                }
                else {
                    const e = { status: 409, message: 'User email not exist', name: "USER_NOT_EXIST" };
                    res.status(e.status).json({ message: e.message, name: e.name });
                }
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Reset password confirmation
         */
        this.router.post('/resetConfirmation', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            const email = req.body.email;
            const password = req.body.password;
            const BCRYPT_SALT_ROUNDS = 12;
            Token.findOne({ token: token }, (err, token) => {
                if (!token)
                    return res.status(400).json({
                        name: 'TOKEN_NOT_VERIFIED',
                        message: 'We were unable to find a valid token. Your token may have expired.'
                    });
                if (!password)
                    return res.status(400).json({
                        name: 'PASSWORD_NOT_EXIST',
                        message: 'Password field not exist'
                    });
                User.findOne({ _id: token._userId, email: email }, (err, user) => {
                    if (!user)
                        return res.status(400).json({ name: 'USER_TOKEN_NOT_FOUND', message: 'We were unable to find a user for this token.' });
                    try {
                        bcrypt_1.default.hash(password, BCRYPT_SALT_ROUNDS).then((password) => {
                            user.password = password;
                            user.save((err, user) => {
                                if (err) {
                                    return res.status(500).json({ message: err.message });
                                }
                                res.status(200).json({ name: 'PASSWORD_CHANGED', message: "Password change success. Please log in." });
                            });
                        });
                    }
                    catch (e) {
                        e.name = "SOMETHING_WRONG";
                        res.status(500).json({ message: e.message, name: e.name });
                    }
                });
            });
        }));
        /**
         * Send not found for other not existing routes
         */
        this.router.get('/*', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const e = { status: 404, message: 'Not Found' };
            res.status(e.status).json({ message: e.message });
            next();
        }));
    }
}
exports.default = new UserRoutes().router;
