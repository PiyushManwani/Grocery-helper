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
    store: '',
    dueDate: ''
  });
  const [itemData, setItemData] = useState({
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
      setNewListData({ name: '', description: '', store: '', dueDate: '' });
      setShowNewListForm(false);
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
        { ...itemData, quantity: parseFloat(itemData.quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedList(response.data.data);
      setLists(lists.map(l => l._id === selectedList._id ? response.data.data : l));
      setItemData({ name: '', quantity: '', unit: 'pieces', category: 'vegetables', estimatedPrice: '' });
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
    if (!selectedList) return;

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
      <h2>🍟 Shopping List</h2>

      {error && <div className="error-alert">{error}</div>}

      <div className="shopping-layout">
        <div className="lists-sidebar">
          <button className="btn-primary" onClick={() => setShowNewListForm(!showNewListForm)}>
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
              <textarea
                placeholder="Description"
                value={newListData.description}
                onChange={(e) => setNewListData({...newListData, description: e.target.value})}
                rows="2"
              />
              <input
                type="text"
                placeholder="Store"
                value={newListData.store}
                onChange={(e) => setNewListData({...newListData, store: e.target.value})}
              />
              <input
                type="date"
                value={newListData.dueDate}
                onChange={(e) => setNewListData({...newListData, dueDate: e.target.value})}
              />
              <button type="submit" className="btn-success">Create List</button>
            </form>
          )}

          <div className="lists-list">
            {loading ? (
              <p>Loading...</p>
            ) : lists.length === 0 ? (
              <p className="no-lists">No shopping lists</p>
            ) : (
              lists.map(list => (
                <div
                  key={list._id}
                  className={`list-item ${selectedList?._id === list._id ? 'active' : ''}`}
                  onClick={() => setSelectedList(list)}
                >
                  <p className="list-name">{list.name}</p>
                  <span className="list-count">{list.items.length} items</span>
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
                  {selectedList.store && <p className="store-name">Store: {selectedList.store}</p>}
                  {selectedList.dueDate && <p className="due-date">Due: {new Date(selectedList.dueDate).toLocaleDateString()}</p>}
                </div>
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteList(selectedList._id)}
                >
                  Delete List
                </button>
              </div>

              <form onSubmit={handleAddItem} className="add-item-form">
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
                <select
                  value={itemData.unit}
                  onChange={(e) => setItemData({...itemData, unit: e.target.value})}
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <select
                  value={itemData.category}
                  onChange={(e) => setItemData({...itemData, category: e.target.value})}
                >
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

              <div className="items-list">
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
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">{item.quantity} {item.unit} - {item.category}</p>
                      </div>
                      {item.estimatedPrice && <p className="item-price">${item.estimatedPrice}</p>}
                      <button
                        className="btn-small-delete"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        ✕
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
