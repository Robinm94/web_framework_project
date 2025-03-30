import { NextResponse } from "next/server";
import Alert from "@/models/Alerts";
import Budget from "@/models/Budget";
import connectToMongoDB from "@/lib/connectdb";
import getAuthenticatedUserId from "@/lib/getauthenticateduserid";

// Get a single alert (READ)
export async function GET({ params }: { params: Promise<{ id: string }> }) {
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
    const alert = await Alert.findById(id);

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    // Verify the alert belongs to a budget owned by the user
    const budget = await Budget.findById(alert.budgetId);
    if (!budget || budget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this alert" },
        { status: 403 }
      );
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Error fetching alert:", error);
    return NextResponse.json(
      { error: "Failed to fetch alert" },
      { status: 500 }
    );
  }
}

// Update an alert (UPDATE)
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

    const { id } = params;
    const { description, targetAmount, status } = await req.json();

    // Find the alert
    const alert = await Alert.findById(id);
    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    // Verify the alert belongs to a budget owned by the user
    const budget = await Budget.findById(alert.budgetId);
    if (!budget || budget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this alert" },
        { status: 403 }
      );
    }

    // Update the alert
    if (description !== undefined) alert.description = description;
    if (targetAmount !== undefined) alert.targetAmount = targetAmount;
    if (status !== undefined) alert.status = status;

    await alert.save();

    // Check if the alert should be triggered based on current expenditure
    if (budget.expenditure >= alert.targetAmount && alert.status === "ACTIVE") {
      alert.status = "TRIGGERED";
      await alert.save();

      // You could also create a notification here if needed
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Error updating alert:", error);
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 500 }
    );
  }
}

// Delete an alert (DELETE)
export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
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
    const alert = await Alert.findById(id);

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    // Verify the alert belongs to a budget owned by the user
    const budget = await Budget.findById(alert.budgetId);
    if (!budget || budget.userid !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this alert" },
        { status: 403 }
      );
    }

    await Alert.findByIdAndDelete(id);
    return NextResponse.json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}
