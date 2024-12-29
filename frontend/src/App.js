import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ButtonPage from './buttonPage'; // Import the ButtonPage component
import Login from './components/login1'; // Import your Login1 component
import Login2 from './components/login2'; // Import your Login2 component
import UploadExcel from './components/UploadExcel1.js'; // Import UploadExcel component
import MainApp from './App'; // Import the MainApp or app logic component (ensure to rename if necessary)
import TalukPage from './components/TalukPage'; // Import TalukPage
import DistrictPage from './components/DistrictPage'; // Import DistrictPage
import StatePage from './components/StatePage'; // Import StatePage

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); 

  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<ButtonPage />} />
        <Route path="/test" elemet={<UploadExcel/>}></Route>

        {/* Route for Login1 page */}
        <Route path="/login1"
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

        {/* Role-based routes */}
        <Route path="/state" element={<StatePage />} />
        <Route path="/district" element={<DistrictPage />} />
        <Route path="/taluk" element={<TalukPage />} /> {/* Ensure this path matches */}
      </Routes>
    </Router>
  );
}

export default App;
