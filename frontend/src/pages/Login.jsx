import React, { useState } from 'react';

const Login = ({ onLoginSuccess, onNavigateToRegister, API_URL }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Connection Status Tracker
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [connectionColor, setConnectionColor] = useState('#f59e0b'); // orange

  React.useEffect(() => {
    const testConnection = async () => {
      // Extract root backend URL from API_URL (replace /api with /health)
      const rootUrl = API_URL.replace(/\/api$/, '');
      try {
        const res = await fetch(`${rootUrl}/health`);
        const data = await res.json();
        if (data.status === 'ok' && data.db === 'connected') {
          setConnectionStatus('Backend Connected & Database Ready');
          setConnectionColor('#10b981'); // green
        } else {
          setConnectionStatus(`Backend Active, DB: ${data.db || 'offline'}`);
          setConnectionColor('#ef4444'); // red
        }
      } catch (err) {
        setConnectionStatus(`Connection Error: ${err.message || 'Cannot reach server'}`);
        setConnectionColor('#ef4444'); // red
      }
    };
    testConnection();
  }, [API_URL]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const text = await response.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch {
        throw new Error('Invalid server response. Try again in 30 seconds.');
      }
      if (!response.ok) throw new Error(data.message || 'Login failed. Please check your credentials.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        setError('Request timed out. The backend is waking up — please wait 30 seconds and try again.');
      } else {
        setError(err.message || 'Network error, please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card fade-in">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to securely manage your daily expenses</p>
          <div style={{
            marginTop: '0.75rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '600',
            backgroundColor: 'rgba(0,0,0,0.2)',
            color: connectionColor,
            border: `1px solid ${connectionColor}44`,
            display: 'inline-block',
            textAlign: 'center'
          }}>
            🔌 {connectionStatus}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); onNavigateToRegister(); }}>
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
