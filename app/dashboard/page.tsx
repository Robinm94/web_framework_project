"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  AlertTriangle,
  Bell,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { IBudget } from "@/models/Budget";
import { IExpense } from "@/models/Expense";
import { IAlert } from "@/models/Alerts";
import { INotification } from "@/models/Notification";

interface Summary {
  totalBudget: number;
  totalExpense: number;
  remainingBudget: number;
  budgetCount: number;
  expenseCount: number;
  alertCount: number;
  triggeredAlertCount: number;
}

export default function Dashboard() {
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<Summary>({
    totalBudget: 0,
    totalExpense: 0,
    remainingBudget: 0,
    budgetCount: 0,
    expenseCount: 0,
    alertCount: 0,
    triggeredAlertCount: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          budgetResponse,
          expenseResponse,
          alertResponse,
          notificationResponse,
        ] = await Promise.all([
          fetch("/api/budgets"),
          fetch("/api/expenses"),
          fetch("/api/alerts"),
          fetch("/api/notifications"),
        ]);

        // Check for errors
        if (!budgetResponse.ok) throw new Error("Failed to fetch budgets");
        if (!expenseResponse.ok) throw new Error("Failed to fetch expenses");

        // Parse responses
        const budgetData = await budgetResponse.json();
        const expenseData = await expenseResponse.json();
        let alertData: IAlert[] = [];
        let notificationData: INotification[] = [];

        // Handle alerts and notifications if they're available
        if (alertResponse.ok) {
          alertData = await alertResponse.json();
        }

        if (notificationResponse.ok) {
          notificationData = await notificationResponse.json();
        }

        // Update state
        setBudgets(budgetData);
        setExpenses(expenseData);
        setAlerts(alertData);
        setNotifications(notificationData);

        // Calculate summary data
        const totalBudget = budgetData.reduce(
          (sum: number, budget: IBudget) => sum + budget.amount,
          0
        );
        const totalExpense = budgetData.reduce(
          (sum: number, budget: IBudget) => sum + budget.expenditure,
          0
        );
        const triggeredAlerts = alertData.filter(
          (alert) => alert.status === "TRIGGERED"
        );

        setSummary({
          totalBudget,
          totalExpense,
          remainingBudget: totalBudget - totalExpense,
          budgetCount: budgetData.length,
          expenseCount: expenseData.length,
          alertCount: alertData.length,
          triggeredAlertCount: triggeredAlerts.length,
        });

        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Group budgets by month and year
  const groupedBudgets = budgets.reduce((acc, budget) => {
    const key = `${budget.month}-${budget.year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(budget);
    return acc;
  }, {} as Record<string, IBudget[]>);

  // Get budget name by ID
  const getBudgetName = (budgetId: string): string => {
    const budget = budgets.find((b) => b._id === budgetId);
    return budget ? budget.name : "Unknown budget";
  };

  if (loading)
    return <div className="p-4 text-center">Loading dashboard data...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>

      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-black border rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-400 text-sm">Total Budget</p>
              <p className="text-2xl font-bold">
                ${summary.totalBudget.toFixed(2)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-black border rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-400 text-sm">Remaining Budget</p>
              <p className="text-2xl font-bold">
                ${summary.remainingBudget.toFixed(2)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <BarChart3 size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-black border rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold">
                ${summary.totalExpense.toFixed(2)}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <DollarSign size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-black border rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-400 text-sm">Alerts</p>
              <p className="text-2xl font-bold">
                {summary.triggeredAlertCount} / {summary.alertCount}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="lg:w-2/3 space-y-6">
          {/* Budgets by Month */}
          <div className="bg-black border rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Budgets by Month</h2>
              <Link
                href="/dashboard/budgets"
                className="text-blue-500 flex items-center hover:text-blue-700"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {Object.keys(groupedBudgets).length === 0 ? (
              <p className="text-stone-400">
                No budgets found.{" "}
                <Link href="/dashboard/budgets" className="text-blue-500">
                  Create your first budget
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {Object.keys(groupedBudgets)
                  .sort()
                  .map((key) => (
                    <div key={key} className="border-t pt-3">
                      <h3 className="text-lg font-medium mb-2">{key}</h3>
                      <div className="space-y-2">
                        {groupedBudgets[key].map((budget) => (
                          <div
                            key={budget._id}
                            className="flex justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{budget.name}</p>
                              <div className="text-sm text-stone-400 flex justify-between">
                                <span>Spent: ${budget.expenditure}</span>
                                <span>of ${budget.amount}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className={`h-2 rounded-full ${
                                    budget.expenditure > budget.amount
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      (budget.expenditure / budget.amount) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Expenses */}
          <div className="bg-black border rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <Link
                href="/dashboard/expenses"
                className="text-blue-500 flex items-center hover:text-blue-700"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {expenses.length === 0 ? (
              <p className="text-stone-400">
                No expenses found.{" "}
                <Link href="/dashboard/expenses" className="text-blue-500">
                  Add your first expense
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {expenses.slice(0, 5).map((expense) => (
                  <div
                    key={expense._id}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-xs text-stone-400">
                        {getBudgetName(expense.budgetid)}
                      </p>
                    </div>
                    <p className="text-red-500 font-medium">
                      ${expense.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:w-1/3 space-y-6">
          {/* Alerts */}
          <div className="bg-black border rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Active Alerts</h2>
              <Link
                href="/dashboard/alerts"
                className="text-blue-500 flex items-center hover:text-blue-700"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {alerts.length === 0 ? (
              <p className="text-stone-400">
                No alerts set.{" "}
                <Link href="/dashboard/alerts" className="text-blue-500">
                  Create your first alert
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {alerts
                  .filter((a) => a.status === "TRIGGERED")
                  .slice(0, 3)
                  .map((alert) => (
                    <div
                      key={alert._id}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start">
                        <AlertTriangle
                          size={18}
                          className="text-red-500 mr-2 mt-0.5"
                        />
                        <div>
                          <p className="font-medium">{alert.description}</p>
                          <p className="text-xs text-gray-600">
                            Target: ${alert.targetAmount} • Budget:{" "}
                            {getBudgetName(alert.budgetId)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                {alerts
                  .filter((a) => a.status !== "TRIGGERED")
                  .slice(0, 2)
                  .map((alert) => (
                    <div
                      key={alert._id}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start">
                        <AlertTriangle
                          size={18}
                          className="text-gray-400 mr-2 mt-0.5"
                        />
                        <div>
                          <p className="font-medium">{alert.description}</p>
                          <p className="text-xs text-gray-600">
                            Target: ${alert.targetAmount} • Budget:{" "}
                            {getBudgetName(alert.budgetId)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-black border rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Notifications</h2>
              <Link
                href="/dashboard/notifications"
                className="text-blue-500 flex items-center hover:text-blue-700"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {notifications.length === 0 ? (
              <p className="text-stone-400">No notifications.</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 4).map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-black border p-3 rounded-lg ${
                      notification.isRead
                        ? " border-gray-200"
                        : " border-blue-200"
                    }`}
                  >
                    <div className="flex items-start">
                      <Bell
                        size={18}
                        className={`${
                          notification.isRead
                            ? "text-gray-400"
                            : "text-blue-500"
                        } mr-2 mt-0.5`}
                      />
                      <div>
                        <p
                          className={`${
                            notification.isRead ? "" : "font-medium"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-stone-400">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
