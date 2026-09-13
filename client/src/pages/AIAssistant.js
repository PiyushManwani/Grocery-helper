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

  const handleRequest = async (endpoint) => {
    try {
      setLoading(true);
      setError('');
      setResult('');

      const url = activeTab === 'mealplan'
        ? `${API_URL}/ai/${endpoint}?days=${mealDays}`
        : `${API_URL}/ai/${endpoint}`;

      const response = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipes = () => handleRequest('recipes');
  const handleBudgetTips = () => handleRequest('budget-tips');
  const handleSmartShopping = () => handleRequest('smart-shopping');
  const handleMealPlan = () => handleRequest('meal-plan');

  return (
    <div className="ai-container">
      <h2>🤖 AI Assistant</h2>
      <p className="ai-subtitle">Get personalized suggestions powered by Mistral AI</p>

      {error && <div className="error-alert">{error}</div>}

      <div className="ai-tabs">
        <button
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          🍳 Recipes
        </button>
        <button
          className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          💰 Budget Tips
        </button>
        <button
          className={`tab-button ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shopping')}
        >
          🛒 Smart Shopping
        </button>
        <button
          className={`tab-button ${activeTab === 'mealplan' ? 'active' : ''}`}
          onClick={() => setActiveTab('mealplan')}
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
              onClick={handleRecipes}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get Recipe Suggestions'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content">
            <h3>Budget Tips</h3>
            <p>Get money-saving tips based on your spending</p>
            <button
              className="btn-primary"
              onClick={handleBudgetTips}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get Budget Tips'}
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="tab-content">
            <h3>Smart Shopping Recommendations</h3>
            <p>Optimize your shopping list with AI-powered suggestions</p>
            <button
              className="btn-primary"
              onClick={handleSmartShopping}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get Smart Shopping Ideas'}
            </button>
          </div>
        )}

        {activeTab === 'mealplan' && (
          <div className="tab-content">
            <h3>Meal Planning</h3>
            <p>Create a meal plan using your pantry items</p>
            <div className="input-group">
              <label htmlFor="mealDays">Number of days:</label>
              <input
                type="number"
                id="mealDays"
                min="1"
                max="30"
                value={mealDays}
                onChange={(e) => setMealDays(parseInt(e.target.value))}
              />
            </div>
            <button
              className="btn-primary"
              onClick={handleMealPlan}
              disabled={loading}
            >
              {loading ? 'Generating...' : `Create ${mealDays}-Day Meal Plan`}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="ai-result">
          <h3>AI Suggestions</h3>
          <div className="result-content">
            {typeof result === 'string' ? (
              <p>{result}</p>
            ) : (
              <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {loading && <div className="loading-spinner">Generating suggestions...</div>}
    </div>
  );
};

export default AIAssistant;
