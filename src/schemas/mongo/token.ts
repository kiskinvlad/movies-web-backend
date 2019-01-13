import { Schema } from "mongoose";

export const TokenSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    expires: 60*5,
    default: Date.now
  },
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  }
});

TokenSchema.pre("save", function(next) {
  if (!TokenSchema.createdAt) {
    TokenSchema.createdAt = new Date();
  }
  next();
});