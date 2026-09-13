import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShoppingList = ({ user }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [newListData, setNewListData] = useState({
    name: '',
    description: '',
    dueDate: '',
    store: ''
  });
  const [newItemData, setNewItemData] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    category: 'other',
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
    if (!newListData.name) {
      setError('Please enter a list name');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/shopping`, newListData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLists([...lists, response.data.data]);
      setNewListData({ name: '', description: '', dueDate: '', store: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create list');
    }
  };

  const handleAddItem = async (e, listId) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.quantity) {
      setError('Please fill in required fields');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/shopping/${listId}/items`,
        { ...newItemData, quantity: parseFloat(newItemData.quantity), estimatedPrice: parseFloat(newItemData.estimatedPrice) || 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(lists.map(list => list._id === listId ? response.data.data : list));
      setNewItemData({ name: '', quantity: '', unit: 'pieces', category: 'other', estimatedPrice: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleTogglePurchased = async (listId, itemId, currentStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/shopping/${listId}/items/${itemId}`,
        { purchased: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(lists.map(list => list._id === listId ? response.data.data : list));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await axios.delete(`${API_URL}/shopping/${listId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLists(lists.filter(list => list._id !== listId));
        setSelectedList(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete list');
      }
    }
  };

  return (
    <div className="shopping-list-container">
      <h2>📋 Shopping List</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="shopping-controls">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New List'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateList} className="create-list-form">
          <input
            type="text"
            placeholder="List name"
            value={newListData.name}
            onChange={(e) => setNewListData({...newListData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newListData.description}
            onChange={(e) => setNewListData({...newListData, description: e.target.value})}
          />
          <input
            type="date"
            value={newListData.dueDate}
            onChange={(e) => setNewListData({...newListData, dueDate: e.target.value})}
          />
          <input
            type="text"
            placeholder="Store name"
            value={newListData.store}
            onChange={(e) => setNewListData({...newListData, store: e.target.value})}
          />
          <button type="submit" className="btn-success">Create List</button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="lists-container">
          {lists.length === 0 ? (
            <div className="empty-state">No shopping lists yet</div>
          ) : (
            lists.map(list => (
              <div key={list._id} className="list-card">
                <div className="list-header">
                  <h3>{list.name}</h3>
                  <button
                    className="btn-delete-small"
                    onClick={() => handleDeleteList(list._id)}
                  >
                    ×
                  </button>
                </div>
                {list.description && <p className="list-description">{list.description}</p>}
                {list.store && <p className="list-store">Store: {list.store}</p>}

                <div className="list-items">
                  <h4>Items ({list.items?.length || 0})</h4>
                  {list.items && list.items.length > 0 ? (
                    <ul className="items-list">
                      {list.items.map((item, idx) => (
                        <li key={item._id} className={item.purchased ? 'purchased' : ''}>
                          <input
                            type="checkbox"
                            checked={item.purchased}
                            onChange={() => handleTogglePurchased(list._id, item._id, item.purchased)}
                          />
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">{item.quantity} {item.unit}</span>
                          {item.estimatedPrice && <span className="item-price">${item.estimatedPrice}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-items">No items in this list</p>
                  )}
                </div>

                {selectedList === list._id && (
                  <form onSubmit={(e) => handleAddItem(e, list._id)} className="add-item-form">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={newItemData.name}
                      onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newItemData.quantity}
                      onChange={(e) => setNewItemData({...newItemData, quantity: e.target.value})}
                      required
                    />
                    <select
                      value={newItemData.unit}
                      onChange={(e) => setNewItemData({...newItemData, unit: e.target.value})}
                    >
                      {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <input
                      type="number"
                      placeholder="Estimated price"
                      step="0.01"
                      value={newItemData.estimatedPrice}
                      onChange={(e) => setNewItemData({...newItemData, estimatedPrice: e.target.value})}
                    />
                    <button type="submit" className="btn-small">Add</button>
                    <button
                      type="button"
                      className="btn-small cancel"
                      onClick={() => setSelectedList(null)}
                    >
                      Cancel
                    </button>
                  </form>
                )}

                <button
                  className="btn-add-item"
                  onClick={() => setSelectedList(selectedList === list._id ? null : list._id)}
                >
                  {selectedList === list._id ? '✕ Close' : '+ Add Item'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
