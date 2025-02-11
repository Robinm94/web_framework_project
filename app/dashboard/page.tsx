"use client";
import React, { useState } from "react";

interface Budget {
  id: number;
  name: string;
  amount: number;
  month: string;
  year: number;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  month: string;
  year: number;
}

export default function HomePage() {
  const [budgets] = useState<Budget[]>([
    { id: 1, name: "Groceries", amount: 200, month: "January", year: 2023 },
    { id: 2, name: "Rent", amount: 1000, month: "January", year: 2023 },
  ]);

  const [expenses] = useState<Expense[]>([
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
    {
      id: 3,
      description: "Water Bill",
      amount: 50,
      month: "February",
      year: 2023,
    },
  ]);

  const groupedData = budgets.reduce((acc, budget) => {
    const key = `${budget.month}-${budget.year}`;
    if (!acc[key]) {
      acc[key] = { budgets: [], expenses: [], totalBudget: 0, totalExpense: 0 };
    }
    acc[key].budgets.push(budget);
    acc[key].totalBudget += budget.amount;
    return acc;
  }, {} as Record<string, { budgets: Budget[]; expenses: Expense[]; totalBudget: number; totalExpense: number }>);

  expenses.forEach((expense) => {
    const key = `${expense.month}-${expense.year}`;
    if (!groupedData[key]) {
      groupedData[key] = {
        budgets: [],
        expenses: [],
        totalBudget: 0,
        totalExpense: 0,
      };
    }
    groupedData[key].expenses.push(expense);
    groupedData[key].totalExpense += expense.amount;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      {Object.keys(groupedData).map((key) => {
        const { budgets, expenses, totalBudget, totalExpense } =
          groupedData[key];
        const remainingBudget = totalBudget - totalExpense;
        return (
          <div key={key} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{key}</h2>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <h3 className="text-lg font-semibold">Budgets</h3>
                <ul className="mb-4">
                  {budgets.map((budget) => (
                    <li key={budget.id} className="border-b py-2">
                      {budget.name}: ${budget.amount}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-1/2">
                <h3 className="text-lg font-semibold">Expenses</h3>
                <ul className="mb-4">
                  {expenses.map((expense) => (
                    <li key={expense.id} className="border-b py-2">
                      {expense.description}: ${expense.amount}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-lg font-semibold">
              Remaining Budget: $ {remainingBudget}
            </div>
          </div>
        );
      })}
    </div>
  );
}
