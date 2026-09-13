import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import pantryRoutes from './routes/pantry.js';
import budgetRoutes from './routes/budget.js';
import shoppingListRoutes from './routes/shoppingList.js';
import aiRoutes from './routes/ai.js';

// Initialize Express app
const app = express();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Gzip compression
app.use(morgan('combined')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    message: 'Grocery Helper API is running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/shopping', shoppingListRoutes);
app.use('/api/ai', aiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Grocery Helper API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pantry: '/api/pantry',
      budget: '/api/budget',
      shopping: '/api/shopping',
      ai: '/api/ai',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export default app;
