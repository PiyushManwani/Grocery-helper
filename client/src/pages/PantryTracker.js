import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PantryTracker = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    category: 'vegetables',
    expiryDate: '',
    location: 'Pantry',
    notes: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other'];
  const units = ['kg', 'g', 'liter', 'ml', 'pieces', 'box', 'dozen'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/pantry`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        const response = await axios.put(`${API_URL}/pantry/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(items.map(item => item._id === editingId ? response.data.data : item));
        setEditingId(null);
      } else {
        const response = await axios.post(`${API_URL}/pantry`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems([...items, response.data.data]);
      }
      resetForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/pantry/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(items.filter(item => item._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      location: item.location,
      notes: item.notes
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      unit: 'pieces',
      category: 'vegetables',
      expiryDate: '',
      location: 'Pantry',
      notes: ''
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredItems = filterCategory === 'all' ? items : items.filter(item => item.category === filterCategory);

  return (
    <div className="pantry-container">
      <h2>📦 Pantry Tracker</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="pantry-controls">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="pantry-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Item name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <select name="unit" value={formData.unit} onChange={handleChange}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-row">
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
          />
          <button type="submit" className="btn-success">
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="items-grid">
          {filteredItems.length === 0 ? (
            <div className="empty-state">No items in pantry</div>
          ) : (
            filteredItems.map(item => (
              <div key={item._id} className="item-card">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <span className="category-badge">{item.category}</span>
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
                  <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PantryTracker;
