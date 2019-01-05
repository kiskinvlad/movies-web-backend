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
const company_1 = require("../../../schemas/sequelize/company");
const faker_1 = __importDefault(require("faker"));
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_test_helpers_1 = require("sequelize-test-helpers");
const chai_1 = require("chai");
const App_1 = __importDefault(require("../../../App"));
const chai_2 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
let CompanyTest = class CompanyTest {
    constructor() {
        this.company = new company_1.Company();
        this.fakeCompany = {
            name: faker_1.default.company.companyName(),
            address: faker_1.default.address.streetAddress()
        };
        sequelize_test_helpers_1.checkModelName(this.company)('Company');
    }
    static before() {
        chai_2.default.use(chai_http_1.default);
        chai_2.default.should();
    }
    static beforeEach() {
        company_1.Company.sync({ logging: console.log });
    }
    checkProperties() {
        context('company properties', () => {
            ;
            [
                'name',
                'address',
            ].forEach(sequelize_test_helpers_1.checkPropertyExists(this.company));
        });
    }
    checkAssociations() {
        const Association = sequelize_typescript_1.Sequelize['Association'];
        chai_1.expect(company_1.Company)
            .to.have.property('associations')
            .that.has.property('users')
            .that.is.an.instanceOf(Association['HasMany']);
    }
    createCompany() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chai_2.default.request(App_1.default)
                .post('/api/company')
                .send(this.fakeCompany).then((res) => {
                res.body.should.be.a('object');
                chai_1.expect(res).to.have.status(201);
                chai_1.expect(res.body).to.deep.include(this.fakeCompany);
            });
        });
    }
    createInvalidUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fakeCompany.name = null;
            return yield chai_2.default.request(App_1.default)
                .post('/api/company')
                .send(this.fakeCompany)
                .then((res) => {
                res.body.should.be.a('object');
                chai_1.expect(res.body.address).to.not.exist;
                chai_1.expect(res).to.have.status(500);
            });
        });
    }
    createCompanyWithName() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fakeCompany.name = 'Company';
            return yield chai_2.default.request(App_1.default)
                .post('/api/company')
                .send(this.fakeCompany)
                .then((res) => {
                chai_1.expect(res.body.name).to.be.equal('Company');
                chai_1.expect(res).to.have.status(201);
            });
        });
    }
    getCompanyWithName() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = 1;
            return yield chai_2.default.request(App_1.default)
                .get('/api/company')
                .query({ id: id })
                .then((res) => {
                res.body.should.exist;
                res.body.id.should.be.equal(id);
            });
        });
    }
};
__decorate([
    mocha_typescript_1.test("Properties should exist"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyTest.prototype, "checkProperties", null);
__decorate([
    mocha_typescript_1.test("Check assoiciations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyTest.prototype, "checkAssociations", null);
__decorate([
    mocha_typescript_1.test("Create company"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "createCompany", null);
__decorate([
    mocha_typescript_1.test("Shouldn't create company"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "createInvalidUser", null);
__decorate([
    mocha_typescript_1.test("Should create a new Company with name `Company`"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "createCompanyWithName", null);
__decorate([
    mocha_typescript_1.test("Should find company with id = 1"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "getCompanyWithName", null);
CompanyTest = __decorate([
    mocha_typescript_1.suite,
    __metadata("design:paramtypes", [])
], CompanyTest);
