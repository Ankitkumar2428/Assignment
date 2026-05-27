import express from 'express';
import Expense from '../models/Expense.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes in this file
router.use(authMiddleware);

// @route   POST /api/expense
// @desc    Add new expense
// @access  Private
router.post('/expense', async (req, res) => {
  const { title, amount, category, date } = req.body;

  // Simple validation
  if (!title || amount === undefined || !category) {
    return res.status(400).json({ message: 'Title, amount, and category are required' });
  }

  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount < 0) {
    return res.status(400).json({ message: 'Amount must be a non-negative number' });
  }

  try {
    const newExpense = new Expense({
      userId: req.userId, // Assigned by authMiddleware
      title,
      amount: parsedAmount,
      category,
      date: date || new Date(),
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Server error while adding expense' });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses of logged-in user
// @access  Private
// @bonus   Supports optional filtering by category (e.g., /api/expenses?category=Food)
router.get('/expenses', async (req, res) => {
  try {
    const query = { userId: req.userId };
    
    // Optional category filter query param
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Sort by date descending
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Fetch expenses error:', error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

export default router;
