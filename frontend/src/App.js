import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainApp from './App';
import ButtonPage from './buttonPage';
import KSDistrictPage from './components/kidsynccomponents/jsfiles/KSDistrict.js'; // Import the new page
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
  const [role, setRole] = useState(''); // State to store the selected role

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
          element={
            role === 'district' ? (
              <Navigate to="/ksdistrict" /> // Navigate to KSDistrictPage if "district" role is selected
            ) : (
              <Login1 onLogin={(selectedRole) => setRole(selectedRole)} />
            )
          }
        />
        

        {/* Route for Login2 page */}
        <Route
          path="/login2"
          element={isAuthenticated ? <Navigate to="/taluk" /> : <Login2 />}
        />
        
        {/* Route for StatePage */}
        <Route
          path="/login1"
          element={isAuthenticated ? <Navigate to="/statepage" /> : <KSStatePage />}
        />      
        
        {/* Route for DistrictPage */}
        <Route
          path="/district"
          element={isAuthenticated ? <Navigate to="/districtpage" /> : <KSDistrictPage />}
        />

        {/* Route for KSSdistrict */}
        <Route 
          path="/ksdistrict" 
          element={isAuthenticated  ? <KSDistrictPage /> : <Navigate to="/login1" />} 
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
        <Route path="/KSPage" element={<KSStatePage />} />
        
        {/* Role-based routes */}
        <Route path="/state" element={<SMStatePage />} />
        <Route path="/district" element={<DistrictPage />} />
        <Route path="/taluk" element={<SMTalukPage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </Router>
  );
}

export default App;