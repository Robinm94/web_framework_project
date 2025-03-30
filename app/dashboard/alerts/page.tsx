"use client";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Alert {
  _id: string;
  description: string;
  targetAmount: number;
  budgetId: string;
  status: string;
}

interface Budget {
  _id: string;
  name: string;
  amount: number;
  expenditure: number;
  month: string;
  year: number;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newAlert, setNewAlert] = useState({
    description: "",
    targetAmount: "",
    budgetId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch budgets first
        const budgetResponse = await fetch("/api/budgets");
        if (!budgetResponse.ok) {
          throw new Error("Failed to fetch budgets");
        }
        const budgetData = await budgetResponse.json();
        setBudgets(budgetData);

        // Then fetch alerts
        const alertResponse = await fetch("/api/alerts");
        if (!alertResponse.ok) {
          throw new Error("Failed to fetch alerts");
        }
        const alertData = await alertResponse.json();
        setAlerts(alertData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewAlert({ ...newAlert, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAlert.budgetId) {
      setError("Please select a budget");
      return;
    }

    try {
      if (editingId) {
        // Update existing alert
        const response = await fetch(`/api/alerts/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            description: newAlert.description,
            targetAmount: Number(newAlert.targetAmount),
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update alert");
        }

        const updatedAlert = await response.json();
        setAlerts(alerts.map((a) => (a._id === editingId ? updatedAlert : a)));
        setEditingId(null);
      } else {
        // Create new alert
        const response = await fetch("/api/alerts", {
          method: "POST",
          body: JSON.stringify({
            description: newAlert.description,
            targetAmount: Number(newAlert.targetAmount),
            budgetId: newAlert.budgetId,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add alert");
        }

        const addedAlert = await response.json();
        setAlerts([...alerts, addedAlert]);
      }

      // Reset form
      setNewAlert({ description: "", targetAmount: "", budgetId: "" });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (alert: Alert) => {
    setNewAlert({
      description: alert.description,
      targetAmount: String(alert.targetAmount),
      budgetId: alert.budgetId,
    });
    setEditingId(alert._id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/alerts/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete alert");
      }
      setAlerts(alerts.filter((a) => a._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Helper function to get budget details by ID
  const getBudgetDetails = (
    budgetId: string
  ): { name: string; amount: number; expenditure: number } => {
    const budget = budgets.find((b) => b._id === budgetId);
    return budget
      ? {
          name: budget.name,
          amount: budget.amount,
          expenditure: budget.expenditure,
        }
      : { name: "Unknown budget", amount: 0, expenditure: 0 };
  };

  // Group alerts by budget
  const groupedAlerts = alerts.reduce((acc, alert) => {
    const budgetDetails = getBudgetDetails(alert.budgetId);
    const key = budgetDetails.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(alert);
    return acc;
  }, {} as Record<string, Alert[]>);

  // Get status color and icon
  const getStatusDisplay = (
    status: string,
    targetAmount: number,
    budgetId: string
  ) => {
    const budgetDetails = getBudgetDetails(budgetId);
    const isTriggered = budgetDetails.expenditure >= targetAmount;

    if (status === "TRIGGERED" || isTriggered) {
      return {
        color: "text-red-500",
        bgColor: "bg-red-100",
        icon: <AlertCircle size={16} className="text-red-500" />,
        text: "Triggered",
      };
    } else {
      return {
        color: "text-green-500",
        bgColor: "bg-white-100",
        icon: <CheckCircle2 size={16} className="text-green-500" />,
        text: "Active",
      };
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col lg:flex-row lg:space-x-4">
      <div className="lg:w-1/2 overflow-y-auto h-screen mb-6 lg:mb-0">
        <h1 className="text-2xl font-bold mb-4">Budget Alerts</h1>
        <h2 className="text-xl font-semibold mb-2">Current Alerts</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="text-center">Loading...</div>}
        {!loading &&
          error === "" &&
          (Object.keys(groupedAlerts).length === 0 ? (
            <p>No alerts found. Create your first alert!</p>
          ) : (
            <ul className="mb-4 space-y-6">
              {Object.keys(groupedAlerts).map((budgetName) => (
                <li key={budgetName} className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <AlertTriangle size={18} className="mr-2 text-yellow-500" />
                    {budgetName}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {groupedAlerts[budgetName].map((alert) => {
                      const status = getStatusDisplay(
                        alert.status,
                        alert.targetAmount,
                        alert.budgetId
                      );
                      const budgetDetails = getBudgetDetails(alert.budgetId);
                      const percentage = Math.round(
                        (alert.targetAmount / budgetDetails.amount) * 100
                      );

                      return (
                        <li
                          key={alert._id}
                          className={`border rounded-md p-3 ${status.bgColor}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {alert.description}
                              </div>
                              <div className="text-sm">
                                Target: ${alert.targetAmount} ({percentage}% of
                                budget)
                              </div>
                              <div className="flex items-center mt-1">
                                {status.icon}
                                <span
                                  className={`text-xs ml-1 ${status.color}`}
                                >
                                  {status.text}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(alert)}
                                className="text-blue-500 p-1 hover:bg-blue-100 rounded-full"
                                title="Edit Alert"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(alert._id)}
                                className="text-red-500 p-1 hover:bg-red-100 rounded-full"
                                title="Delete Alert"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          ))}
      </div>

      <div className="lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-2">
          {editingId ? "Edit Alert" : "Create New Alert"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              Description:
              <input
                type="text"
                name="description"
                placeholder="e.g., Alert me when I reach 80% of my food budget"
                value={newAlert.description}
                onChange={handleInputChange}
                required
                className="mt-1 block lg:text-lg text-slate-900 px-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">
              Target Amount ($):
              <input
                type="number"
                name="targetAmount"
                placeholder="Amount that triggers the alert"
                value={newAlert.targetAmount}
                onChange={handleInputChange}
                required
                className="mt-1 block lg:text-lg text-slate-900 px-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">
              Budget:
              <select
                name="budgetId"
                value={newAlert.budgetId}
                onChange={handleInputChange}
                required
                disabled={editingId !== null}
                className={`mt-1 block lg:text-lg text-slate-900 px-2 py-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  editingId ? "bg-gray-100" : ""
                }`}
              >
                <option value="">Select a Budget</option>
                {budgets.map((budget) => (
                  <option key={budget._id} value={budget._id}>
                    {budget.name} - {budget.month} {budget.year} ($
                    {budget.expenditure}/${budget.amount})
                  </option>
                ))}
              </select>
              {editingId && (
                <p className="text-xs text-gray-500 mt-1">
                  Budget cannot be changed when editing
                </p>
              )}
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingId ? "Update Alert" : "Create Alert"}
          </button>
        </form>
      </div>
    </div>
  );
}
