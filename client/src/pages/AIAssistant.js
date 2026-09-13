import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ user }) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [mealPlanDays, setMealPlanDays] = useState(7);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const handleGetRecipes = async () => {
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
      setError(err.response?.data?.message || 'Failed to get recipe suggestions');
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
      setError(err.response?.data?.message || 'Failed to get smart shopping recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGetMealPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        `${API_URL}/ai/meal-plan?days=${mealPlanDays}`,
        {},
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
      <h2>✨ AI Assistant</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="ai-tabs">
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
          🛍️ Smart Shopping
        </button>
        <button
          className={`tab ${activeTab === 'mealplan' ? 'active' : ''}`}
          onClick={() => setActiveTab('mealplan')}
        >
          📅 Meal Plan
        </button>
      </div>

      <div className="ai-content">
        {activeTab === 'recipes' && (
          <div className="tab-content">
            <h3>Recipe Suggestions</h3>
            <p>Get recipe ideas based on your pantry items</p>
            <button
              className="btn-primary"
              onClick={handleGetRecipes}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get Recipes'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content">
            <h3>Budget Money-Saving Tips</h3>
            <p>Get practical tips to reduce your grocery spending</p>
            <button
              className="btn-primary"
              onClick={handleGetBudgetTips}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get Tips'}
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="tab-content">
            <h3>Smart Shopping Recommendations</h3>
            <p>Get smart suggestions based on your pantry and budget</p>
            <button
              className="btn-primary"
              onClick={handleGetSmartShopping}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get Recommendations'}
            </button>
          </div>
        )}

        {activeTab === 'mealplan' && (
          <div className="tab-content">
            <h3>Meal Planning</h3>
            <p>Generate a meal plan based on your pantry items</p>
            <div className="meal-plan-input">
              <label>
                Days to plan:
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={mealPlanDays}
                  onChange={(e) => setMealPlanDays(parseInt(e.target.value))}
                />
              </label>
            </div>
            <button
              className="btn-primary"
              onClick={handleGetMealPlan}
              disabled={loading}
            >
              {loading ? 'Generating...' : `Get ${mealPlanDays}-Day Plan`}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="ai-result">
          <h4>AI Response:</h4>
          <div className="result-content">
            <p>{result}</p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => setResult('')}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
