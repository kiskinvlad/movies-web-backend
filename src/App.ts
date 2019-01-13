import path from 'path';
import express from "express";
import bodyParser from 'body-parser';
import 'dotenv/config';
import methodOverride from 'method-override';
import q from 'q'
import mongoose from 'mongoose'; //import mongoose
import morgan from 'morgan';
import cors from 'cors';

import { Jwt, Mailer, logger, ErrorHandler } from "./config";

import { api, userApi } from './routes'


import { IUserModel } from "./interfaces/IUserModel";
import { IModel } from "./interfaces/index";
import { UserModel } from "./models/user";

class App { 
  /**
   * Main express variable
   */
  public express: express.Application; 

  constructor () { 
    /**
     * Use q promise as default
     */
    global.Promise = q.Promise;
    /**
     * Create express instance
     */
    this.express = express();
    this.setupConfigurations();

    /**
     * Setup database
     */
    if (process.env.NODE_ENV !== 'test') {
      this.setupMongo(); 
    }
    this.mountAPIRoutes();
    this.handleErrors();
  
  }
  /**
   * Setup express
   * Static, middleweares
   */
  private setupConfigurations(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(methodOverride());
    this.express.set('view options', {layout: false});
    this.express.use(express.static(
      path.join(__dirname, process.env.NODE_ENV === 'production' ? 'dist/static' : '/static'))
    );
    this.express.use('/', express.static(
      path.join(__dirname, process.env.NODE_ENV === 'production' ? 'dist/static' : '/static'))
    )
    this.express.use(cors({credentials: true, origin: true}));
    this.express.use(Jwt.jwtHandler());
    Mailer.setupMailer();
    
  }
  /**
   * Setup mongoose
   */
  private setupMongo(): void{
    mongoose.Promise = global.Promise;
    const MONGODB_CONNECTION: string = "mongodb://localhost:27017/db";
    const connection: mongoose.Connection = mongoose.connect(
      MONGODB_CONNECTION,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
      },
      (err) => {
        if(err) { logger.error(err) }
    });
  }
  /**
   * Mount api routes
   */
  private mountAPIRoutes(): void { 
    this.express.use('/api/auth', userApi) 
    this.express.use('/api', api);
  }
  /**
   * Handle error midlleweares
   */
  private handleErrors(): void {
    this.express.use(morgan(process.env.NODE_ENV));
    this.express.use(ErrorHandler.logErrors);
    this.express.use(ErrorHandler.clientErrorHandler);
    this.express.use(ErrorHandler.errorHandler);
  }
} 
export default new App().express