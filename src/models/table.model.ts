import { Document, Schema, model } from "mongoose";

interface ITable extends Document {
  number: number;
  qrCode: string;
  restaurantId: string;
  state: "free" | "in_use";
}

const tableSchema = new Schema<ITable>({
  number: {
    type: Number,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ["free", "in_use"],
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

const Table = model<ITable>("Table", tableSchema);

export default Table;
