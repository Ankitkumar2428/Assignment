import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS — allow all origins (fix for Render)
app.use(cors());
app.use(express.json());

// Track DB connection state
let dbConnected = false;

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', db: dbConnected ? 'connected' : 'disconnected' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: dbConnected ? 'connected' : 'disconnected' });
});

// Middleware: block API calls until DB is ready
app.use('/api', (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({ message: 'Database is connecting, please wait 10 seconds and try again.' });
  }
  next();
});

// Routes Mounting
app.use('/api', authRoutes);
app.use('/api', expenseRoutes);

// Port and MongoDB setup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

// Start the HTTP server first so Render's health check passes
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server is running on port ${PORT}`);
});

// Then connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => {
    dbConnected = true;
    console.log('Successfully connected to MongoDB Database.');
  })
  .catch((err) => {
    console.error('MongoDB database connection failed:', err.message);
  });

