import { NextResponse } from "next/server";
import Budget from "@/models/Budget";
import connectToMongoDB from "@/lib/connectdb";
import getAuthenticatedUserId from "@/lib/getauthenticateduserid";

// Get all budgets for the authenticated user (READ)
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

    // Filter budgets by user ID
    console.log("User ID:", userId);
    const budgets = await Budget.find({ userid: userId });
    console.log("Budgets:", budgets);
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
    await connectToMongoDB();

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { name, amount, month, year } = await req.json();

    if (!name || !amount || !month || !year) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Include the user ID when creating the budget
    const newBudget = new Budget({
      name,
      amount,
      month,
      year,
      userid: userId,
    });

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
