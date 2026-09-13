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
    if (!item) return;

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

  const handleDeleteList = async (listId) => {
    if (window.confirm('Delete this shopping list?')) {
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

  return (
    <div className="shopping-container">
      <h2>🛍 Shopping List</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="shopping-layout">
        <div className="lists-panel">
          <div className="lists-header">
            <h3>My Lists</h3>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕' : '+'} New
            </button>
          </div>

          {showForm && (
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
                placeholder="Store"
                value={newListData.store}
                onChange={(e) => setNewListData({...newListData, store: e.target.value})}
              />
              <button type="submit" className="btn-success">Create</button>
            </form>
          )}

          <div className="lists-list">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : lists.length === 0 ? (
              <p className="no-lists">No shopping lists yet</p>
            ) : (
              lists.map(list => (
                <div
                  key={list._id}
                  className={`list-item ${selectedList?._id === list._id ? 'active' : ''}`}
                  onClick={() => setSelectedList(list)}
                >
                  <div className="list-info">
                    <h4>{list.name}</h4>
                    <p>{list.items.length} items</p>
                  </div>
                  <button
                    className="btn-delete-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list._id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="list-details">
          {selectedList ? (
            <>
              <div className="details-header">
                <h3>{selectedList.name}</h3>
                <span className="status-badge">{selectedList.status}</span>
              </div>

              {selectedList.description && <p className="list-description">{selectedList.description}</p>}

              <div className="list-stats">
                <span>🟂 Total: ${selectedList.totalEstimatedCost.toFixed(2)}</span>
                <span>✅ {selectedList.items.filter(i => i.purchased).length}/{selectedList.items.length}</span>
              </div>

              <form onSubmit={handleAddItem} className="add-item-form">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newItemData.quantity}
                  onChange={(e) => setNewItemData({...newItemData, quantity: e.target.value})}
                  required
                  step="0.1"
                />
                <select
                  value={newItemData.unit}
                  onChange={(e) => setNewItemData({...newItemData, unit: e.target.value})}
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={newItemData.estimatedPrice}
                  onChange={(e) => setNewItemData({...newItemData, estimatedPrice: e.target.value})}
                  step="0.01"
                />
                <button type="submit" className="btn-success">Add</button>
              </form>

              <div className="items-list">
                {selectedList.items.length === 0 ? (
                  <p className="no-items">No items in this list</p>
                ) : (
                  selectedList.items.map(item => (
                    <div
                      key={item._id}
                      className={`item-row ${item.purchased ? 'purchased' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => handleTogglePurchased(item._id)}
                      />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-meta">{item.quantity} {item.unit} - ${item.estimatedPrice || 0}</p>
                      </div>
                      <button
                        className="btn-delete-small"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        ×
                      </button>
                    </div>
                  ))
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
