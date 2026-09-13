import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ user }) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [mealDays, setMealDays] = useState('7');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const handleGetSuggestions = async (endpoint) => {
    try {
      setLoading(true);
      setError('');
      setResult('');

      let url = `${API_URL}/ai/${endpoint}`;
      if (endpoint === 'meal-plan') {
        url += `?days=${mealDays}`;
      }

      const response = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.data.suggestions || response.data.data.tips || response.data.data.recommendations || response.data.data.mealPlan) {
        setResult(response.data.data.suggestions || response.data.data.tips || response.data.data.recommendations || response.data.data.mealPlan);
      } else {
        setResult(JSON.stringify(response.data.data, null, 2));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <h2>✨ AI Assistant</h2>

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
          🛍️ Smart Shopping
        </button>
        <button
          className={`tab-button ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          📅 Meal Planning
        </button>
      </div>

      <div className="ai-content">
        {error && <div className="error-alert">{error}</div>}

        {activeTab === 'recipes' && (
          <div className="ai-section">
            <h3>Recipe Suggestions</h3>
            <p>Get recipe suggestions based on items in your pantry</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestions('recipes')}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Recipes'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="ai-section">
            <h3>Budget Tips</h3>
            <p>Get personalized money-saving tips for grocery shopping</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestions('budget-tips')}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Tips'}
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="ai-section">
            <h3>Smart Shopping Recommendations</h3>
            <p>Get smart recommendations for your next shopping trip</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestions('smart-shopping')}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="ai-section">
            <h3>Meal Planning</h3>
            <p>Create a meal plan based on your pantry items</p>
            <div className="meal-days-selector">
              <label>Days for meal plan:</label>
              <select value={mealDays} onChange={(e) => setMealDays(e.target.value)}>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestions('meal-plan')}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Generate Meal Plan'}
            </button>
          </div>
        )}

        {result && (
          <div className="ai-result">
            <h4>Result:</h4>
            <div className="result-content">
              {typeof result === 'string' ? (
                <pre>{result}</pre>
              ) : (
                JSON.stringify(result, null, 2)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
