import React, { useState } from 'react';
import './login1.css';
import UploadExcel1 from './UploadExcel1';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [userType, setUserType] = useState('');

  const handleLogin = () => {
    const credentials = {
      'Shop Incharge': [
        { username: '02FA001NT', password: 'shop123', identifier: '02FA001NT' },
        { username: '02FB017NT', password: 'shop123', identifier: '02FB017NT' },
        { username: '02CA044NC', password: 'shop123', identifier: '02CA044NC' },
        { username: '02CA009NC', password: 'shop123', identifier: '02CA009NC' },
      ],
      'Taluk Officer': [
        { username: 'Perambur', password: 'Per123', identifier: 'Perambur' },
        { username: 'Avadi', password: 'Av123', identifier: 'Avadi' },
        { username: 'Ponneri', password: 'Po123', identifier: 'Ponneri' },
        { username: 'RK Pettai', password: 'RK123', identifier: 'RK Pettai' },
      ],
      'District Officer': [
        { username: 'Chennai', password: 'Chen123', identifier: 'Chennai' },
        { username: 'Thiruvallur', password: 'Thi123', identifier: 'Thiruvallur' },
      ],
    };

    setErrorMessage('');

    const user = credentials[role]?.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (user) {
      // Set user data for UploadExcel1 component
      setUserIdentifier(user.identifier);
      setUserType(role.toLowerCase()); // Store role as userType (lowercased)
      setIsLoggedIn(true); // Set login state to true
    } else {
      setErrorMessage('Invalid username, password, or role');
    }
  };

  return (
    <div className="login-container">
      {!isLoggedIn ? (
        <div className="login-box">
          <h2>KIDSYNC</h2>
          <h2>Login</h2>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-dropdown"
            aria-label="Select Role"
          >
            <option value="">Select Role</option>
            <option value="Shop Incharge">Shop Incharge</option>
            <option value="Taluk Officer">Taluk Officer</option>
            <option value="District Officer">District Officer</option>
          </select>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            aria-label="Username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            aria-label="Password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button onClick={handleLogin} className="login-btn">
            Login
          </button>
        </div>
      ) : (
        <UploadExcel1 userIdentifier={userIdentifier} userType={userType} />
      )}
    </div>
  );
}

export default Login;
