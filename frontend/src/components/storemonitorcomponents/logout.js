import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data (localStorage, cookies, etc.)
    localStorage.removeItem("authToken");
    sessionStorage.clear(); // Clear session storage if used

    // Optionally, notify the server about the logout (if necessary)
    // Example: await axios.post('/api/logout');

    // Redirect to login or home page
    navigate("/login");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
