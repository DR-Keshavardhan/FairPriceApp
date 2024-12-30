import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainApp from './App'; // Import the MainApp or app logic component (ensure to rename if necessary)
import TalukPage from './components/TalukPage'; // Import TalukPage
import DistrictPage from './components/DistrictPage'; // Import DistrictPage
import StatePage from './components/StatePage'; // Import StatePage

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); 

  return (
    <Router>
      <Routes>
        {/* Route for ButtonPage as the landing page */}
        <Route path="/" element={<ButtonPage />} />
        
        {/* Test Route for Upload Excel */}
        <Route path="/test" element={<UploadExcel />} />

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
        
        {/* Main app route */}
        <Route 
          path="/app" 
          element={isAuthenticated ? <MainApp /> : <Navigate to="/login2" />} 
        />

        {/* Role-based routes */}
        <Route path="/state" element={<StatePage />} />
        <Route path="/district" element={<DistrictPage />} />
        <Route path="/taluk" element={<TalukPage />} /> {/* Ensure this path matches */}
      </Routes>
    </Router>
  );
}

export default App;
