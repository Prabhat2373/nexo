import mongoose, { Document, Schema } from "mongoose";

export interface IInvoice extends Document {
  orderId: string;
  customerId: string;
  restaurantId: string;
  amount: number;
  status: "paid" | "unpaid";
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: string;
}

const InvoiceSchema: Schema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    paymentMethod: {
      type: String,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
export default Invoice;
