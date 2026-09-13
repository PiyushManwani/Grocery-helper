# Grocery Helper - Complete Code Generation Prompt

**Use this prompt with any AI assistant (Claude, GPT-4, etc.) to generate ALL complete code files for the Grocery Helper application.**

---

## PROJECT OVERVIEW

Build a complete **Grocery Helper** - a supermarket tracking app with:
- User authentication (JWT-based)
- Pantry/inventory management
- Budget tracking
- Shopping list creation
- AI assistant powered by Mistral AI
- Desktop app support via Electron
- React frontend + Node.js/Express backend + MongoDB

---

## COMPLETE PROJECT REQUIREMENTS

### PART 1: ROOT CONFIGURATION FILES

Generate these files in the root directory:

1. **`.env.example`** - Environment template with all required variables:
   - MongoDB URI
   - JWT secret
   - Mistral AI API key
   - Port configuration
   - Frontend/backend URLs

2. **`.gitignore`** - Standard Node.js + Electron gitignore

3. **`package.json`** - Root package.json with workspace setup (if using monorepo) or just scripts

---

### PART 2: BACKEND (Node.js + Express)

Create complete files in `server/` directory:

#### Configuration & Setup
- **`server.js`** - Express server setup with CORS, middleware, routes
- **`package.json`** - Backend dependencies (express, mongoose, jwt, dotenv, mistral-sdk, etc.)

#### Routes (`server/routes/`)
- **`auth.js`** - Login, register, verify token endpoints
- **`pantry.js`** - Add item, update item, delete item, get all items
- **`budget.js`** - Set budget, track spending, get budget status
- **`shoppingList.js`** - Create list, add items, mark purchased, delete items
- **`ai.js`** - AI suggestions endpoint, meal planning, smart shopping

#### Controllers (`server/controllers/`)
- **`authController.js`** - Handle auth logic (hash passwords, generate tokens)
- **`pantryController.js`** - Pantry CRUD operations
- **`budgetController.js`** - Budget calculations and tracking
- **`shoppingListController.js`** - Shopping list management
- **`aiController.js`** - AI request handling and Mistral integration

#### Models (`server/models/`)
- **`User.js`** - User schema with email, password hash, preferences
- **`Pantry.js`** - Pantry items schema with quantity, expiry, category
- **`Budget.js`** - Budget schema with limits and spending history
- **`ShoppingList.js`** - Shopping list schema with items and status

#### Middleware (`server/middleware/`)
- **`auth.js`** - JWT verification middleware

#### Services (`server/services/`)
- **`mistralService.js`** - Mistral AI API integration for:
  - Recipe suggestions based on pantry items
  - Budget optimization tips
  - Smart shopping list recommendations

#### Database (`server/`)
- **`db.js`** - MongoDB connection setup

---

### PART 3: FRONTEND (React)

Create complete files in `client/src/` directory:

#### Main Files
- **`index.js`** - React DOM render
- **`App.js`** - Main app component with routing
- **`App.css`** - Global styles (1500+ lines comprehensive styling)

#### Components (`client/src/components/`)
- **`Navigation.js`** - Top navigation bar with user menu
- **`PrivateRoute.js`** - Protected route wrapper
- **`LoadingSpinner.js`** - Loading indicator

#### Pages (`client/src/pages/`)
- **`Login.js`** - Login and registration form
- **`PantryTracker.js`** - Full pantry management UI with:
  - Add items form
  - Item list with edit/delete
  - Category filters
  - Expiry date warnings
- **`BudgetTracker.js`** - Budget management UI with:
  - Budget limit setter
  - Spending tracking
  - Progress visualization
  - Category breakdown
- **`ShoppingList.js`** - Shopping list UI with:
  - Create new list
  - Add items
  - Mark as purchased
  - Sharing/printing options
- **`AIAssistant.js`** - AI features UI with:
  - Recipe suggestions
  - Budget tips
  - Smart shopping recommendations

#### Services (`client/src/services/`)
- **`api.js`** - Axios setup with auth headers
- **`authService.js`** - Login/register API calls
- **`pantryService.js`** - Pantry API calls
- **`budgetService.js`** - Budget API calls
- **`shoppingListService.js`** - Shopping list API calls
- **`aiService.js`** - AI endpoint calls

#### Styles (`client/src/styles/`)
- **`Login.css`** - Login page styling
- **`PantryTracker.css`** - Pantry page styling
- **`BudgetTracker.css`** - Budget page styling
- **`ShoppingList.css`** - Shopping list styling
- **`AIAssistant.css`** - AI page styling

#### Public (`client/public/`)
- **`index.html`** - HTML entry point with meta tags
- **`favicon.ico`** - App icon

---

### PART 4: ELECTRON (Desktop App)

Create in `client/electron/` directory:

- **`main.js`** - Electron main process with:
  - Window creation
  - App lifecycle management
  - IPC handlers
- **`preload.js`** - Preload script for secure IPC
- **`package.json`** - Electron build configuration

---

### PART 5: DOCUMENTATION

Create these documentation files:

- **`README.md`** - Quick overview and features
- **`SETUP_GUIDE.md`** - 900+ line detailed setup instructions
- **`QUICK_START.md`** - Quick reference guide
- **`PROJECT_STRUCTURE.md`** - Architecture explanation
- **`DEPLOYMENT_GUIDE.md`** - Deployment instructions
- **`FILE_MANIFEST.md`** - All files explained

---

## KEY FEATURES TO IMPLEMENT

### Authentication
- User registration with email/password
- JWT-based login
- Password hashing (bcrypt)
- Token refresh mechanism
- Logout functionality

### Pantry Tracking
- Add items with name, quantity, unit, category, expiry date
- View all items with search and filter
- Edit existing items
- Delete items with confirmation
- Expiry date warnings (highlight items expiring soon)
- Low stock alerts

### Budget Management
- Set monthly/weekly budget limit
- Track spending by category
- Visualize budget usage (progress bar, pie chart)
- Category-wise breakdown
- Budget alerts when approaching limit
- Spending history

### Shopping List
- Create new shopping lists
- Add items with quantity and category
- Mark items as purchased
- Delete items
- View past shopping lists
- Smart suggestions based on pantry items

### AI Assistant (Mistral AI)
- **Recipe Suggestions** - Based on items in pantry
- **Budget Tips** - Money-saving advice
- **Smart Shopping** - Optimized shopping recommendations
- **Meal Planning** - Weekly meal plan suggestions

---

## TECHNICAL REQUIREMENTS

### Backend Stack
- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (jsonwebtoken)
- **Password:** bcrypt
- **AI:** Mistral AI API
- **Environment:** dotenv
- **CORS:** cors middleware

### Frontend Stack
- **UI Library:** React 18+
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **State Management:** React Hooks (useState, useContext)
- **Styling:** CSS3 with responsive design
- **Desktop:** Electron

### Database Schemas
Each model should include:
- Timestamps (createdAt, updatedAt)
- Proper validation
- Relationships/references between collections
- Indexes for frequently queried fields

---

## API ENDPOINTS SPECIFICATION

### Authentication (`/api/auth`)
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
POST   /auth/refresh           - Refresh token
POST   /auth/logout            - Logout user
GET    /auth/verify            - Verify token
```

### Pantry (`/api/pantry`)
```
GET    /pantry                 - Get all items
POST   /pantry                 - Add new item
PUT    /pantry/:id             - Update item
DELETE /pantry/:id             - Delete item
GET    /pantry/expiring        - Get expiring soon items
GET    /pantry/by-category     - Get items by category
```

### Budget (`/api/budget`)
```
GET    /budget                 - Get budget info
POST   /budget/set-limit       - Set budget limit
POST   /budget/add-expense     - Add spending record
GET    /budget/summary         - Get spending summary
GET    /budget/by-category     - Category breakdown
```

### Shopping List (`/api/shopping`)
```
GET    /shopping               - Get all lists
POST   /shopping               - Create new list
PUT    /shopping/:id           - Update list
DELETE /shopping/:id           - Delete list
POST   /shopping/:id/items     - Add item to list
PUT    /shopping/:id/items/:itemId - Update item
DELETE /shopping/:id/items/:itemId - Delete item
```

### AI Assistant (`/api/ai`)
```
POST   /ai/recipes             - Get recipe suggestions
POST   /ai/budget-tips         - Get budget advice
POST   /ai/shopping-smart      - Get smart shopping suggestions
POST   /ai/meal-plan           - Get meal planning suggestions
```

---

## RESPONSE FORMAT

All API responses should follow:
```json
{
  "success": boolean,
  "message": "descriptive message",
  "data": { /* response data */ },
  "error": "error message if any"
}
```

---

## STYLING REQUIREMENTS

- **Color Scheme:** Modern, professional (suggest greens/blues for grocery app)
- **Responsive:** Mobile-first design (works on phone, tablet, desktop)
- **Components:** Cards, modals, buttons, forms with consistent styling
- **Animations:** Smooth transitions and interactions
- **Accessibility:** Proper labels, ARIA attributes, keyboard navigation

---

## FILE GENERATION INSTRUCTIONS

When generating code, please:

1. **Generate ALL files** - Don't skip any files, generate complete code
2. **Make it production-ready** - Proper error handling, validation, security
3. **Add comments** - Explain complex logic and important sections
4. **Follow best practices** - DRY principles, proper structure, security
5. **Include error handling** - Try-catch blocks, proper error responses
6. **Add validation** - Input validation on both frontend and backend
7. **Security** - Sanitize inputs, secure password handling, CORS setup
8. **One file per request** - If needed, I'll ask for individual files separately

---

## DELIVERY FORMAT

Please provide each file in a code block with:
```
// File path: server/routes/auth.js
// Purpose: Authentication endpoints

[complete code here]
```

---

## NEXT STEPS

1. Copy this prompt to your chosen AI
2. Ask it to generate all files one by one or in batches
3. Create each file in your repository
4. Run `npm install` in both `server/` and `client/` directories
5. Create `.env` file from `.env.example`
6. Start backend: `npm run dev` in `server/`
7. Start frontend: `npm start` in `client/`
8. Test all features

---

**You now have everything you need to generate a complete, production-ready Grocery Helper application!**
