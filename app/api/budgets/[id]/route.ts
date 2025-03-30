import { NextResponse } from "next/server";
import Budget, { IBudget } from "@/models/Budget";
import connectToMongoDB from "@/lib/connectdb";
import getAuthenticatedUserId from "@/lib/getauthenticateduserid";

// Get a single budget (READ)
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
    const budget = await Budget.findById(id);

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Check if the budget belongs to the authenticated user
    if (budget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this budget" },
        { status: 403 }
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}

// Update a budget (UPDATE)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
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

    const { name, amount, month, year } = await req.json();
    const { id } = params;

    // First check if the budget exists and belongs to the user
    const existingBudget = await Budget.findById(id);

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    if (existingBudget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this budget" },
        { status: 403 }
      );
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { name, amount, month, year },
      { new: true }
    );

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

// Delete a budget (DELETE)
export async function DELETE(
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

    // First check if the budget exists and belongs to the user
    const existingBudget = await Budget.findById(id);

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    if (existingBudget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this budget" },
        { status: 403 }
      );
    }

    const deletedBudget: IBudget | null = await Budget.findByIdAndDelete(id);
    if (!deletedBudget) {
      return NextResponse.json(
        { error: "Failed to delete budget" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: `Budget - ${deletedBudget.name} with amount - ${deletedBudget.amount} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
