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
require("dotenv/config");
/**
 *  Remove next if using mongo
 */
const company_1 = require("../../schemas/sequelize/company");
const user_1 = require("../../schemas/sequelize/user");
/**
 * Remove next if using postgres
 */
const mongoose_1 = __importDefault(require("mongoose"));
const user_2 = require("../../schemas/mongo/user");
const compnay_1 = require("../../schemas/mongo/compnay");
class CompanyRoutes {
    constructor() {
        this.router = express_1.Router();
        process.env.DB_NAME === 'psql' ? this.initializeSequelizeRouter() : this.initializeMongoRouter();
    }
    /**
     * Sequilize router
     */
    initializeSequelizeRouter() {
        /**
         * Update company by id
         */
        this.router.patch('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            const body = req.body;
            try {
                res.status(200).json(yield company_1.Company.update(body, { where: { id: id } }));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Get all companies
         */
        this.router.get('/all', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json(yield company_1.Company.findAll());
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Update company by id
         */
        this.router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            try {
                res.status(200).json(yield company_1.Company.findById(id));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Get users by company id
         */
        this.router.get('/users', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.companyId;
            try {
                res.status(200).json(yield user_1.User.findAll({ where: { companyId: id } }));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Create new company
         */
        this.router.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield company_1.Company.create(req.body);
                res.status(201).json(company);
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
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
         * Create User and Company mongo models
         */
        const User = mongoose_1.default.model("User", user_2.userMongoSchema);
        const Company = mongoose_1.default.model("Company", compnay_1.companyMongoSchema);
        /**
         * Update company by name
         */
        this.router.patch('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const name = req.body.name;
            const body = req.body;
            try {
                res.status(200).json(yield Company.update({ name: name }, body));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Get all companies
         */
        this.router.get('/all', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json(yield Company.find({}));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Get company by name
         */
        this.router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const name = req.query.name;
            try {
                res.status(200).json(yield Company.find({ name: name }));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Get users by company id
         */
        this.router.get('/users', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.companyId;
            try {
                res.status(200).json(yield User.find({ companyId: id }));
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
            }
        }));
        /**
         * Create new company
         */
        this.router.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield Company.create(req.body);
                res.status(201).json(company);
            }
            catch (e) {
                res.status(500).json({ message: e.message, name: e.name });
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
exports.default = new CompanyRoutes().router;
