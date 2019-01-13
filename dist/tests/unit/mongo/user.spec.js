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
const user_1 = require("../../../schemas/mongo/user");
const faker_1 = __importDefault(require("faker"));
const index_spec_1 = require("./index.spec");
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
let UserTest = UserTest_1 = class UserTest {
    constructor() {
        this.data = {
            email: faker_1.default.internet.email(),
            firstName: faker_1.default.name.firstName(),
            lastName: faker_1.default.name.lastName(),
            password: faker_1.default.password.password(),
            isVerified: false
        };
    }
    static before() {
        UserTest_1.User = index_spec_1.InitializeMongo.getConnection().model("User", user_1.UserSchema);
        chai_1.default.use(chai_http_1.default);
        chai_1.default.should();
    }
    createUser() {
        return new UserTest_1.User(this.data).save().then(result => {
            result._id.should.exist;
            result.email.should.equal(this.data.email);
            result.firstName.should.equal(this.data.firstName);
            result.lastName.should.equal(this.data.lastName);
        });
    }
    createInvalidUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.email = null;
            return new UserTest_1.User(this.data).save().then(result => {
                result._id.should.not.exist;
            }).catch((e) => {
                e.should.exist;
                e.errors.email.should.exist;
                e.errors.email.message.should.be.equal('Path `email` is required.');
            });
        });
    }
};
__decorate([
    mocha_typescript_1.test("Should create a new User"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserTest.prototype, "createUser", null);
__decorate([
    mocha_typescript_1.test("Shouldn't create invalid user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserTest.prototype, "createInvalidUser", null);
UserTest = UserTest_1 = __decorate([
    mocha_typescript_1.suite,
    __metadata("design:paramtypes", [])
], UserTest);
var UserTest_1;
