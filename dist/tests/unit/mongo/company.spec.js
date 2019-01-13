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
var CompanyTest_1;
const mocha_typescript_1 = require("mocha-typescript");
const faker_1 = __importDefault(require("faker"));
const compnay_1 = require("../../../schemas/mongo/compnay");
const index_spec_1 = require("./index.spec");
const chai_1 = require("chai");
let CompanyTest = CompanyTest_1 = class CompanyTest {
    constructor() {
        this.data = {
            name: faker_1.default.company.companyName(),
            address: faker_1.default.address.streetAddress()
        };
    }
    static before() {
        CompanyTest_1.Company = index_spec_1.InitializeMongo.getConnection().model("Company", compnay_1.companyMongoSchema);
    }
    createCompany() {
        return new CompanyTest_1.Company(this.data).save().then(result => {
            result._id.should.exist;
            result.name.should.equal(this.data.name);
            result.address.should.equal(this.data.address);
        });
    }
    createInvalidCompany() {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.name = null;
            return new CompanyTest_1.Company(this.data).save().then(result => {
                result._id.should.not.exist;
            }).catch((e) => {
                e.should.exist;
                e.errors.name.should.exist;
                e.errors.name.message.should.be.equal('Please fill company name');
            });
        });
    }
    createCompanyWithName() {
        this.data.name = 'Company';
        return new CompanyTest_1.Company(this.data).save().then(result => {
            result._id.should.exist;
            result.name.should.equal(this.data.name);
            result.address.should.equal(this.data.address);
        }).catch(e => {
            chai_1.expect(e.errmsg).to.deep.include('duplicate key error collection');
        });
    }
    getCompanyWithName() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = 'Company';
            return CompanyTest_1.Company.findOne({ name: name }).then(result => {
                result.should.exist;
                result.name.should.be.equal(name);
            });
        });
    }
};
__decorate([
    mocha_typescript_1.test("Should create a new Company"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "createCompany", null);
__decorate([
    mocha_typescript_1.test("Shouldn't create invalid Company"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "createInvalidCompany", null);
__decorate([
    mocha_typescript_1.test("Should create a new Company with name `Company`"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "createCompanyWithName", null);
__decorate([
    mocha_typescript_1.test("Should find company with name `Company`"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanyTest.prototype, "getCompanyWithName", null);
CompanyTest = CompanyTest_1 = __decorate([
    mocha_typescript_1.suite,
    __metadata("design:paramtypes", [])
], CompanyTest);
