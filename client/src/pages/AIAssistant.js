import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ user }) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [mealDays, setMealDays] = useState(7);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const endpoints = {
    recipes: '/ai/recipes',
    budget: '/ai/budget-tips',
    shopping: '/ai/smart-shopping',
    meals: '/ai/meal-plan'
  };

  const handleGetSuggestion = async (endpoint) => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const params = endpoint === endpoints.meals ? { days: mealDays } : {};
      const response = await axios.post(
        `${API_URL}${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      <h2>🤖 AI Assistant</h2>
      <p className="subtitle">Get smart suggestions powered by Mistral AI</p>

      {error && <div className="error-alert">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          🍳 Recipes
        </button>
        <button
          className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          💰 Budget Tips
        </button>
        <button
          className={`tab ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shopping')}
        >
          🛒 Smart Shopping
        </button>
        <button
          className={`tab ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          📅 Meal Planning
        </button>
      </div>

      <div className="ai-content">
        {activeTab === 'recipes' && (
          <div className="tab-content">
            <h3>Recipe Suggestions</h3>
            <p>Get recipe ideas based on items in your pantry</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion(endpoints.recipes)}
              disabled={loading}
            >
              {loading ? 'Getting suggestions...' : 'Get Recipe Ideas'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content">
            <h3>Budget Optimization Tips</h3>
            <p>Get money-saving tips based on your spending</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion(endpoints.budget)}
              disabled={loading}
            >
              {loading ? 'Getting tips...' : 'Get Budget Tips'}
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="tab-content">
            <h3>Smart Shopping Recommendations</h3>
            <p>Optimize your shopping based on pantry items and budget</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion(endpoints.shopping)}
              disabled={loading}
            >
              {loading ? 'Getting recommendations...' : 'Get Shopping Tips'}
            </button>
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="tab-content">
            <h3>Meal Planning</h3>
            <p>Plan your meals for the week using your pantry items</p>
            <div className="meal-days-selector">
              <label>Days to plan:</label>
              <select value={mealDays} onChange={(e) => setMealDays(parseInt(e.target.value))}>
                <option value={3}>3 Days</option>
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion(endpoints.meals)}
              disabled={loading}
            >
              {loading ? 'Creating meal plan...' : `Plan ${mealDays} Days`}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="result-container">
          <h4>Results:</h4>
          <div className="result-content">
            {typeof result === 'string' ? (
              <p>{result}</p>
            ) : (
              <>
                {result.suggestions && <p>{result.suggestions}</p>}
                {result.tips && <p>{result.tips}</p>}
                {result.recommendations && <p>{result.recommendations}</p>}
                {result.mealPlan && <p>{result.mealPlan}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
