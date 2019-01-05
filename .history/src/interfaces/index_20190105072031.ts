import { Model } from "mongoose";
import { IUserModel } from "./IUserModel";
import { ICompanyModel } from "./ICompanyModel";

export interface IModel {
  user: Model<IUserModel>;
  company: Model<ICompanyModel>;
}