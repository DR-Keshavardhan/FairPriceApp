import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ButtonPage from './buttonPage';
import KSDistrictPage from './components/kidsynccomponents/jsfiles/KSDistrict.js';
import KSStatePage from './components/kidsynccomponents/jsfiles/KSPage.js';
import Login1 from './components/kidsynccomponents/jsfiles/login1.js';
import UploadExcel from './components/kidsynccomponents/jsfiles/UploadExcel1.js';
import DistrictPage from './components/storemonitorcomponents/DistrictPage.js';
import Login2 from './components/storemonitorcomponents/login2.js';
import ShopPage from './components/storemonitorcomponents/ShopPage.js';
import SMStatePage from './components/storemonitorcomponents/StatePage.js';
import SMTalukPage from './components/storemonitorcomponents/TalukPage.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [role, setRole] = useState(''); // Track the user's selected role

  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<ButtonPage />} />

        {/* Login1 page */}
        <Route 
          path="/login1"
          element={
            isAuthenticated ? (
              role === 'state' ? (
                <Navigate to="/state" />
              ) : role === 'district' ? (
                <Navigate to="/district" />
              ) : role === 'taluk' ? (
                <Navigate to="/taluk" />
              ) : (
                <Navigate to="/shop" />
              )
            ) : (
              <Login1 onLogin={(userRole) => {
                setRole(userRole);
                setIsAuthenticated(true);
              }} />
            )
          }
        />

        {/* Login2 page */}
        <Route 
          path="/login2" 
          element={
            isAuthenticated ? (
              role === 'state' ? (
                <Navigate to="/state" />
              ) : role === 'district' ? (
                <Navigate to="/district" />
              ) : role === 'taluk' ? (
                <Navigate to="/taluk" />
              ) : (
                <Navigate to="/shop" />
              )
            ) : (
              <Login2 onLogin={(userRole) => {
                setRole(userRole);
                setIsAuthenticated(true);
              }} />
            )
          } 
        />

        {/* Role-based routes */}
        <Route path="/state" element={<SMStatePage />} />
        <Route path="/district" element={<DistrictPage />} />
        <Route path="/taluk" element={<SMTalukPage />} />
        <Route path="/shop" element={<ShopPage />} />

        {/* Other pages */}
        <Route path="/ksdistrict" element={<KSDistrictPage />} />
        <Route path="/upload" element={<UploadExcel />} />
        <Route path="/KSPage" element={<KSStatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
