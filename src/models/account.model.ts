import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";

// import findOrCreate from "mongoose-findorcreate";
const findOrCreate = require("mongoose-findorcreate");

export enum UserRole {
  ADMIN = "admin",
  OWNER = "owner",
  CUSTOMER = "customer",
}

export interface IUserAccount extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  isVerified?: boolean;
  role: UserRole;
}

const userAccountSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  isVerified: { type: Boolean, default: false },
  // role: { type: String, required: true, enum: Object.values(UserRole) },
  password: { type: String, required: false },
  avatar: { type: String },
  role: { type: String },
});

// Hash password before saving
userAccountSchema.pre<IUserAccount>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userAccountSchema.plugin(findOrCreate);

// Generate JWT token
userAccountSchema.methods.getJWTToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

// Compare password
userAccountSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Generate password reset token
userAccountSchema.methods.getResetPasswordToken = function (): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and add resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return resetToken;
};
const UserAccount = mongoose.model<IUserAccount>("Account", userAccountSchema);

export default UserAccount;
