import React from 'react';
import { Link } from 'react-router-dom'; // Correct import for Link
import './ButtonPage.css'; // Import your CSS for styling

const ButtonPage = () => {
  return (
    <div className="container">
      <div className="welcome-box">
        <div className="welcome-text">Welcome</div>
        <div className="button-container">
          {/* Link to navigate to login1 when Button 1 is clicked */}
          <Link to="/login1">
            <button className="decorative-button">Kidsync</button>
          </Link>

          {/* Link to navigate to login2 when Button 2 is clicked */}
          <Link to="/login2">
            <button className="decorative-button">Fair price</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ButtonPage;
