import { Document } from "mongoose";
import { UserModel } from "../models/user";

export interface IUserModel extends UserModel, Document {
  //custom methods for your model would be defined here
}