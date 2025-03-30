import { NextResponse } from "next/server";
import connectToMongoDB from "@/lib/connectdb";
import Notification from "@/models/Notification";
import getAuthenticatedUserId from "@/lib/getauthenticateduserid";

// Get all notifications for the authenticated user (READ)
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

    // Find all notifications for this user, sorted by date (newest first)
    const notifications = await Notification.find({ userId })
      .sort({ date: -1 })
      .exec();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Mark notification(s) as read
export async function PUT(req: Request) {
  try {
    await connectToMongoDB();

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { notificationIds } = await req.json();

    // Check if we're updating one or multiple notifications
    if (Array.isArray(notificationIds)) {
      // Update multiple notifications
      await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          userId: userId, // Ensure we only update user's own notifications
        },
        { isRead: true }
      );
    } else if (notificationIds === "all") {
      // Mark all notifications as read
      await Notification.updateMany({ userId: userId }, { isRead: true });
    } else {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
