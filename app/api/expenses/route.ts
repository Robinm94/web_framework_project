import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";

// Get all expenses (READ)
export async function GET() {
  try {
    await connectDB();
    const expenses = await Expense.find();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// Add a new expense (CREATE)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { description, amount, month, year } = await req.json();

    if (!description || !amount || !month || !year) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newExpense = new Expense({ description, amount, month, year });
    await newExpense.save();
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error adding expenses:", error);
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 }
    );
  }
}
