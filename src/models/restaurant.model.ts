import { Document, Schema, model } from "mongoose";

interface IRestaurant extends Document {
  name: string;
  address: string;
  email: string;
  phone: string;
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
});

const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;
