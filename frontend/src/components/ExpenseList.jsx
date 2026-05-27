import React from 'react';

const CATEGORIES = ['All', 'Food', 'Travel', 'Bills', 'Entertainment', 'Healthcare', 'Shopping', 'Others'];

const CATEGORY_EMOJIS = {
  Food: '🍔',
  Travel: '✈️',
  Bills: '🔌',
  Entertainment: '🍿',
  Healthcare: '🏥',
  Shopping: '🛍️',
  Others: '🏷️',
};

const ExpenseList = ({ expenses, selectedCategory, onCategoryChange }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="glass-card list-panel fade-in">
      <div className="filter-bar">
        <h3 className="filter-title">Recent Expenses</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filter:</span>
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🪙</div>
          <p>No expenses found. Add some using the sidebar form!</p>
        </div>
      ) : (
        <div className="expense-items">
          {expenses.map((expense) => {
            const emoji = CATEGORY_EMOJIS[expense.category] || '🏷️';
            return (
              <div key={expense._id} className="expense-item">
                <div className="expense-details">
                  <div className={`category-icon bg-${expense.category}`}>
                    {emoji}
                  </div>
                  <div className="expense-info">
                    <span className="expense-title">{expense.title}</span>
                    <span className="expense-date">{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="expense-amount-wrap">
                  <span className={`expense-amount`}>
                    {formatAmount(expense.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
