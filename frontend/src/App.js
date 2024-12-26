import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import necessary routing components
import ButtonPage from './buttonPage'; // Import the ButtonPage component
import Login from './components/login1'; // Import your Login1 component
import Login2 from './components/login2'; // Import your Login2 component
import UploadExcel from './components/UploadExcel'; // Import UploadExcel component
import MainApp from './App'; // Import the MainApp or app logic component (ensure to rename if necessary)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  return (
    <Router>
      <Routes>
        {/* Default route to ButtonPage */}
        <Route path="/" element={<ButtonPage />} />

        {/* Route for Login1 page */}
        <Route
          path="/login1"
          element={isAuthenticated ? <Navigate to="/upload" /> : <Login onLogin={() => setIsAuthenticated(true)} />}
        />

        {/* Route for Login2 page */}
        <Route
          path="/login2"
          element={isAuthenticated ? <Navigate to="/upload" /> : <Login2 />}
        />

        {/* Authentication-based route for Upload Excel */}
        <Route
          path="/upload"
          element={isAuthenticated ? <UploadExcel /> : <Navigate to="/login2" />}
        />

        {/* Main app route that will render the logic component */}
        <Route path="/app" element={isAuthenticated ? <MainApp /> : <Navigate to="/login2" />} />
      </Routes>
    </Router>
  );
}

export default App;
