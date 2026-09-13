import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    avatar: {
      type: String,
      default: null
    },
    preferences: {
      currency: {
        type: String,
        default: 'USD'
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
      },
      notifications: {
        type: Boolean,
        default: true
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Pantry Schema
const pantrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Please provide unit'],
      enum: ['kg', 'g', 'liter', 'ml', 'pieces', 'box', 'dozen']
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other']
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: false
    },
    location: {
      type: String,
      default: 'Pantry'
    },
    notes: {
      type: String,
      default: ''
    },
    lowStockAlert: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

// Budget Schema
const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    month: {
      type: Date,
      required: true
    },
    budgetLimit: {
      type: Number,
      required: [true, 'Please provide budget limit'],
      min: [0, 'Budget limit cannot be negative']
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent cannot be negative']
    },
    expenses: [
      {
        date: {
          type: Date,
          default: Date.now
        },
        category: {
          type: String,
          enum: ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other'],
          required: true
        },
        amount: {
          type: Number,
          required: true,
          min: [0, 'Amount cannot be negative']
        },
        description: String,
        shoppingListId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ShoppingList'
        }
      }
    ],
    notes: String
  },
  { timestamps: true }
);

// Shopping List Schema
const shoppingListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide list name'],
      trim: true
    },
    description: String,
    items: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [0, 'Quantity cannot be negative']
        },
        unit: {
          type: String,
          enum: ['kg', 'g', 'liter', 'ml', 'pieces', 'box', 'dozen'],
          required: true
        },
        category: {
          type: String,
          enum: ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'snacks', 'beverages', 'frozen', 'canned', 'other']
        },
        estimatedPrice: Number,
        purchased: {
          type: Boolean,
          default: false
        },
        actualPrice: Number,
        notes: String
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'archived'],
      default: 'draft'
    },
    totalEstimatedCost: {
      type: Number,
      default: 0
    },
    totalActualCost: {
      type: Number,
      default: 0
    },
    dueDate: Date,
    store: String,
    notes: String
  },
  { timestamps: true }
);

// Create models
const User = mongoose.model('User', userSchema);
const Pantry = mongoose.model('Pantry', pantrySchema);
const Budget = mongoose.model('Budget', budgetSchema);
const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

export { User, Pantry, Budget, ShoppingList };
