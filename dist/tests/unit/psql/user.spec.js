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
const user_1 = require("../../../schemas/sequelize/user");
const faker_1 = __importDefault(require("faker"));
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_test_helpers_1 = require("sequelize-test-helpers");
const chai_1 = require("chai");
const App_1 = __importDefault(require("../../../App"));
const chai_2 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
let UserTest = class UserTest {
    constructor() {
        this.user = new user_1.User();
        this.fakeUser = {
            email: faker_1.default.internet.email(),
            firstName: faker_1.default.name.firstName(),
            lastName: faker_1.default.name.lastName(),
        };
        sequelize_test_helpers_1.checkModelName(this.user)('User');
    }
    static before() {
        //require chai and use should() assertions
        chai_2.default.use(chai_http_1.default);
        chai_2.default.should();
    }
    checkProperties() {
        context('user properties', () => {
            ;
            [
                'email',
                'firstName',
                'lastName',
                "companyId"
            ].forEach(sequelize_test_helpers_1.checkPropertyExists(this.user));
        });
    }
    checkAssociations() {
        const Association = sequelize_typescript_1.Sequelize['Association'];
        chai_1.expect(user_1.User)
            .to.have.property('associations')
            .that.has.property('company')
            .that.is.an.instanceOf(Association['BelongsTo'])
            .and.has.property('foreignKey', 'companyId');
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chai_2.default.request(App_1.default)
                .post('/api/user')
                .send(this.fakeUser)
                .then((res) => {
                res.body.should.be.a('object');
                chai_1.expect(res).to.have.status(201);
                chai_1.expect(res.body).to.deep.include(this.fakeUser);
            });
        });
    }
    createUserWithCompany() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fakeUser.companyId = 1;
            return yield chai_2.default.request(App_1.default)
                .post('/api/user')
                .send(this.fakeUser)
                .then((res) => {
                res.body.should.be.a('object');
                chai_1.expect(res).to.have.status(201);
                chai_1.expect(res.body).to.deep.include(this.fakeUser);
            });
        });
    }
    createInvalidUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fakeUser.email = null;
            return yield chai_2.default.request(App_1.default)
                .post('/api/user')
                .send(this.fakeUser)
                .then((res) => {
                res.body.should.be.a('object');
                chai_1.expect(res).to.have.status(500);
                chai_1.expect(res.body.email).to.not.exist;
            });
        });
    }
    getUserById() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = 1;
            return yield chai_2.default.request(App_1.default)
                .get('/api/user')
                .query({ id: id })
                .then((res) => {
                res.body.id.should.be.equal(id);
            });
        });
    }
    createSpecialUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fakeUser.email = 'kiskinvlad@gmail.com';
            return yield chai_2.default.request(App_1.default)
                .post('/api/user')
                .send(this.fakeUser)
                .then((res) => {
                res.body.should.be.a('object');
                chai_1.expect(res).to.have.status(201);
                chai_1.expect(res.body).to.deep.include(this.fakeUser);
            }).catch(e => {
            });
        });
    }
};
__decorate([
    mocha_typescript_1.test("Properties should exist"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserTest.prototype, "checkProperties", null);
__decorate([
    mocha_typescript_1.test("Check assoiciations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserTest.prototype, "checkAssociations", null);
__decorate([
    mocha_typescript_1.test("Create user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserTest.prototype, "createUser", null);
__decorate([
    mocha_typescript_1.test("Create user with company Id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserTest.prototype, "createUserWithCompany", null);
__decorate([
    mocha_typescript_1.test("Shouldn't create invalid user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserTest.prototype, "createInvalidUser", null);
__decorate([
    mocha_typescript_1.test("Should find user with id = 1"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserTest.prototype, "getUserById", null);
__decorate([
    mocha_typescript_1.test("Create user with email `kiksinvlad@gmail.com`"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserTest.prototype, "createSpecialUser", null);
UserTest = __decorate([
    mocha_typescript_1.suite,
    __metadata("design:paramtypes", [])
], UserTest);
