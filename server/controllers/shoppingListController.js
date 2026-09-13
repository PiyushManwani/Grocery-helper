import { ShoppingList } from '../models/index.js';

// Get all shopping lists
const getShoppingLists = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { userId: req.userId };
    if (status) query.status = status;

    const lists = await ShoppingList.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      data: lists,
      count: lists.length
    });
  } catch (error) {
    console.error('Get shopping lists error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shopping lists',
      error: error.message
    });
  }
};

// Create new shopping list
const createShoppingList = async (req, res) => {
  try {
    const { name, description, dueDate, store } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide list name'
      });
    }

    const list = new ShoppingList({
      userId: req.userId,
      name,
      description,
      dueDate,
      store,
      items: []
    });

    await list.save();

    res.status(201).json({
      success: true,
      message: 'Shopping list created successfully',
      data: list
    });
  } catch (error) {
    console.error('Create shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create shopping list',
      error: error.message
    });
  }
};

// Add item to shopping list
const addItemToList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit, category, estimatedPrice, notes } = req.body;

    if (!name || !quantity || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, quantity, and unit'
      });
    }

    const list = await ShoppingList.findOne({ _id: id, userId: req.userId });
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    list.items.push({
      name,
      quantity,
      unit,
      category,
      estimatedPrice,
      notes
    });

    list.totalEstimatedCost = list.items.reduce(
      (total, item) => total + (item.estimatedPrice || 0),
      0
    );

    await list.save();

    res.status(201).json({
      success: true,
      message: 'Item added to list',
      data: list
    });
  } catch (error) {
    console.error('Add item to list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to list',
      error: error.message
    });
  }
};

// Update shopping list item
const updateListItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const updates = req.body;

    const list = await ShoppingList.findOne({ _id: id, userId: req.userId });
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    const item = list.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in list'
      });
    }

    Object.assign(item, updates);
    list.totalEstimatedCost = list.items.reduce(
      (total, item) => total + (item.estimatedPrice || 0),
      0
    );
    list.totalActualCost = list.items.reduce(
      (total, item) => total + (item.actualPrice || 0),
      0
    );

    await list.save();

    res.status(200).json({
      success: true,
      message: 'Item updated',
      data: list
    });
  } catch (error) {
    console.error('Update list item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
};

// Delete item from list
const deleteListItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const list = await ShoppingList.findOne({ _id: id, userId: req.userId });
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    list.items.id(itemId).deleteOne();
    await list.save();

    res.status(200).json({
      success: true,
      message: 'Item deleted from list',
      data: list
    });
  } catch (error) {
    console.error('Delete list item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
};

// Update shopping list
const updateShoppingList = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const list = await ShoppingList.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shopping list updated',
      data: list
    });
  } catch (error) {
    console.error('Update shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shopping list',
      error: error.message
    });
  }
};

// Delete shopping list
const deleteShoppingList = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await ShoppingList.findOneAndDelete({ _id: id, userId: req.userId });

    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shopping list deleted',
      data: list
    });
  } catch (error) {
    console.error('Delete shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shopping list',
      error: error.message
    });
  }
};

export {
  getShoppingLists,
  createShoppingList,
  addItemToList,
  updateListItem,
  deleteListItem,
  updateShoppingList,
  deleteShoppingList
};
