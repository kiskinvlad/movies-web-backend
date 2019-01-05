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
/**
 *  Remove next if using mongo
 */
const user_1 = require("../../schemas/sequelize/user");
/**
 * Remove next if using postgres
 */
const mongoose_1 = __importDefault(require("mongoose"));
const user_2 = require("../../schemas/mongo/user");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        process.env.DB_NAME === 'psql' ? this.initializeSequelizeRouter() : this.initializeMongoRouter();
    }
    /**
     * Sequilize router
     */
    initializeSequelizeRouter() {
        /**
         * Update user by id
         */
        this.router.patch('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const body = req.body;
            try {
                res.status(200).json(yield user_1.User.update(body, { where: { id: id } }));
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
                res.status(200).json(yield user_1.User.findAll());
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Get user by id
         */
        this.router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            try {
                res.status(200).json(yield user_1.User.findById(id));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Create new user
         */
        this.router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const exist = yield user_1.User.findOne({ where: { email: email } });
                if (!exist) {
                    const user = yield user_1.User.create(req.body);
                    res.status(201).json(user);
                }
                else {
                    const e = { status: 409, message: 'User with same email already exist', name: "USER_EMAIL_EXIST" };
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
         * Send not found for other not existing routes
         */
        this.router.get('/*', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const e = { status: 404, message: 'Not Found' };
            res.status(e.status).json({ message: e.message });
            next();
        }));
    }
    /**
      * Mongo router
      */
    initializeMongoRouter() {
        /**
         * Create User mongo model
         */
        const User = mongoose_1.default.model("User", user_2.userMongoSchema);
        /**
         * Update user by lastname
         */
        this.router.patch('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const lastName = req.query.lastName;
            const body = req.body;
            try {
                res.status(200).json(yield User.update({ lastName: lastName }, body));
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
         * Get user by lastname
         */
        this.router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const lastName = req.query.lastName;
            try {
                res.status(200).json(yield User.find({ lastName: lastName }));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Create new user
         */
        this.router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const exist = yield User.findOne({ email });
                if (!exist) {
                    const user = yield User.create(req.body);
                    res.status(201).json(user);
                }
                else {
                    const e = { status: 409, message: 'User with same email already exist', name: "USER_EMAIL_EXIST" };
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
