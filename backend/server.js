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

// CORS — allow Render frontend and local dev
app.use(cors({
  origin: [
    /\.onrender\.com$/,
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(express.json());

// Routes Mounting
app.use('/api', authRoutes);
app.use('/api', expenseRoutes);

// Health Check / Root route
app.get('/', (req, res) => {
  res.send('Personal Expense Tracker API is running...');
});

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
    console.log('Successfully connected to MongoDB Database.');
  })
  .catch((err) => {
    console.error('MongoDB database connection failed:', err.message);
  });

