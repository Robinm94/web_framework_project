import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  _id: string;
  description: string;
  targetAmount: number;
  budgetId: string;
  status: string;
}

const AlertSchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    budgetId: { type: String, required: true },
    status: { type: String, default: "ACTIVE" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Check if the model exists before creating a new one (prevents overwriting during hot reloads)
export default mongoose.models.Alert ||
  mongoose.model<IAlert>("Alert", AlertSchema);
