
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainApp from './App'; // Import the MainApp or app logic component (ensure to rename if necessary)
import ButtonPage from './buttonPage'; // Import the ButtonPage component
import KSStatePage from './components/kidsynccomponents/jsfiles/KSPage.js';
import Login1 from './components/kidsynccomponents/jsfiles/login1.js';
import UploadExcel from './components/kidsynccomponents/jsfiles/UploadExcel1.js'; // Import UploadExcel component
import DistrictPage from './components/storemonitorcomponents/DistrictPage.js'; // Import DistrictPage
import Login2 from './components/storemonitorcomponents/login2.js'; // Import your Login2 component

import ShopPage from './components/storemonitorcomponents/ShopPage.js';
import SMStatePage from './components/storemonitorcomponents/StatePage.js';
import SMTalukPage from './components/storemonitorcomponents/TalukPage.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(fals); 

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
          element={isAuthenticated ? <Navigate to="/upload" /> : <Login1 onLogin={() => setIsAuthenticated(true)} />}
        />

        {/* Route for Login2 page */}
        <Route
          path="/login2"
          element={isAuthenticated ? <Navigate to="/taluk" /> : <Login2 />}
        />
        
        {/* Route for StatePage */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/statepage" /> : <KSStatePage />}
        />      
        
        {/* Route for DistrictPage */}
        <Route
          path="/district"
          element={isAuthenticated ? <Navigate to="/districtpage" /> : <DistrictPage />}
        />

        {/* Route for Upload Excel, Authentication-based route */}
        <Route
          path="/upload"
          element={isAuthenticated ? <UploadExcel /> : <Navigate to="/login2" />}
        />
        
        {/* Main app route */}
        <Route 
          path="/app" 
          element={isAuthenticated ? <MainApp /> : <Navigate to="/login2" />} 
        />
        <Route path="/KSstate" element={<KSStatePage />} />
        
        {/* Role-based routes */}
        <Route path="/state" element={<SMStatePage />} />
        <Route path="/district" element={<DistrictPage />} />
        <Route path="/taluk" element={<SMTalukPage />} />
        <Route path="/shop"element={<ShopPage />}/>
        
        {/* New ShopPage route */}
        {/* <Route path="/shop" element={<ShopPage />} /> New page for shop */}
      </Routes>
    </Router>
  );
}

export default App;
