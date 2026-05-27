import React, { useState } from 'react';

const Register = ({ onNavigateToLogin, API_URL }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const text = await response.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { 
        throw new Error('Invalid server response. Try again in 30 seconds.');
      }
      if (!response.ok) throw new Error(data.message || 'Registration failed.');

      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => onNavigateToLogin(), 2000);
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
          <h2>Create Account</h2>
          <p>Get started by setting up your secure profile</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password (min. 6 characters)</label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
