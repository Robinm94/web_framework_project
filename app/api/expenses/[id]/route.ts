import { NextResponse } from "next/server";
import ExpenseManager from "@/lib/expensemanager";
import getAuthenticatedUserId from "@/lib/getauthenticateduserid";
import Expense from "@/models/Expense";
import Budget from "@/models/Budget";
import connectToMongoDB from "@/lib/connectdb";

// Get a single expense (READ)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongoDB();

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Check if the expense belongs to a budget owned by the user
    const budget = await Budget.findById(expense.budgetid);
    if (!budget || budget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this expense" },
        { status: 403 }
      );
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

// Update an expense (UPDATE)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const expenseData = await req.json();

    // Use ExpenseManager to update the expense, adjust budget, and handle alerts
    const updatedExpense = await ExpenseManager.updateExpense(
      id,
      expenseData,
      userId
    );

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);

    // Handle specific errors from ExpenseManager
    if (error instanceof Error) {
      if (
        error.message === "Expense not found" ||
        error.message === "Budget not found"
      ) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      } else if (error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    // Default error response
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// Delete an expense (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Use ExpenseManager to delete the expense, adjust budget, and handle alerts
    await ExpenseManager.deleteExpense(id, userId);

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);

    // Handle specific errors from ExpenseManager
    if (error instanceof Error) {
      if (
        error.message === "Expense not found" ||
        error.message === "Budget not found"
      ) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      } else if (error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    // Default error response
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
