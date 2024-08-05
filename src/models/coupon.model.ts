import { Document, Schema, model } from "mongoose";

interface ICoupon extends Document {
  code: string;
  percentage: number;
  validFrom: Date;
  validTo: Date;
  restaurantId: Schema.Types.ObjectId;
}

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

const Coupon = model<ICoupon>("Coupon", couponSchema);

export default Coupon;
