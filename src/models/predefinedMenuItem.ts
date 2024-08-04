import { Schema, model, Document } from "mongoose";

interface IPredefinedMenuItem extends Document {
  name: string;
  description?: string;
}

const predefinedMenuItemSchema = new Schema<IPredefinedMenuItem>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const PredefinedMenuItem = model<IPredefinedMenuItem>(
  "PredefinedMenuItem",
  predefinedMenuItemSchema
);

export default PredefinedMenuItem;
