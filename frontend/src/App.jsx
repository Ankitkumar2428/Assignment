import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Dynamically resolve API URL for Render deployment, falling back to localhost
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (API_URL && !API_URL.endsWith('/api') && API_URL.startsWith('http')) {
  API_URL = `${API_URL.replace(/\/$/, '')}/api`;
}


function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); // login, register, dashboard

  // Check localStorage for existing session on mount (Part C Form Requirements)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Pages router */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        {currentPage === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentPage('register')}
            API_URL={API_URL}
          />
        )}
        
        {currentPage === 'register' && (
          <Register
            onNavigateToLogin={() => setCurrentPage('login')}
            API_URL={API_URL}
          />
        )}

        {currentPage === 'dashboard' && token && (
          <Dashboard
            token={token}
            API_URL={API_URL}
          />
        )}
      </main>
    </div>
  );
}

export default App;
