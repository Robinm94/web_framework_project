"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";

interface Expense {
  _id: string;
  description: string;
  amount: number;
  month: string;
  year: number;
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    month: "",
    year: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExpenses() {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      setExpenses(data);
    }
    fetchExpenses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update existing expense
      const response = await fetch(`/api/expenses/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(newExpense),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const updatedExpense = await response.json();
        setExpenses(
          expenses.map((e) => (e._id === editingId ? updatedExpense : e))
        );
        setEditingId(null);
      }
    } else {
      // Create new expense
      const response = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(newExpense),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const addedExpense = await response.json();
        setExpenses([...expenses, addedExpense]);
      }
    }
    setNewExpense({ description: "", amount: "", month: "", year: "" });
  };

  const handleEdit = (expense: Expense) => {
    setNewExpense({
      description: expense.description,
      amount: String(expense.amount),
      month: expense.month,
      year: String(expense.year),
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (response.ok) {
      setExpenses(expenses.filter((e) => e._id !== id));
    }
  };

  const groupedExpenses = expenses.reduce((acc, expense) => {
    const key = `${expense.month}-${expense.year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="p-4 max-w-4xl mx-auto flex space-x-4">
      <div className="w-1/2 overflow-y-auto h-screen">
        <h1 className="text-2xl font-bold mb-4">Expenses</h1>
        <h2 className="text-xl font-semibold mb-2">Existing Expenses</h2>
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
      </div>

      <div className="w-1/2">
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
                value={newExpense.amount}
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
                value={newExpense.month}
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
                value={newExpense.year}
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
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
