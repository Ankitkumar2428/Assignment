import React from 'react';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Healthcare', 'Shopping', 'Others'];

const CategorySummary = ({ expenses }) => {
  // Calculate total spent across all expenses
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Group and calculate sum by category
  const categoryMap = expenses.reduce((map, item) => {
    map[item.category] = (map[item.category] || 0) + item.amount;
    return map;
  }, {});

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Compile breakdown list and sort by amount descending
  const breakdown = CATEGORIES.map((cat) => {
    const amount = categoryMap[cat] || 0;
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
    return { category: cat, amount, percentage };
  })
    .filter((item) => item.amount > 0) // only show categories with some spending
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="glass-card summary-panel fade-in">
      <h3 className="panel-title">Spending Breakdown</h3>
      {breakdown.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center', padding: '1rem 0' }}>
          No data available to display breakdown.
        </div>
      ) : (
        <div className="category-bar-list">
          {breakdown.map((item) => (
            <div key={item.category} className="category-bar-item">
              <div className="category-bar-info">
                <span className="category-name">{item.category}</span>
                <span className="category-amount">
                  {formatAmount(item.amount)} ({item.percentage}%)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill bg-${item.category}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySummary;
