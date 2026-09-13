import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ user }) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [mealDays, setMealDays] = useState('7');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const handleGetRecipeSuggestions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        `${API_URL}/ai/recipes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.suggestions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleGetBudgetTips = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        `${API_URL}/ai/budget-tips`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.tips);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get budget tips');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSmartShopping = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        `${API_URL}/ai/smart-shopping`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.recommendations);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get shopping recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGetMealPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        `${API_URL}/ai/meal-plan`,
        { days: mealDays },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.mealPlan);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get meal plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <h2>🤖 AI Assistant</h2>
      <p className="subtitle">Get smart suggestions powered by AI</p>

      {error && <div className="error-alert">{error}</div>}

      <div className="ai-tabs">
        <button
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => { setActiveTab('recipes'); setResult(''); }}
        >
          🍳 Recipes
        </button>
        <button
          className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => { setActiveTab('budget'); setResult(''); }}
        >
          💰 Budget Tips
        </button>
        <button
          className={`tab-btn ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => { setActiveTab('shopping'); setResult(''); }}
        >
          🛍️ Smart Shopping
        </button>
        <button
          className={`tab-btn ${activeTab === 'meal' ? 'active' : ''}`}
          onClick={() => { setActiveTab('meal'); setResult(''); }}
        >
          📅 Meal Plan
        </button>
      </div>

      <div className="ai-content">
        {activeTab === 'recipes' && (
          <div className="tab-content">
            <h3>Recipe Suggestions</h3>
            <p>Get recipe ideas based on items in your pantry</p>
            <button
              className="btn-primary"
              onClick={handleGetRecipeSuggestions}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Recipes'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content">
            <h3>Budget Optimization Tips</h3>
            <p>Get practical money-saving tips for your grocery shopping</p>
            <button
              className="btn-primary"
              onClick={handleGetBudgetTips}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Budget Tips'}
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="tab-content">
            <h3>Smart Shopping Recommendations</h3>
            <p>Get personalized shopping recommendations based on your pantry and budget</p>
            <button
              className="btn-primary"
              onClick={handleGetSmartShopping}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </div>
        )}

        {activeTab === 'meal' && (
          <div className="tab-content">
            <h3>Weekly Meal Planning</h3>
            <p>Get a complete meal plan based on your pantry items</p>
            <div className="meal-control">
              <label>Plan for how many days?</label>
              <select value={mealDays} onChange={(e) => setMealDays(e.target.value)}>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={handleGetMealPlan}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Generate Meal Plan'}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="ai-result">
          <h3>Result</h3>
          <div className="result-content">
            {typeof result === 'string' ? (
              <p>{result}</p>
            ) : (
              <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
