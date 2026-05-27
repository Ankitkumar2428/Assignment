import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategorySummary from '../components/CategorySummary';

const Dashboard = ({ token, API_URL }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all expenses from backend
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch expenses');
      }

      setExpenses(data);
      setFilteredExpenses(data);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  // Handle Category Filter change
  const handleCategoryChange = async (category) => {
    setCategoryFilter(category);
    setError('');
    try {
      const url = category === 'All' 
        ? `${API_URL}/expenses`
        : `${API_URL}/expenses?category=${category}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to filter expenses');
      }

      setFilteredExpenses(data);
    } catch (err) {
      setError(err.message || 'Failed to apply filter');
    }
  };

  // Add new expense
  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch(`${API_URL}/expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create expense');
      }

      // Prepend the new expense to local lists
      setExpenses((prev) => [data, ...prev]);

      // If category filter is 'All' or matches the new expense's category, prepend it
      if (categoryFilter === 'All' || categoryFilter === data.category) {
        setFilteredExpenses((prev) => [data, ...prev]);
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create expense');
      throw err;
    }
  };

  // Analytical stats
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const transactionCount = expenses.length;
  
  // Calculate average spending per item
  const averageSpent = transactionCount > 0 ? (totalSpent / transactionCount) : 0;

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="container fade-in">
      <div className="dashboard-stats">
        <div className="glass-card stat-card">
          <span className="stat-label">Total Outflow</span>
          <span className="stat-value primary">{formatCurrency(totalSpent)}</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-label">Transactions</span>
          <span className="stat-value secondary">{transactionCount}</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-label">Average Outflow</span>
          <span className="stat-value" style={{ color: '#a7f3d0' }}>{formatCurrency(averageSpent)}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="sidebar-panel">
          <ExpenseForm onAddExpense={handleAddExpense} />
          {/* Visual Breakdown chart using expenses state */}
          <CategorySummary expenses={expenses} />
        </div>

        <div className="main-panel">
          {error && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}
          
          {loading ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading your workspace...
            </div>
          ) : (
            <ExpenseList
              expenses={filteredExpenses}
              selectedCategory={categoryFilter}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
