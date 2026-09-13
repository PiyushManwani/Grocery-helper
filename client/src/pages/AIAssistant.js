import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recipes');
  const [result, setResult] = useState('');
  const [mealPlanDays, setMealPlanDays] = useState(7);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const handleGetSuggestions = async (endpoint, params = {}) => {
    try {
      setLoading(true);
      setError('');
      setResult('');

      const response = await axios.post(
        `${API_URL}/ai/${endpoint}`,
        params,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (typeof result === 'string') {
      return <p className="result-text">{result}</p>;
    }

    return (
      <div className="result-content">
        {result.suggestions && (
          <div className="result-section">
            <h4>Suggestions:</h4>
            <p>{result.suggestions}</p>
          </div>
        )}
        {result.tips && (
          <div className="result-section">
            <h4>Tips:</h4>
            <p>{result.tips}</p>
          </div>
        )}
        {result.recommendations && (
          <div className="result-section">
            <h4>Recommendations:</h4>
            <p>{result.recommendations}</p>
          </div>
        )}
        {result.mealPlan && (
          <div className="result-section">
            <h4>Meal Plan:</h4>
            <p>{result.mealPlan}</p>
          </div>
        )}
        {result.budgetStatus && (
          <div className="result-section">
            <h4>Budget Status:</h4>
            <p>Spent: ${result.budgetStatus.spent.toFixed(2)} / ${result.budgetStatus.limit.toFixed(2)} ({result.budgetStatus.percentageUsed}%)</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ai-assistant-container">
      <h2>🤖 AI Assistant</h2>
      <p className="ai-description">Get personalized suggestions powered by Mistral AI</p>

      {error && <div className="error-alert">{error}</div>}

      <div className="ai-tabs">
        <button
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => { setActiveTab('recipes'); setResult(''); }}
        >
          🍳 Recipes
        </button>
        <button
          className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => { setActiveTab('budget'); setResult(''); }}
        >
          💰 Budget Tips
        </button>
        <button
          className={`tab-button ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => { setActiveTab('shopping'); setResult(''); }}
        >
          🛒 Smart Shopping
        </button>
        <button
          className={`tab-button ${activeTab === 'meal' ? 'active' : ''}`}
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
              className="btn-primary btn-large"
              onClick={() => handleGetSuggestions('recipes')}
              disabled={loading}
            >
              {loading ? '⏳ Getting suggestions...' : '🎯 Get Recipes'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content">
            <h3>Money-Saving Tips</h3>
            <p>Get personalized budget tips based on your spending</p>
            <button
              className="btn-primary btn-large"
              onClick={() => handleGetSuggestions('budget-tips')}
              disabled={loading}
            >
              {loading ? '⏳ Getting tips...' : '💡 Get Budget Tips'}
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="tab-content">
            <h3>Smart Shopping Recommendations</h3>
            <p>Get suggestions for optimized shopping</p>
            <button
              className="btn-primary btn-large"
              onClick={() => handleGetSuggestions('smart-shopping')}
              disabled={loading}
            >
              {loading ? '⏳ Getting recommendations...' : '🎯 Get Recommendations'}
            </button>
          </div>
        )}

        {activeTab === 'meal' && (
          <div className="tab-content">
            <h3>Meal Plan Generator</h3>
            <p>Generate a meal plan for your pantry items</p>
            <div className="meal-plan-control">
              <label>
                Days to plan:
                <select value={mealPlanDays} onChange={(e) => setMealPlanDays(parseInt(e.target.value))}>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                </select>
              </label>
            </div>
            <button
              className="btn-primary btn-large"
              onClick={() => handleGetSuggestions('meal-plan', { days: mealPlanDays })}
              disabled={loading}
            >
              {loading ? '⏳ Generating meal plan...' : '📋 Generate Meal Plan'}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="ai-result">
          <h3>AI Suggestion</h3>
          {renderResult()}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
