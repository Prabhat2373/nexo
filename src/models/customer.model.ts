import mongoose, { Document, Schema } from "mongoose";

interface ICustomer extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
  },
  { timestamps: true }
);

const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;
