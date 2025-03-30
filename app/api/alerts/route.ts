import { NextResponse } from "next/server";
import Alert from "@/models/Alerts";
import Budget from "@/models/Budget";
import getAuthenticatedUserId from "@/lib/getauthenticateduserid";
import connectToMongoDB from "@/lib/connectdb";

// Get all alerts for the authenticated user (READ)
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

    // First get all budgets owned by this user
    const userBudgets = await Budget.find({ userid: userId });
    const userBudgetIds = userBudgets.map((budget) => budget._id.toString());

    // Then find all alerts associated with these budgets
    const alerts = await Alert.find({ budgetId: { $in: userBudgetIds } });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

// Create a new alert (CREATE)
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

    const { description, targetAmount, budgetId } = await req.json();

    if (!description || targetAmount === undefined || !budgetId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Verify budget exists and belongs to user
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    if (budget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to create alert for this budget" },
        { status: 403 }
      );
    }

    // Create the alert
    const newAlert = new Alert({
      description,
      targetAmount,
      budgetId,
      status: "ACTIVE",
    });

    await newAlert.save();

    // Check if the alert should be triggered immediately
    if (budget.expenditure >= targetAmount) {
      newAlert.status = "TRIGGERED";
      await newAlert.save();

      // You could also create a notification here if needed
    }

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error("Error creating alert:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}
