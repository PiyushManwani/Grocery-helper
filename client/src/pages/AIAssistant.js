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

  const handleGetSuggestion = async (endpoint, params = {}) => {
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

  return (
    <div className="ai-container">
      <h2>🤖 AI Assistant</h2>

      <div className="ai-tabs">
        <button
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          🙋 Recipes
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
          🛍 Shopping
        </button>
        <button
          className={`tab-button ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          🙹 Meal Plan
        </button>
      </div>

      <div className="ai-content">
        {error && <div className="error-alert">{error}</div>}

        {activeTab === 'recipes' && (
          <div className="ai-section">
            <p className="section-desc">Get recipe suggestions based on your pantry items</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion('recipes')}
              disabled={loading}
            >
              {loading ? 'Loading...' : '🙋 Get Recipe Ideas'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="ai-section">
            <p className="section-desc">Get money-saving tips for your grocery budget</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion('budget-tips')}
              disabled={loading}
            >
              {loading ? 'Loading...' : '💰 Get Budget Tips'
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="ai-section">
            <p className="section-desc">Get smart shopping recommendations</p>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion('smart-shopping')}
              disabled={loading}
            >
              {loading ? 'Loading...' : '🛍 Get Smart Shopping Tips'
            </button>
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="ai-section">
            <label>
              <p>How many days to plan?</p>
              <select value={mealDays} onChange={(e) => setMealDays(e.target.value)}>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </label>
            <button
              className="btn-primary"
              onClick={() => handleGetSuggestion('meal-plan', { days: mealDays })}
              disabled={loading}
            >
              {loading ? 'Loading...' : '🙹 Generate Meal Plan'
            </button>
          </div>
        )}

        {result && (
          <div className="ai-result">
            <h3>AI Suggestions</h3>
            <div className="result-content">
              {typeof result.suggestions === 'string' ? (
                <p>{result.suggestions}</p>
              ) : typeof result.tips === 'string' ? (
                <p>{result.tips}</p>
              ) : typeof result.recommendations === 'string' ? (
                <p>{result.recommendations}</p>
              ) : typeof result.mealPlan === 'string' ? (
                <div className="meal-plan">{result.mealPlan}</div>
              ) : (
                <pre>{JSON.stringify(result, null, 2)}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
