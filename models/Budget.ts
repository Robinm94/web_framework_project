import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  _id: string;
  name: string;
  amount: number;
  expenditure: number;
  month: string;
  year: number;
  userid: string;
}

const BudgetSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  expenditure: { type: Number, default: 0 },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  userid: { type: String, required: true },
});

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
