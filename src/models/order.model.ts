import { Document, Mongoose, Schema, model } from "mongoose";

interface IOrder extends Document {
  tableId: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  totalAmount: number;
  paymentStatus: "unpaid" | "paid" | "pending";
  restaurantId: string;
}

const orderSchema = new Schema<IOrder>({
  tableId: {
    type: Schema.Types.ObjectId,
    ref: "Table",
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
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
