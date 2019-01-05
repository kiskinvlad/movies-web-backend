"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const mocha_typescript_1 = require("mocha-typescript");
const mongoose_1 = __importDefault(require("mongoose"));
let InitializeMongo = InitializeMongo_1 = class InitializeMongo {
    constructor() { }
    before() {
        return __awaiter(this, void 0, void 0, function* () {
            let chai = require("chai");
            chai.should();
            mongoose_1.default.Promise = global.Promise;
            const MONGODB_CONNECTION = "mongodb://localhost:27017/db";
            // const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION, { useNewUrlParser: true });
            InitializeMongo_1.connection = mongoose_1.default.createConnection(MONGODB_CONNECTION, {
                useNewUrlParser: true,
                useCreateIndex: true,
            });
        });
    }
    sequelizeCreated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield require('./user.spec');
            yield require('./company.spec');
        });
    }
    static getConnection() {
        return InitializeMongo_1.connection;
    }
};
__decorate([
    mocha_typescript_1.test("Mongo initializated"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InitializeMongo.prototype, "sequelizeCreated", null);
InitializeMongo = InitializeMongo_1 = __decorate([
    mocha_typescript_1.suite,
    __metadata("design:paramtypes", [])
], InitializeMongo);
exports.InitializeMongo = InitializeMongo;
var InitializeMongo_1;
