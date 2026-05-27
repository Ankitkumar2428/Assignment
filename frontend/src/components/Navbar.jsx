import React from 'react';

const Navbar = ({ user, onLogout }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="brand">
          <span style={{ color: '#06b6d4' }}>🪙</span>
          <span>SpendWise</span>
        </div>
        {user && (
          <div className="nav-user">
            <div className="user-tag">
              <div className="avatar" title={user.email}>
                {getInitials(user.name)}
              </div>
              <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{user.name}</span>
            </div>
            <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
