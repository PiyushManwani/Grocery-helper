import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ user }) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [days, setDays] = useState(7);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const getRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/ai/recipes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.suggestions);
    } catch (err) {
      setResult(err.response?.data?.message || 'Failed to get recipes');
    } finally {
      setLoading(false);
    }
  };

  const getBudgetTips = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/ai/budget-tips`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.tips);
    } catch (err) {
      setResult(err.response?.data?.message || 'Failed to get budget tips');
    } finally {
      setLoading(false);
    }
  };

  const getSmartShopping = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/ai/smart-shopping`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.recommendations);
    } catch (err) {
      setResult(err.response?.data?.message || 'Failed to get shopping recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getMealPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/ai/meal-plan?days=${days}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data.data.mealPlan);
    } catch (err) {
      setResult(err.response?.data?.message || 'Failed to get meal plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <h2>✨ AI Assistant</h2>

      <div className="ai-tabs">
        <button
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('recipes');
            setResult('');
          }}
        >
          🍴 Recipes
        </button>
        <button
          className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('budget');
            setResult('');
          }}
        >
          💰 Budget Tips
        </button>
        <button
          className={`tab-btn ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('shopping');
            setResult('');
          }}
        >
          🛒 Smart Shopping
        </button>
        <button
          className={`tab-btn ${activeTab === 'meal' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('meal');
            setResult('');
          }}
        >
          📋 Meal Plan
        </button>
      </div>

      <div className="ai-content">
        {activeTab === 'recipes' && (
          <div className="ai-section">
            <h3>Recipe Suggestions Based on Your Pantry</h3>
            <p>Get personalized recipe suggestions from items in your pantry.</p>
            <button onClick={getRecipes} className="btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Get Recipes'}
            </button>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="ai-section">
            <h3>Smart Budget Tips</h3>
            <p>Get money-saving tips based on your spending patterns.</p>
            <button onClick={getBudgetTips} className="btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Get Tips'}
            </button>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="ai-section">
            <h3>Smart Shopping Recommendations</h3>
            <p>Get optimized shopping suggestions based on your pantry and budget.</p>
            <button onClick={getSmartShopping} className="btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </div>
        )}

        {activeTab === 'meal' && (
          <div className="ai-section">
            <h3>Weekly Meal Plan</h3>
            <p>Generate a meal plan based on your pantry items.</p>
            <div className="meal-controls">
              <label>
                Number of days:
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                />
              </label>
            </div>
            <button onClick={getMealPlan} className="btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Generate Meal Plan'}
            </button>
          </div>
        )}

        {result && (
          <div className="ai-result">
            <div className="result-content">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
