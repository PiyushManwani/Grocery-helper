import axios from 'axios';
import { Mistral } from '@mistralai/mistralai';
import { Pantry, Budget } from '../models/index.js';

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

// Get recipe suggestions
const getRecipeSuggestions = async (req, res) => {
  try {
    const pantryItems = await Pantry.find({ userId: req.userId });

    if (pantryItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in pantry. Add some items first.'
      });
    }

    const itemNames = pantryItems.map(item => item.name).join(', ');

    const message = await client.chat.complete({
      model: process.env.MISTRAL_MODEL || 'mistral-small',
      messages: [
        {
          role: 'user',
          content: `I have these items in my pantry: ${itemNames}. Can you suggest 3 recipes I can make with these items? Format the response as a JSON array with recipe name and ingredients needed.`
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Recipe suggestions generated',
      data: {
        suggestions: message.choices[0].message.content,
        pantryItems: itemNames
      }
    });
  } catch (error) {
    console.error('Recipe suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recipe suggestions',
      error: error.message
    });
  }
};

// Get budget tips
const getBudgetTips = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.userId }).sort('-month');

    if (!budget) {
      return res.status(400).json({
        success: false,
        message: 'No budget data found'
      });
    }

    const spent = budget.spent;
    const limit = budget.budgetLimit;
    const percentageUsed = limit > 0 ? (spent / limit) * 100 : 0;

    const message = await client.chat.complete({
      model: process.env.MISTRAL_MODEL || 'mistral-small',
      messages: [
        {
          role: 'user',
          content: `I have spent $${spent} out of my $${limit} budget for groceries (${percentageUsed.toFixed(2)}% used). Can you provide 5 practical money-saving tips for grocery shopping?`
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Budget tips generated',
      data: {
        tips: message.choices[0].message.content,
        budgetStatus: {
          spent,
          limit,
          percentageUsed: percentageUsed.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Budget tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budget tips',
      error: error.message
    });
  }
};

// Get smart shopping recommendations
const getSmartShopping = async (req, res) => {
  try {
    const pantryItems = await Pantry.find({ userId: req.userId });
    const budget = await Budget.findOne({ userId: req.userId }).sort('-month');

    const itemsByCategory = {};
    pantryItems.forEach(item => {
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = [];
      }
      itemsByCategory[item.category].push(item.name);
    });

    const budgetInfo = budget
      ? `Current budget: $${budget.budgetLimit}, Spent: $${budget.spent}`
      : 'No budget set';

    const message = await client.chat.complete({
      model: process.env.MISTRAL_MODEL || 'mistral-small',
      messages: [
        {
          role: 'user',
          content: `I have items by category: ${JSON.stringify(itemsByCategory)}. ${budgetInfo}. Can you suggest smart items I should buy next to optimize my shopping and stay within budget?`
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Smart shopping recommendations generated',
      data: {
        recommendations: message.choices[0].message.content,
        currentInventory: itemsByCategory
      }
    });
  } catch (error) {
    console.error('Smart shopping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get smart shopping recommendations',
      error: error.message
    });
  }
};

// Get meal planning suggestions
const getMealPlanning = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const pantryItems = await Pantry.find({ userId: req.userId });

    if (pantryItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in pantry. Add some items first.'
      });
    }

    const itemNames = pantryItems.map(item => item.name).join(', ');

    const message = await client.chat.complete({
      model: process.env.MISTRAL_MODEL || 'mistral-small',
      messages: [
        {
          role: 'user',
          content: `I have these pantry items: ${itemNames}. Can you create a ${days}-day meal plan using these items? Include breakfast, lunch, and dinner for each day.`
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: `${days}-day meal plan generated`,
      data: {
        mealPlan: message.choices[0].message.content,
        duration: `${days} days`,
        availableItems: itemNames
      }
    });
  } catch (error) {
    console.error('Meal planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get meal planning suggestions',
      error: error.message
    });
  }
};

export {
  getRecipeSuggestions,
  getBudgetTips,
  getSmartShopping,
  getMealPlanning
};
