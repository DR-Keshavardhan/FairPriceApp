import React, { useEffect, useState } from "react";
import axios from "axios";
import "./KSPage.css";
import { useNavigate } from "react-router-dom";

import "material-icons/iconfont/material-icons.css"; // Material icons
import logo from "./tnpds.png"; // Logo for header

const StatePage = () => {
  const navigate = useNavigate();

  const [states] = useState(["Tamil Nadu", "Kerala"]);
  const [districts] = useState([
    "Chennai",
    "Tiruvannamalai",
    "Vellore",
    "Thiruvallur",
  ]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({}); // State to track selected rows

  const fetchTableData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/SMapi/fetchdata",
        {
          selectedDistrict,
        }
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleNotifyAll = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/notify-all",
        {
          district: selectedDistrict,
        }
      );
      if (response.status === 200) {
        alert("Notifications sent to all shops successfully.");
      }
    } catch (error) {
      console.error("Error notifying all shops:", error);
    }
  };

  const handleLogout = () => {
    // Clear user authentication data (localStorage, cookies, etc.)
    localStorage.removeItem("authToken");
    sessionStorage.clear(); // Clear session storage if used

    // Redirect to login or home page
    navigate("/login2", { replace: true });
  };

  const handleCallAll = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/call-all",
        {
          district: selectedDistrict,
        }
      );
      if (response.status === 200) {
        alert("Calls initiated to all shops successfully.");
      }
    } catch (error) {
      console.error("Error calling all shops:", error);
    }
  };

  const handleCheckboxChange = (shopCode) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [shopCode]: !prevSelectedRows[shopCode], // Toggle the selection
    }));
  };

  const handleUploadExcel = () => {
    // Placeholder for Excel upload functionality
    alert("Upload Excel functionality not implemented yet.");
  };

  const handleGenerateReport = () => {
    // Placeholder for report generation functionality
    alert("Generate Report functionality not implemented yet.");
  };

  return (
    <div>
      <div className="top-panel">
        <span className="panel-text">📞 1967 (or) 1800-425-5901</span>
        <div className="panel-buttons">
          <button className="panel-button">Translate</button>
        </div>
      </div>

      <header className="page-header">
        <div className="header-left">
          <img src={logo} alt="Tamil Nadu Government Logo" />
          <div>
            <p>
              OFFICIAL WEBSITE OF CIVIL SUPPLIES AND CONSUMER PROTECTION
              DEPARTMENT, GOVERNMENT OF TAMILNADU
            </p>
            <h1>PUBLIC DISTRIBUTION SYSTEM</h1>
          </div>
        </div>
        <div className="header-right">
          <button className="header-upload" onClick={handleUploadExcel}>
            Upload Excel
          </button>
          <button className="header-logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="state-page">
        <h2 className="page-title"></h2>

        <div className="dropdown-container">
          <label htmlFor="district-select" className="dropdown-label">
            Select District:
          </label>
          <div className="dropdown-wrapper">
            <select
              id="district-select"
              className="custom-dropdown"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setTableData([]); // Clear table data on district change
              }}
            >
              <option value="">-- Select District --</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <span className="dropdown-icon material-icons">arrow_drop_down</span>
          </div>
        </div>

        {selectedDistrict && (
          <div className="button-container">
            <button className="notify-all-button" onClick={handleNotifyAll}>
              Notify All
            </button>
            <button className="call-all-button" onClick={handleCallAll}>
              Call All
            </button>
            <button className="generate-report-button" onClick={handleGenerateReport}>
              Generate Report
            </button>
          </div>
        )}

        {selectedDistrict && tableData.length > 0 && (
          <div className="table-container">
            <table className="state-table">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>RC Number</th>
                  <th>Shop No</th>
                  <th>Taluk</th>
                  <th>District</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Family Head Name</th>
                  <th>Mobile Number</th>
                  <th>Aadhaar Status</th>
                  <th>Aadhaar Linkage Status</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((member, index) => (
                  <tr key={index}>
                    <td>{member.member_id}</td>
                    <td>{member.rc_number}</td>
                    <td>{member.shop_no}</td>
                    <td>{member.taluk}</td>
                    <td>{member.district}</td>
                    <td>{member.name}</td>
                    <td>{member.gender}</td>
                    <td>{member.date_of_birth}</td>
                    <td>{member.family_head_name}</td>
                    <td>{member.mobile_number}</td>
                    <td>{member.aadhaar_status}</td>
                    <td>{member.aadhaar_linkage_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedDistrict && tableData.length === 0 && (
          <p>No data available for the selected district.</p>
        )}
      </div>
    </div>
  );
};

export default StatePage;
