import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  name: string;
  amount: number;
  month: string;
  year: number;
}

const BudgetSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
});

export default mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);
