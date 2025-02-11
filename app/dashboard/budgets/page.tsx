"use client";
import React, { useState } from "react";

interface Budget {
  id: number;
  name: string;
  amount: number;
  month: string;
  year: number;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 1, name: "Groceries", amount: 200, month: "January", year: 2023 },
    { id: 2, name: "Rent", amount: 1000, month: "January", year: 2023 },
  ]);
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    month: "",
    year: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = budgets.length ? budgets[budgets.length - 1].id + 1 : 1;
    setBudgets([
      ...budgets,
      {
        id: newId,
        name: newBudget.name,
        amount: parseFloat(newBudget.amount),
        month: newBudget.month,
        year: parseInt(newBudget.year),
      },
    ]);
    setNewBudget({ name: "", amount: "", month: "", year: "" });
  };

  const groupedBudgets = budgets.reduce((acc, budget) => {
    const key = `${budget.month}-${budget.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(budget);
    return acc;
  }, {} as Record<string, Budget[]>);

  return (
    <div className="p-4 max-w-4xl mx-auto flex space-x-4">
      <div className="w-1/2 overflow-y-auto h-screen">
        <h1 className="text-2xl font-bold mb-4">Budget</h1>
        <h2 className="text-xl font-semibold mb-2">Existing Budgets</h2>
        <ul className="mb-4">
          {Object.keys(groupedBudgets).map((key) => (
            <li key={key} className="mb-4">
              <h3 className="text-lg font-semibold">{key}</h3>
              <ul>
                {groupedBudgets[key].map((budget) => (
                  <li key={budget.id} className="border-b py-2">
                    {budget.name}: ${budget.amount}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-2">Create New Budget</h2>
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
            Add Budget
          </button>
        </form>
      </div>
    </div>
  );
}
