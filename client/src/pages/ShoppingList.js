import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShoppingList = ({ user }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    store: '',
    dueDate: ''
  });
  const [itemForm, setItemForm] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    category: 'vegetables',
    estimatedPrice: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other'];
  const units = ['kg', 'g', 'liter', 'ml', 'pieces', 'box', 'dozen'];

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/shopping`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLists(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Please enter a list name');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/shopping`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLists([...lists, response.data.data]);
      setFormData({ name: '', description: '', store: '', dueDate: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create list');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedList || !itemForm.name || !itemForm.quantity) {
      setError('Please fill in required fields');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/shopping/${selectedList._id}/items`,
        { ...itemForm, quantity: parseFloat(itemForm.quantity), estimatedPrice: parseFloat(itemForm.estimatedPrice) || 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
      setLists(lists.map(l => l._id === selectedList._id ? response.data.data : l));
      setItemForm({ name: '', quantity: '', unit: 'pieces', category: 'vegetables', estimatedPrice: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleTogglePurchased = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}/shopping/${selectedList._id}/items/${item._id}`,
        { purchased: !item.purchased },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
      setLists(lists.map(l => l._id === selectedList._id ? response.data.data : l));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteList = async (id) => {
    if (window.confirm('Delete this shopping list?')) {
      try {
        await axios.delete(`${API_URL}/shopping/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLists(lists.filter(l => l._id !== id));
        setSelectedList(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete list');
      }
    }
  };

  return (
    <div className="shopping-container">
      <h2>🛍 Shopping List</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="shopping-layout">
        <div className="lists-panel">
          <div className="panel-header">
            <h3>My Lists</h3>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕' : '+'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreateList} className="create-list-form">
              <input
                type="text"
                placeholder="List name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <input
                type="text"
                placeholder="Store"
                value={formData.store}
                onChange={(e) => setFormData({...formData, store: e.target.value})}
              />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
              <button type="submit" className="btn-success">Create List</button>
            </form>
          )}

          <div className="lists-list">
            {lists.map(list => (
              <div
                key={list._id}
                className={`list-item ${selectedList?._id === list._id ? 'active' : ''}`}
                onClick={() => setSelectedList(list)}
              >
                <div className="list-item-info">
                  <h4>{list.name}</h4>
                  <p>{list.items?.length || 0} items</p>
                </div>
                <button
                  className="btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list._id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="list-detail">
          {selectedList ? (
            <>
              <div className="detail-header">
                <h3>{selectedList.name}</h3>
                {selectedList.store && <p className="store-info">🏪 {selectedList.store}</p>}
                {selectedList.dueDate && <p className="date-info">📅 {new Date(selectedList.dueDate).toLocaleDateString()}</p>}
              </div>

              <div className="add-item-form">
                <form onSubmit={handleAddItem}>
                  <input
                    type="text"
                    placeholder="Item name"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({...itemForm, quantity: e.target.value})}
                    required
                  />
                  <select value={itemForm.unit} onChange={(e) => setItemForm({...itemForm, unit: e.target.value})}>
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Est. Price"
                    value={itemForm.estimatedPrice}
                    onChange={(e) => setItemForm({...itemForm, estimatedPrice: e.target.value})}
                  />
                  <button type="submit" className="btn-success">Add Item</button>
                </form>
              </div>

              <div className="items-list">
                <h4>Items ({selectedList.items?.length || 0})</h4>
                {selectedList.items && selectedList.items.length > 0 ? (
                  selectedList.items.map((item) => (
                    <div key={item._id} className={`shopping-item ${item.purchased ? 'purchased' : ''}`}>
                      <input
                        type="checkbox"
                        checked={item.purchased || false}
                        onChange={() => handleTogglePurchased(item)}
                      />
                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-meta">{item.quantity} {item.unit} - {item.category}</p>
                        {item.estimatedPrice && <p className="item-price">${item.estimatedPrice.toFixed(2)}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No items in this list</p>
                )}
              </div>

              {selectedList.items && selectedList.items.length > 0 && (
                <div className="list-summary">
                  <p>Est. Total: ${(selectedList.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0)).toFixed(2)}</p>
                  <p>Purchased: {selectedList.items.filter(i => i.purchased).length}/{selectedList.items.length}</p>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">Select a list to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
