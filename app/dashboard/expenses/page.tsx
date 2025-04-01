"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import { IExpense } from "@/models/Expense";
import { IBudget } from "@/models/Budget";
import { jsPDF } from "jspdf";
import Papa from "papaparse";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    budgetid: "",
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

        // Then fetch expenses
        const expenseResponse = await fetch("/api/expenses");
        if (!expenseResponse.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const expenseData = await expenseResponse.json();
        setExpenses(expenseData);
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
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newExpense.budgetid) {
      setError("Please select a budget");
      return;
    }

    try {
      if (editingId) {
        // Update existing expense
        const response = await fetch(`/api/expenses/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            description: newExpense.description,
            amount: Number(newExpense.amount),
            budgetid: newExpense.budgetid,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update expense");
        }

        const updatedExpense = await response.json();
        setExpenses(
          expenses.map((e) => (e._id === editingId ? updatedExpense : e))
        );
        setEditingId(null);
      } else {
        // Create new expense
        const response = await fetch("/api/expenses", {
          method: "POST",
          body: JSON.stringify({
            description: newExpense.description,
            amount: Number(newExpense.amount),
            budgetid: newExpense.budgetid,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add expense");
        }

        const addedExpense = await response.json();
        setExpenses([...expenses, addedExpense]);
      }

      // Reset form
      setNewExpense({ description: "", amount: "", budgetid: "" });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (expense: IExpense) => {
    setNewExpense({
      description: expense.description,
      amount: String(expense.amount),
      budgetid: expense.budgetid,
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete expense");
      }
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Helper function to get budget details by ID
  const getBudgetDetails = (
    budgetId: string
  ): { name: string; month: string; year: number } => {
    const budget = budgets.find((b) => b._id === budgetId);
    return budget
      ? { name: budget.name, month: budget.month, year: budget.year }
      : { name: "Unknown budget", month: "", year: 0 };
  };

  const exportCSV = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 10, 10);
    expenses.forEach((expense, index) => {
      doc.text(
        `${index + 1}. ${expense.description}: $${expense.amount}`,
        10,
        20 + index * 10
      );
    });
    doc.save("expenses.pdf");
  };

  // Group expenses by budget
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const budgetDetails = getBudgetDetails(expense.budgetid);
    const key = `${budgetDetails.name} (${budgetDetails.month} ${budgetDetails.year})`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(expense);
    return acc;
  }, {} as Record<string, IExpense[]>);

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col lg:flex-row lg:space-x-4">
      <div className="lg:w-1/2 overflow-y-auto h-screen mb-6 lg:mb-0">
        <h1 className="text-2xl font-bold mb-4">Expenses</h1>
        <h2 className="text-xl font-semibold mb-2">Existing Expenses</h2>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={exportCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Export as CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Export as PDF
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="text-center">Loading...</div>}
        {!loading &&
          error === "" &&
          (Object.keys(groupedExpenses).length === 0 ? (
            <p>No expenses found. Create your first expense!</p>
          ) : (
            <ul className="mb-4">
              {Object.keys(groupedExpenses).map((key) => (
                <li key={key} className="mb-4">
                  <h3 className="text-lg font-semibold">{key}</h3>
                  <ul>
                    {groupedExpenses[key].map((expense) => (
                      <li
                        key={expense._id}
                        className="border-b py-2 flex justify-between items-center"
                      >
                        <span>
                          {expense.description}: ${expense.amount}
                        </span>
                        <div>
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-blue-500 px-2"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
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

      <div className="lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-2">
          {editingId ? "Edit Expense" : "Create New Expense"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">
              Description:
              <input
                type="text"
                name="description"
                placeholder="e.g., Grocery shopping, Restaurant bill, Movie tickets"
                value={newExpense.description}
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
                placeholder="e.g., 45.99"
                value={newExpense.amount}
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
                name="budgetid"
                value={newExpense.budgetid}
                onChange={handleInputChange}
                required
                className="mt-1 block lg:text-lg text-slate-900 px-2 py-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a Budget</option>
                {budgets.map((budget) => (
                  <option key={budget._id} value={budget._id}>
                    {budget.name} - {budget.month} {budget.year} ($
                    {budget.amount} Budget)
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
