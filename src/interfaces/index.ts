import { Model } from "mongoose";
import { IUserModel } from "./IUserModel";

export interface IModel {
  user: Model<IUserModel>;
}