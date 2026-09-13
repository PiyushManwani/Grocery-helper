import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PantryTracker.css';

const PantryTracker = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    category: 'other',
    expiryDate: '',
    location: 'Pantry',
    notes: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all'
        ? `${API_URL}/pantry`
        : `${API_URL}/pantry/category/${selectedCategory}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItems(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${API_URL}/pantry/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/pantry`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({
        name: '',
        quantity: '',
        unit: 'pieces',
        category: 'other',
        expiryDate: '',
        location: 'Pantry',
        notes: ''
      });
      fetchItems();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/pantry/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchItems();
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const categories = ['all', 'vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other'];

  return (
    <div className="pantry-container">
      <h2>📦 Pantry Tracker</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="pantry-content">
        <form onSubmit={handleSubmit} className="pantry-form">
          <h3>Add/Edit Item</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Tomatoes"
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Amount"
                required
              />
            </div>
            <div className="form-group">
              <label>Unit *</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="pieces">Pieces</option>
                <option value="kg">Kg</option>
                <option value="g">Grams</option>
                <option value="liter">Liter</option>
                <option value="ml">ML</option>
                <option value="box">Box</option>
                <option value="dozen">Dozen</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="grains">Grains</option>
                <option value="spices">Spices</option>
                <option value="snacks">Snacks</option>
                <option value="beverages">Beverages</option>
                <option value="frozen">Frozen</option>
                <option value="canned">Canned</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Pantry, Fridge"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              rows="3"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
          </button>
        </form>

        <div className="pantry-items">
          <h3>Items in Pantry ({items.length})</h3>

          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="empty-state">No items found. Add your first item!</div>
          ) : (
            <div className="items-grid">
              {items.map(item => (
                <div key={item._id} className="item-card">
                  <div className="item-header">
                    <h4>{item.name}</h4>
                    <span className="category-tag">{item.category}</span>
                  </div>
                  <div className="item-details">
                    <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    {item.expiryDate && (
                      <p><strong>Expires:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
                    )}
                    {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
                  </div>
                  <div className="item-actions">
                    <button className="btn-secondary" onClick={() => setEditingId(item._id)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PantryTracker;
