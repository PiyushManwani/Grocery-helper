import { Pantry } from '../models/index.js';

// Get all pantry items
const getItems = async (req, res) => {
  try {
    const { category, sortBy = '-createdAt' } = req.query;

    let query = { userId: req.userId };
    if (category) {
      query.category = category;
    }

    const items = await Pantry.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pantry items',
      error: error.message
    });
  }
};

// Add new item
const addItem = async (req, res) => {
  try {
    const { name, quantity, unit, category, expiryDate, location, notes } = req.body;

    if (!name || quantity === undefined || !unit || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: name, quantity, unit, category'
      });
    }

    const item = new Pantry({
      userId: req.userId,
      name,
      quantity,
      unit,
      category,
      expiryDate,
      location,
      notes
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      data: item
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item',
      error: error.message
    });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await Pantry.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Pantry.findOneAndDelete({ _id: id, userId: req.userId });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: item
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
};

// Get expiring items
const getExpiringItems = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const items = await Pantry.find({
      userId: req.userId,
      expiryDate: {
        $lte: futureDate,
        $gte: new Date()
      }
    }).sort('expiryDate');

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
      message: `Items expiring within ${days} days`
    });
  } catch (error) {
    console.error('Get expiring items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get expiring items',
      error: error.message
    });
  }
};

// Get items by category
const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const items = await Pantry.find({
      userId: req.userId,
      category
    });

    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Get by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get items by category',
      error: error.message
    });
  }
};

export { getItems, addItem, updateItem, deleteItem, getExpiringItems, getByCategory };
