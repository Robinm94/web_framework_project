"use client";
import React, { useState, useEffect } from "react";
import { Check, CheckCircle } from "lucide-react";

interface Notification {
  _id: string;
  message: string;
  date: Date;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id] }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: "all" }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications(
        notifications.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You have no notifications
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border rounded-lg p-4 ${
                notification.isRead
                  ? "bg-gray-100"
                  : "bg-white border-indigo-300 shadow"
              }`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <p
                    className={`text-black ${
                      !notification.isRead ? "font-medium" : ""
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="ml-4 text-indigo-600 hover:text-indigo-800"
                    title="Mark as read"
                  >
                    <Check size={20} />
                  </button>
                )}
                {notification.isRead && (
                  <span className="ml-4 text-green-600">
                    <CheckCircle size={20} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
