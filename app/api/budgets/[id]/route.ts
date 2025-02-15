import { NextResponse } from "next/server";
import Budget from "@/models/Budget";
import connectDB from "@/lib/mongodb";

// Get a single budget (READ)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const budget = await Budget.findById(params.id);
    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

// Update a budget (UPDATE)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { name, amount, month, year } = await req.json();

    const updatedBudget = await Budget.findByIdAndUpdate(
      params.id,
      { name, amount, month, year },
      { new: true }
    );

    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBudget);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}

// Delete a budget (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedBudget = await Budget.findByIdAndDelete(params.id);

    if (!deletedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
