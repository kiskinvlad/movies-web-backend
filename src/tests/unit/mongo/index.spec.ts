import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import mongoose, { Connection } from "mongoose";

@suite
export class InitializeMongo {
  private static connection: mongoose.Connection;
  
  public async before() {

    let chai = require("chai");
    chai.should();
    
    mongoose.Promise = global.Promise;
    const MONGODB_CONNECTION: string = "mongodb://localhost:27017/db";
    // const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION, { useNewUrlParser: true });
    InitializeMongo.connection = mongoose.createConnection(MONGODB_CONNECTION, 
      { 
        useNewUrlParser: true,
        useCreateIndex: true,
      });
  }

  constructor() {}

  @test("Mongo initializated")
  public async sequelizeCreated() {
    await require('./user.spec');
    await require('./company.spec');
  }

  public static getConnection(): mongoose.Connection {
    return InitializeMongo.connection;
  }
}
