"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import { IBudget } from "@/models/Budget";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    month: "",
    year: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBudgets() {
      try {
        setLoading(true);
        const response = await fetch("/api/budgets");

        if (!response.ok) {
          throw new Error("Failed to fetch budgets");
        }

        const data = await response.json();
        setBudgets(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching budgets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBudgets();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update existing budget
      const response = await fetch(`/api/budgets/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(newBudget),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const updatedBudget = await response.json();
        setBudgets(
          budgets.map((b) => (b._id === editingId ? updatedBudget : b))
        );
        setEditingId(null);
      }
    } else {
      // Create new budget
      const response = await fetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify(newBudget),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const addedBudget = await response.json();
        setBudgets([...budgets, addedBudget]);
      }
    }
    setNewBudget({ name: "", amount: "", month: "", year: "" });
  };

  const handleEdit = (budget: IBudget) => {
    setNewBudget({
      name: budget.name,
      amount: String(budget.amount),
      month: budget.month,
      year: String(budget.year),
    });
    setEditingId(budget._id);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (response.ok) {
      setBudgets(budgets.filter((b) => b._id !== id));
    }
  };

  const groupedBudgets = budgets
    ? budgets.reduce((acc, budget) => {
        const key = `${budget.month}-${budget.year}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(budget);
        return acc;
      }, {} as Record<string, IBudget[]>)
    : {};

  return (
    <div className="p-4 max-w-4xl mx-auto flex space-x-4">
      <div className="w-1/2 overflow-y-auto h-screen">
        <h1 className="text-2xl font-bold mb-4">Budget</h1>
        <h2 className="text-xl font-semibold mb-2">Existing Budgets</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="text-center">Loading...</div>}
        {!loading &&
          error === "" &&
          (Object.keys(groupedBudgets).length === 0 ? (
            <p>No budgets found. Create your first budget!</p>
          ) : (
            <ul className="mb-4">
              {Object.keys(groupedBudgets).map((key) => (
                <li key={key} className="mb-4">
                  <h3 className="text-lg font-semibold">{key}</h3>
                  <ul>
                    {groupedBudgets[key].map((budget) => (
                      <li
                        key={budget._id}
                        className="border-b py-2 flex justify-between items-center"
                      >
                        <span>
                          {budget.name}: ${budget.amount}
                        </span>
                        <div>
                          <button
                            onClick={() => handleEdit(budget)}
                            className="text-blue-500 px-2"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(budget._id)}
                            className="text-red-500 px-2"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ))}
      </div>

      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-2">
          {editingId ? "Edit Budget" : "Create New Budget"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              Name:
              <input
                type="text"
                name="name"
                value={newBudget.name}
                onChange={handleInputChange}
                required
                className="mt-1 block lg:text-lg text-slate-900 px-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">
              Amount:
              <input
                type="number"
                name="amount"
                value={newBudget.amount}
                onChange={handleInputChange}
                required
                className="mt-1 block lg:text-lg text-slate-900 px-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium">
              Month:
              <select
                name="month"
                value={newBudget.month}
                onChange={handleInputChange}
                required
                className="mt-1 block lg:text-lg text-slate-900 px-2 py-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="block font-medium">
              Year:
              <input
                type="number"
                name="year"
                value={newBudget.year}
                onChange={handleInputChange}
                required
                className="mt-1 block lg:text-lg text-slate-900 px-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingId ? "Update Budget" : "Add Budget"}
          </button>
        </form>
      </div>
    </div>
  );
}
