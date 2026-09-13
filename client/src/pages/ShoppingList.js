import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShoppingList = ({ user }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListData, setNewListData] = useState({ name: '', description: '', store: '' });
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemData, setItemData] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    category: 'vegetables',
    estimatedPrice: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const units = ['kg', 'g', 'liter', 'ml', 'pieces', 'box', 'dozen'];
  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other'];

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
      setNewListData({ name: '', description: '', store: '' });
      setShowCreateForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create list');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedList || !itemData.name || !itemData.quantity) {
      setError('Please fill in required fields');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/shopping/${selectedList._id}/items`,
        { ...itemData, quantity: parseFloat(itemData.quantity), estimatedPrice: parseFloat(itemData.estimatedPrice || 0) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
      setItemData({ name: '', quantity: '', unit: 'pieces', category: 'vegetables', estimatedPrice: '' });
      setShowItemForm(false);
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
        { ...item, purchased: !item.purchased },
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
      <h2>🛍 Shopping List</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="shopping-layout">
        <div className="lists-sidebar">
          <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? '✕ Cancel' : '+ New List'}
          </button>

          {showCreateForm && (
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
                type="text"
                placeholder="Store"
                value={newListData.store}
                onChange={(e) => setNewListData({...newListData, store: e.target.value})}
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
            ))}
          </div>
        </div>

        <div className="list-content">
          {selectedList ? (
            <>
              <div className="list-header">
                <h3>{selectedList.name}</h3>
                {selectedList.store && <p>Store: {selectedList.store}</p>}
                {selectedList.description && <p>{selectedList.description}</p>}
              </div>

              <div className="list-summary">
                <div className="summary-item">
                  <strong>Total Items:</strong> {selectedList.items.length}
                </div>
                <div className="summary-item">
                  <strong>Purchased:</strong> {selectedList.items.filter(i => i.purchased).length}
                </div>
                <div className="summary-item">
                  <strong>Estimated Total:</strong> ${selectedList.totalEstimatedCost?.toFixed(2) || '0.00'}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => setShowItemForm(!showItemForm)}
              >
                {showItemForm ? '✕ Cancel' : '+ Add Item'}
              </button>

              {showItemForm && (
                <form onSubmit={handleAddItem} className="item-form">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={itemData.name}
                    onChange={(e) => setItemData({...itemData, name: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={itemData.quantity}
                    onChange={(e) => setItemData({...itemData, quantity: e.target.value})}
                    required
                  />
                  <select value={itemData.unit} onChange={(e) => setItemData({...itemData, unit: e.target.value})}>
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <select value={itemData.category} onChange={(e) => setItemData({...itemData, category: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="Estimated price"
                    value={itemData.estimatedPrice}
                    onChange={(e) => setItemData({...itemData, estimatedPrice: e.target.value})}
                    step="0.01"
                  />
                  <button type="submit" className="btn-success">Add Item</button>
                </form>
              )}

              <div className="items-list">
                {selectedList.items.map(item => (
                  <div key={item._id} className={`shopping-item ${item.purchased ? 'purchased' : ''}`}>
                    <input
                      type="checkbox"
                      checked={item.purchased}
                      onChange={() => handleTogglePurchased(item._id)}
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-details">
                        {item.quantity} {item.unit} • {item.category}
                        {item.estimatedPrice && ` • $${item.estimatedPrice.toFixed(2)}`}
                      </p>
                    </div>
                    <button
                      className="btn-delete-small"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">Select or create a shopping list</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
