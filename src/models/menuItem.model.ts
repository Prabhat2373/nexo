import { Document, Schema, model } from "mongoose";

interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  restaurant: Schema.Types.ObjectId;
  isCustom: boolean;
}

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

const MenuItem = model<IMenuItem>("MenuItem", menuItemSchema);

export default MenuItem;
