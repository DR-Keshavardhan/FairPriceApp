import React, { useState } from 'react';
import './login2.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login2 = () => {
  const navigate = useNavigate();

  const handleLogin = async (username, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
        role,
      });

      if (response.data.role) {
        // Navigate to the page based on the role
        if (response.data.role === 'state') navigate('/state');
        else if (response.data.role === 'district') navigate('/district');
        else if (response.data.role === 'taluk') navigate('/taluk');
      } else {
        alert('Invalid role or login credentials.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="app">
      <Header />
      <LoginForm onLogin={handleLogin} />
      <Footer />
    </div>
  );
};

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert('Please select a role.');
      return;
    }
    onLogin(username, password, role);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <i
          className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
          onClick={() => setShowPassword(!showPassword)}
          aria-hidden="true"
          title="Toggle Password Visibility"
        />
      </div>

      <label htmlFor="role">Role</label>
      <select
        id="role"
        onChange={(e) => setRole(e.target.value)}
        value={role}
        required
      >
        <option value="">Select Role</option>
        <option value="state">State</option>
        <option value="district">District</option>
        <option value="taluk">Taluk</option>
      </select>

      <button type="submit">Login</button>
      <div className="forgot-password">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </form>
  );
};

const Header = () => (
  <header className="header">
    <img
      src={require('./tnpds.png').default} // Updated for modern React setups
      alt="TNPDS Logo"
      className="logo"
    />
    <div className="header-text">
      <h1>Civil Supplies and Consumer Protection Department</h1>
    </div>
  </header>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>&copy; 2024 Civil Supplies and Consumer Protection Department. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Login2;
