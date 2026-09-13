import { Budget } from '../models/index.js';

// Get budget for current month
const getBudget = async (req, res) => {
  try {
    const { month } = req.query;
    const currentMonth = month ? new Date(month) : new Date();
    currentMonth.setDate(1);

    let budget = await Budget.findOne({
      userId: req.userId,
      month: {
        $gte: currentMonth,
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    });

    if (!budget) {
      budget = new Budget({
        userId: req.userId,
        month: currentMonth,
        budgetLimit: 0,
        spent: 0,
        expenses: []
      });
      await budget.save();
    }

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budget',
      error: error.message
    });
  }
};

// Set budget limit
const setBudgetLimit = async (req, res) => {
  try {
    const { budgetLimit, month } = req.body;

    if (budgetLimit === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide budget limit'
      });
    }

    const currentMonth = month ? new Date(month) : new Date();
    currentMonth.setDate(1);

    let budget = await Budget.findOne({
      userId: req.userId,
      month: {
        $gte: currentMonth,
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    });

    if (!budget) {
      budget = new Budget({
        userId: req.userId,
        month: currentMonth,
        budgetLimit
      });
    } else {
      budget.budgetLimit = budgetLimit;
    }

    await budget.save();

    res.status(200).json({
      success: true,
      message: 'Budget limit set successfully',
      data: budget
    });
  } catch (error) {
    console.error('Set budget limit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set budget limit',
      error: error.message
    });
  }
};

// Add expense
const addExpense = async (req, res) => {
  try {
    const { amount, category, description, month } = req.body;

    if (!amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount and category'
      });
    }

    const currentMonth = month ? new Date(month) : new Date();
    currentMonth.setDate(1);

    let budget = await Budget.findOne({
      userId: req.userId,
      month: {
        $gte: currentMonth,
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    });

    if (!budget) {
      budget = new Budget({
        userId: req.userId,
        month: currentMonth,
        budgetLimit: 0
      });
    }

    budget.expenses.push({
      amount,
      category,
      description
    });

    budget.spent = budget.expenses.reduce((total, exp) => total + exp.amount, 0);
    await budget.save();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: budget
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add expense',
      error: error.message
    });
  }
};

// Get budget summary
const getBudgetSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const currentMonth = month ? new Date(month) : new Date();
    currentMonth.setDate(1);

    const budget = await Budget.findOne({
      userId: req.userId,
      month: {
        $gte: currentMonth,
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      }
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    const remaining = budget.budgetLimit - budget.spent;
    const percentageUsed = budget.budgetLimit > 0 ? (budget.spent / budget.budgetLimit) * 100 : 0;

    const categoryBreakdown = {};
    budget.expenses.forEach((expense) => {
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = 0;
      }
      categoryBreakdown[expense.category] += expense.amount;
    });

    res.status(200).json({
      success: true,
      data: {
        budgetLimit: budget.budgetLimit,
        spent: budget.spent,
        remaining,
        percentageUsed: percentageUsed.toFixed(2),
        categoryBreakdown,
        totalExpenses: budget.expenses.length
      }
    });
  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budget summary',
      error: error.message
    });
  }
};

export { getBudget, setBudgetLimit, addExpense, getBudgetSummary };
