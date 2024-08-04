import { Document, Schema, model } from "mongoose";

interface IRestaurant extends Document {
  name: string;
  address: string;
  email: string;
  phone: string;
  menuItems: Schema.Types.ObjectId;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  menuItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      // default: [],
    },
  ],
});

const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;
