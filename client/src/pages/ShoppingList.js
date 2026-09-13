import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShoppingList = ({ user }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [showNewListForm, setShowNewListForm] = useState(false);
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
    fetchShoppingLists();
  }, []);

  const fetchShoppingLists = async () => {
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
      setShowNewListForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create list');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedList || !newItemData.name || !newItemData.quantity) {
      setError('Please fill in required fields');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/shopping/${selectedList._id}/items`,
        {
          ...newItemData,
          quantity: parseFloat(newItemData.quantity),
          estimatedPrice: newItemData.estimatedPrice ? parseFloat(newItemData.estimatedPrice) : 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
      setNewItemData({ name: '', quantity: '', unit: 'pieces', category: 'other', estimatedPrice: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleTogglePurchased = async (itemId) => {
    if (!selectedList) return;

    const item = selectedList.items.find(i => i._id === itemId);
    try {
      const response = await axios.put(
        `${API_URL}/shopping/${selectedList._id}/items/${itemId}`,
        { purchased: !item.purchased },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!selectedList) return;

    try {
      const response = await axios.delete(
        `${API_URL}/shopping/${selectedList._id}/items/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await axios.delete(`${API_URL}/shopping/${listId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLists(lists.filter(l => l._id !== listId));
        if (selectedList?._id === listId) setSelectedList(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete list');
      }
    }
  };

  return (
    <div className="shopping-container">
      <h2>🛒 Shopping Lists</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="shopping-layout">
        <div className="lists-panel">
          <div className="lists-header">
            <h3>Your Lists</h3>
            <button
              className="btn-primary"
              onClick={() => setShowNewListForm(!showNewListForm)}
            >
              {showNewListForm ? '✕ Cancel' : '+ New List'}
            </button>
          </div>

          {showNewListForm && (
            <form onSubmit={handleCreateList} className="new-list-form">
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

          <div className="lists-list">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : lists.length === 0 ? (
              <div className="empty-state">No shopping lists yet</div>
            ) : (
              lists.map(list => (
                <div
                  key={list._id}
                  className={`list-item ${selectedList?._id === list._id ? 'active' : ''}`}
                  onClick={() => setSelectedList(list)}
                >
                  <h4>{list.name}</h4>
                  <p>{list.items.length} items</p>
                  <button
                    className="btn-delete-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="list-details">
          {selectedList ? (
            <>
              <div className="list-header">
                <h3>{selectedList.name}</h3>
                <div className="list-meta">
                  {selectedList.store && <span>📍 {selectedList.store}</span>}
                  {selectedList.dueDate && <span>📅 {new Date(selectedList.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="add-item-form">
                <h4>Add Item</h4>
                <form onSubmit={handleAddItem}>
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
                  <select
                    value={newItemData.category}
                    onChange={(e) => setNewItemData({...newItemData, category: e.target.value})}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="Estimated price"
                    step="0.01"
                    value={newItemData.estimatedPrice}
                    onChange={(e) => setNewItemData({...newItemData, estimatedPrice: e.target.value})}
                  />
                  <button type="submit" className="btn-success">Add Item</button>
                </form>
              </div>

              <div className="items-list">
                <h4>Items ({selectedList.items.length})</h4>
                {selectedList.items.length === 0 ? (
                  <div className="empty-state">No items in this list</div>
                ) : (
                  <ul>
                    {selectedList.items.map(item => (
                      <li key={item._id} className={`item ${item.purchased ? 'purchased' : ''}`}>
                        <input
                          type="checkbox"
                          checked={item.purchased}
                          onChange={() => handleTogglePurchased(item._id)}
                        />
                        <span className="item-info">
                          <strong>{item.name}</strong> - {item.quantity} {item.unit}
                          {item.estimatedPrice && ` ($${item.estimatedPrice})`}
                        </span>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">Select a list to view items</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
