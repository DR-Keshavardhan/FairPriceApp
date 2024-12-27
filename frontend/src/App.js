import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ButtonPage from './buttonPage'; // Ensure this is the correct path
import Login from './components/login1'; // Ensure this is the correct path
import Login2 from './components/login2'; // Ensure this is the correct path
import UploadExcel from './components/UploadExcel'; // Ensure this is the correct path
import MainApp from './App'; // Ensure this is the correct path

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authState);
  }, []);

  // Handle login logic and persist to localStorage
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  // Handle logout logic and clear from localStorage
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // Higher-order component for protected routes
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login2" />;
  };

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<ButtonPage />} />

        {/* Login routes */}
        <Route
          path="/login1"
          element={isAuthenticated ? <Navigate to="/upload" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/login2"
          element={isAuthenticated ? <Navigate to="/upload" /> : <Login2 onLogin={handleLogin} />}
        />

        {/* Protected routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadExcel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainApp onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

