import { Schema } from "mongoose";
import { Binary } from "bson";

const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
}

export const UserSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    validate: [validateEmail, 'Please fill a valid email address'],
  },
  firstName: {
    type: String,
    required: true,
    unique: false,
    index: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    unique: false,
    index: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
    index: false,
    trim: false,
    minlength: [6, 'Password too short']
  },
  image: {
    type: String,
    required: false,
    default: null
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
});

UserSchema.pre("save", function(next) {
  if (!UserSchema.createdAt) {
    UserSchema.createdAt = new Date();
  }
  next();
});