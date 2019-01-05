import { suite, test } from "mocha-typescript";
import mongoose from "mongoose";

import { IUserModel } from "../../../interfaces/IUserModel";
import { IModel } from "../../../interfaces/index";
import { UserModel } from "../../../models/user";
import { userMongoSchema } from "../../../schemas/mongo/user";
import faker from 'faker';
import { InitializeMongo } from "./index.spec";

import chai from "chai";
import chaiHttp from 'chai-http';
import { expect } from "chai";
@suite
class UserTest {

  private data: UserModel;
  public static User: mongoose.Model<IUserModel>;

  public static before() {
    UserTest.User = InitializeMongo.getConnection().model<IUserModel>("User", userMongoSchema);
    chai.use(chaiHttp)
    chai.should();
  }

  constructor() {
    this.data = {
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
  }

  @test("Should create a new User")
  public createUser(): Promise<void>{
    return new UserTest.User(this.data).save().then(result => {
      result._id.should.exist;
      result.email.should.equal(this.data.email);
      result.firstName.should.equal(this.data.firstName);
      result.lastName.should.equal(this.data.lastName);
    });
  }

  @test("Create user with company Id")
  public async createUserWithCompany(): Promise<void>  {
    this.data.companyId = 1;
    return new UserTest.User(this.data).save().then(result => {
      result._id.should.exist;
      result.email.should.equal(this.data.email);
      result.firstName.should.equal(this.data.firstName);
      result.lastName.should.equal(this.data.lastName);
      result.companyId.should.equal(this.data.companyId);
    });
  }

  @test("Shouldn't create invalid user")
  public async createInvalidUser(): Promise<void> {
    this.data.email = null;
    return new UserTest.User(this.data).save().then(result => {
      result._id.should.not.exist;
    }).catch((e) => {
      e.should.exist;
      e.errors.email.should.exist;
      e.errors.email.message.should.be.equal('Path `email` is required.')
    });
  }

  @test("Should create user with email `kiskinvlad@gmail.com`")
  public async createSpecialUser(): Promise<void> {
    this.data.email = 'kiskinvlad@gmail.com';
    return new UserTest.User(this.data).save().then(result => {
      result.email.should.equal(this.data.email);
      result.firstName.should.equal(this.data.firstName);
      result.lastName.should.equal(this.data.lastName);
      result.companyId.should.equal(this.data.companyId);
    }).catch(e => {
      expect(e.errmsg).to.deep.include('duplicate key error collection')
    });
  }

  // @test("Should find user with id = 1")
  // public async getUserById(): Promise<void> {
  //   const id = 1;
  //   return UserTest.User.findOne({id: id}).then(result => {
  //     result.id.should.be.equal(id);
  //   }).catch(e => console.log(e));
  // }

  @test("Should find user with email = `kiskinvlad@gmail.com`")
  public async getSpecialUser(): Promise<void> {
    const email = 'kiskinvlad@gmail.com';
    return UserTest.User.findOne({email: email}).then(result => {
      result.should.exist;
      result.email.should.be.equal(email);
    }).catch(e => console.log(e));
  }

}