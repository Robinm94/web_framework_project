import { NextResponse } from "next/server";
import connectToMongoDB from "@/lib/connectdb";
import Expense from "@/models/Expense";
import ExpenseManager from "@/lib/expensemanager";
import getAuthenticatedUserId from "@/lib/getauthenticateduserid";
import Budget from "@/models/Budget";

// Get all expenses for the authenticated user (READ)
export async function GET() {
  try {
    await connectToMongoDB();

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find budgets owned by this user first
    const userBudgets = await Budget.find({ userid: userId });
    const userBudgetIds = userBudgets.map((budget) => budget._id.toString());

    // Then find expenses associated with these budgets
    const expenses = await Expense.find({ budgetid: { $in: userBudgetIds } });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// Add a new expense (CREATE) using ExpenseManager service
export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { description, amount, budgetid } = await req.json();
    if (!description || !amount || !budgetid) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Use ExpenseManager to create the expense, update budget, and handle alerts
    const newExpense = await ExpenseManager.createExpense(
      { description, amount, budgetid },
      userId
    );

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error adding expense:", error);

    // Handle specific errors from ExpenseManager with appropriate status codes
    if (error instanceof Error) {
      if (error.message === "Budget not found") {
        return NextResponse.json(
          { error: "Budget not found" },
          { status: 404 }
        );
      } else if (error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    // Default error response
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 }
    );
  }
}
