import { NextResponse } from "next/server";
import Budget from "@/models/Budget";
import connectDB from "@/lib/mongodb";

// Get all budgets (READ)
export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find();
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { message: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

// Add a new budget (CREATE)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, amount, month, year } = await req.json();

    if (!name || !amount || !month || !year) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newBudget = new Budget({ name, amount, month, year });
    await newBudget.save();
    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("Error adding budgets:", error);
    return NextResponse.json(
      { error: "Failed to add budget" },
      { status: 500 }
    );
  }
}
