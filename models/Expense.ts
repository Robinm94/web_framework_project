import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  description: string;
  amount: number;
  month: string;
  year: number;
}

const ExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
});

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
