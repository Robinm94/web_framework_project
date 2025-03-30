import Expense, { IExpense } from "@/models/Expense";
import Budget from "@/models/Budget";
import Alert from "@/models/Alerts";
import Notification from "@/models/Notification";
import connectToMongoDB from "@/lib/connectdb";

/**
 * Service for managing expenses and related operations
 */
export const ExpenseManager = {
  /**
   * Create a new expense and update the associated budget
   */
  async createExpense(
    expenseData: Partial<IExpense>,
    userId: string
  ): Promise<IExpense> {
    await connectToMongoDB();

    // First, verify the budget exists and belongs to the user
    const budget = await Budget.findById(expenseData.budgetid);
    if (!budget) {
      throw new Error("Budget not found");
    }

    if (budget.userid !== userId) {
      throw new Error("Unauthorized: Budget does not belong to this user");
    }

    // Create the expense
    const newExpense = new Expense(expenseData);
    await newExpense.save();

    // Update the budget's expenditure
    const updatedExpenditure = budget.expenditure + expenseData.amount;
    budget.expenditure = updatedExpenditure;
    await budget.save();

    // Check and process alerts
    await this.checkAlertsAndNotify(
      budget._id.toString(),
      updatedExpenditure,
      userId
    );

    return newExpense;
  },

  /**
   * Update an existing expense and adjust the associated budget
   */
  async updateExpense(
    expenseId: string,
    expenseData: Partial<IExpense>,
    userId: string
  ): Promise<IExpense | null> {
    await connectToMongoDB();

    // Find the existing expense
    const existingExpense = await Expense.findById(expenseId);
    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    // Verify budget ownership
    const budget = await Budget.findById(existingExpense.budgetid);
    if (!budget) {
      throw new Error("Budget not found");
    }

    if (budget.userid !== userId) {
      throw new Error("Unauthorized: Budget does not belong to this user");
    }

    // Calculate the difference in amount if amount is changing
    let amountDifference = 0;
    if (expenseData.amount !== undefined) {
      amountDifference = expenseData.amount - existingExpense.amount;
    }

    // Update the expense
    Object.assign(existingExpense, expenseData);
    await existingExpense.save();

    // Update the budget expenditure if amount changed
    if (amountDifference !== 0) {
      const updatedExpenditure = budget.expenditure + amountDifference;
      budget.expenditure = updatedExpenditure;
      await budget.save();

      // Check and process alerts
      await this.checkAlertsAndNotify(
        budget._id.toString(),
        updatedExpenditure,
        userId
      );
    }

    return existingExpense;
  },

  /**
   * Delete an expense and adjust the associated budget
   */
  async deleteExpense(expenseId: string, userId: string): Promise<boolean> {
    await connectToMongoDB();

    // Find the existing expense
    const existingExpense = await Expense.findById(expenseId);
    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    // Verify budget ownership
    const budget = await Budget.findById(existingExpense.budgetid);
    if (!budget) {
      throw new Error("Budget not found");
    }

    if (budget.userid !== userId) {
      throw new Error("Unauthorized: Budget does not belong to this user");
    }

    // Update the budget's expenditure (subtract the expense amount)
    const updatedExpenditure = budget.expenditure - existingExpense.amount;
    budget.expenditure = updatedExpenditure;
    await budget.save();

    // Delete the expense
    await Expense.findByIdAndDelete(expenseId);

    await this.checkAlertsAndNotify(
      budget._id.toString(),
      updatedExpenditure,
      userId
    );
    return true;
  },

  /**
   * Check if any alerts are triggered and create notifications if needed
   */
  async checkAlertsAndNotify(
    budgetId: string,
    expenditure: number,
    userId: string
  ): Promise<void> {
    // Find all alerts associated with this budget
    const alerts = await Alert.find({ budgetId });

    // Get the budget for notification messages
    const budget = await Budget.findById(budgetId);
    if (!budget) return;

    for (const alert of alerts) {
      if (expenditure >= alert.targetAmount && alert.status !== "TRIGGERED") {
        // Update alert status
        alert.status = "TRIGGERED";
        await alert.save();

        // Create notification
        const notification = new Notification({
          message: `Alert: ${alert.description} - Budget "${
            budget.name
          }" has reached ${expenditure} of ${budget.amount} (${Math.round(
            (expenditure / budget.amount) * 100
          )}%)`,
          date: new Date(),
          userId: userId,
          isRead: false,
        });

        await notification.save();
      } else if (
        expenditure < alert.targetAmount &&
        alert.status === "TRIGGERED"
      ) {
        alert.status = "ACTIVE";
        await alert.save();
      }
    }
    if (expenditure > budget.amount) {
      const notification = new Notification({
        message: `Budget "${budget.name}" has exceeded the budget amount of ${budget.amount} with an expenditure of ${expenditure}`,
        date: new Date(),
        userId: userId,
        isRead: false,
      });
      await notification.save();
    }
  },
};

export default ExpenseManager;
