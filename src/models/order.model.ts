import { Document, Mongoose, Schema, model } from "mongoose";

interface IOrder extends Document {
  table: Schema.Types.ObjectId;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  subTotal: number;
  discount: number;
  tax: number;
  platformFee: number;
  otherCharges: number;
  totalAmount: number;
  paymentStatus: "unpaid" | "paid" | "pending";
  restaurantId: Schema.Types.ObjectId;
  customer: Schema.Types.ObjectId;
  status: "pending" | "completed";
}

const orderSchema = new Schema<IOrder>({
  table: {
    type: Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  items: [
    {
      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  subTotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
  },
  platformFee: {
    type: Number,
    required: true,
    default: 0,
  },
  otherCharges: {
    type: Number,
    required: true,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "pending"],
    default: "unpaid",
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
