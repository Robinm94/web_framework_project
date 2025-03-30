import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  _id: string;
  description: string;
  amount: number;
  budgetid: string;
}

const ExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  budgetid: { type: String, required: true },
});

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
