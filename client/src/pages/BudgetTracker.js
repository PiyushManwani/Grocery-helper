import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetTracker = ({ user }) => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: 'other',
    description: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other'];

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/budget`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudget(response.data.data);
      setBudgetLimit(response.data.data.budgetLimit);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch budget');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!budgetLimit) {
      setError('Please enter a budget limit');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/budget/set-limit`,
        { budgetLimit: parseFloat(budgetLimit) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudget(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set budget');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseData.amount) {
      setError('Please enter an amount');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/budget/add-expense`,
        { ...expenseData, amount: parseFloat(expenseData.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudget(response.data.data);
      setExpenseData({ amount: '', category: 'other', description: '' });
      setShowExpenseForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const percentageUsed = budget ? (budget.spent / budget.budgetLimit * 100).toFixed(2) : 0;

  return (
    <div className="budget-container">
      <h2>💰 Budget Tracker</h2>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : budget ? (
        <>
          <div className="budget-header">
            <div className="budget-set-form">
              <form onSubmit={handleSetBudget}>
                <input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="Set monthly budget"
                  step="0.01"
                />
                <button type="submit" className="btn-primary">Set Budget</button>
              </form>
            </div>
          </div>

          <div className="budget-summary">
            <div className="summary-card">
              <h3>Budget Limit</h3>
              <p className="amount">${budget.budgetLimit.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h3>Spent</h3>
              <p className="amount spent">${budget.spent.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <h3>Remaining</h3>
              <p className="amount remaining">${(budget.budgetLimit - budget.spent).toFixed(2)}</p>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(percentageUsed, 100)}%`,
                  backgroundColor: percentageUsed > 100 ? '#e74c3c' : percentageUsed > 75 ? '#f39c12' : '#27ae60'
                }}
              />
            </div>
            <p className="progress-text">{percentageUsed}% of budget used</p>
          </div>

          <div className="expenses-section">
            <div className="expenses-header">
              <h3>Recent Expenses</h3>
              <button
                className="btn-primary"
                onClick={() => setShowExpenseForm(!showExpenseForm)}
              >
                {showExpenseForm ? '✕ Cancel' : '+ Add Expense'}
              </button>
            </div>

            {showExpenseForm && (
              <form onSubmit={handleAddExpense} className="expense-form">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                  required
                />
                <select
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({...expenseData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                />
                <button type="submit" className="btn-success">Add Expense</button>
              </form>
            )}

            <div className="expenses-list">
              {budget.expenses && budget.expenses.length > 0 ? (
                budget.expenses.slice(-5).reverse().map((expense, idx) => (
                  <div key={idx} className="expense-item">
                    <div className="expense-info">
                      <p className="expense-category">{expense.category}</p>
                      {expense.description && <p className="expense-desc">{expense.description}</p>}
                    </div>
                    <p className="expense-amount">${expense.amount.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="no-expenses">No expenses recorded yet</p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BudgetTracker;
