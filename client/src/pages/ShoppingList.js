import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShoppingList = ({ user }) => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListData, setNewListData] = useState({
    name: '',
    description: '',
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
      setError(err.response?.data?.message || 'Failed to fetch shopping lists');
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
        { ...newItemData, estimatedPrice: parseFloat(newItemData.estimatedPrice) || 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
      setLists(lists.map(l => l._id === selectedList._id ? response.data.data : l));
      setNewItemData({ name: '', quantity: '', unit: 'pieces', category: 'other', estimatedPrice: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleTogglePurchased = async (itemId) => {
    try {
      const item = selectedList.items.find(i => i._id === itemId);
      const response = await axios.put(
        `${API_URL}/shopping/${selectedList._id}/items/${itemId}`,
        { ...item, purchased: !item.purchased },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
      setLists(lists.map(l => l._id === selectedList._id ? response.data.data : l));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Delete this item?')) {
      try {
        const response = await axios.delete(
          `${API_URL}/shopping/${selectedList._id}/items/${itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedList(response.data.data);
        setLists(lists.map(l => l._id === selectedList._id ? response.data.data : l));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Delete this entire list?')) {
      try {
        await axios.delete(`${API_URL}/shopping/${listId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLists(lists.filter(l => l._id !== listId));
        setSelectedList(null);
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
        <div className="lists-sidebar">
          <button
            className="btn-primary"
            onClick={() => setShowNewListForm(!showNewListForm)}
          >
            {showNewListForm ? '✕ Cancel' : '+ New List'}
          </button>

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
              <p>Loading...</p>
            ) : lists.length === 0 ? (
              <p className="no-lists">No shopping lists yet</p>
            ) : (
              lists.map(list => (
                <div
                  key={list._id}
                  className={`list-item ${selectedList?._id === list._id ? 'active' : ''}`}
                  onClick={() => setSelectedList(list)}
                >
                  <div className="list-item-header">
                    <h4>{list.name}</h4>
                    <span className="item-count">{list.items.length}</span>
                  </div>
                  <p className="list-item-status">{list.status}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="list-details">
          {selectedList ? (
            <>
              <div className="list-header">
                <div>
                  <h3>{selectedList.name}</h3>
                  {selectedList.store && <p>📍 {selectedList.store}</p>}
                  {selectedList.description && <p>{selectedList.description}</p>}
                </div>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteList(selectedList._id)}
                >
                  Delete List
                </button>
              </div>

              <div className="add-item-form">
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
                  <input
                    type="number"
                    placeholder="Est. Price"
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
                  <p className="no-items">No items in this list</p>
                ) : (
                  selectedList.items.map(item => (
                    <div key={item._id} className={`shopping-item ${item.purchased ? 'purchased' : ''}`}>
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => handleTogglePurchased(item._id)}
                      />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">{item.quantity} {item.unit}</span>
                        {item.estimatedPrice && (
                          <span className="item-price">${item.estimatedPrice}</span>
                        )}
                      </div>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a shopping list to view items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
