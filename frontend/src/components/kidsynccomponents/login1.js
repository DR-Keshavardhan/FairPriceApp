import React, { useState } from 'react';
import './login1.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login1() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      if (!role) {
        setErrorMessage('Please select a role.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/login', {
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
        setErrorMessage('Invalid role or login credentials.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <Header />
      <form className="login-box" onSubmit={(e) => e.preventDefault()}>
        <h2>KIDSYNC</h2>
        <h2>Login</h2>
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="role-dropdown"
          aria-label="Select Role"
          required
        >
          <option value="">Select Role</option>
          <option value="state">State</option>
          <option value="district">District</option>
          <option value="taluk">Taluk</option>
        </select>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          aria-label="Username"
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
            className="input-field"
            aria-label="Password"
            required
          />
          <i
            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowPassword(!showPassword)}
            aria-hidden="true"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleLogin} className="login-btn">
          Login
        </button>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
      <Footer />
    </div>
  );
}

const Header = () => (
  <header className="header">
    <img src={require('./tnpds.png')} alt="Logo" />
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

export default Login1;
