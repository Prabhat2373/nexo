import { Document, Mongoose, Schema, model } from "mongoose";

interface IOrder extends Document {
  table: Schema.Types.ObjectId;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
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
