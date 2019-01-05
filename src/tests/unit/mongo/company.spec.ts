import { suite, test } from "mocha-typescript";
import mongoose from "mongoose";

import { IModel } from "../../../interfaces/index";
import faker from 'faker';
import { CompanyModel } from "../../../models/company";
import { ICompanyModel } from "../../../interfaces/ICompanyModel";
import { companyMongoSchema } from "../../../schemas/mongo/compnay";
import { InitializeMongo } from "./index.spec";

import chai from "chai";
import chaiHttp from 'chai-http';
import { expect } from "chai";
@suite
class CompanyTest {

  private data: CompanyModel;
  public static Company: mongoose.Model<ICompanyModel>;

  public static before() {
    CompanyTest.Company = InitializeMongo.getConnection().model<ICompanyModel>("Company", companyMongoSchema);
  }

  constructor() {
    this.data = {
      name: faker.company.companyName(),
      address: faker.address.streetAddress()
    };
  }

  @test("Should create a new Company")
  public createCompany(): Promise<void> {
    return new CompanyTest.Company(this.data).save().then(result => {
      result._id.should.exist;
      result.name.should.equal(this.data.name);
      result.address.should.equal(this.data.address);
    });
  }

  @test("Shouldn't create invalid Company")
  public async createInvalidCompany(): Promise<void> {
    this.data.name = null;
    return new CompanyTest.Company(this.data).save().then(result => {
      result._id.should.not.exist;
    }).catch((e) => {
      e.should.exist;
      e.errors.name.should.exist;
      e.errors.name.message.should.be.equal('Please fill company name')
    });
  }

  @test("Should create a new Company with name `Company`")
  public createCompanyWithName(): Promise<void> {
    this.data.name = 'Company';
    return new CompanyTest.Company(this.data).save().then(result => {
      result._id.should.exist;
      result.name.should.equal(this.data.name);
      result.address.should.equal(this.data.address);
    }).catch(e => {
      expect(e.errmsg).to.deep.include('duplicate key error collection')
    });
  }

  @test("Should find company with name `Company`")
  public async getCompanyWithName(): Promise<void> {
    const name = 'Company';
    return CompanyTest.Company.findOne({name: name}).then(result => {
      result.should.exist;
      result.name.should.be.equal(name);
    });
  }

}