"use client";
import React, { useState } from "react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  month: string;
  year: number;
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      description: "Electricity Bill",
      amount: 150,
      month: "January",
      year: 2023,
    },
    {
      id: 2,
      description: "Water Bill",
      amount: 50,
      month: "January",
      year: 2023,
    },
  ]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    month: "",
    year: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = expenses.length ? expenses[expenses.length - 1].id + 1 : 1;
    setExpenses([
      ...expenses,
      {
        id: newId,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        month: newExpense.month,
        year: parseInt(newExpense.year),
      },
    ]);
    setNewExpense({ description: "", amount: "", month: "", year: "" });
  };

  const groupedExpenses = expenses.reduce((acc, expense) => {
    const key = `${expense.month}-${expense.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
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
                  <li key={expense.id} className="border-b py-2">
                    {expense.description}: ${expense.amount}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-2">Create New Expense</h2>
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
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
