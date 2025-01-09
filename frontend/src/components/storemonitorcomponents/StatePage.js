import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StatePage.css";
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
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({}); // State to track selected rows

  /*const calltoone=(number)=>{
    if(!number) return;
    try{
      const response=await.get(`http://localhost:5000/SMapi/call`,{
          number
        }
      )
    } 
    catch(error){
      console.log(error);
    }
}*/
  const fetchTableData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/SMapi/fetchdata",
        {
          selectedDistrict,
          selectedBatch,
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
          batch: selectedBatch,
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

    // Optionally, notify the server about the logout (if necessary)
    // Example: await axios.post('/api/logout');

    // Redirect to login or home page
    navigate("/login2", {replace: true});
  };
  
  const handleCallAll = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/call-all",
        {
          district: selectedDistrict,
          batch: selectedBatch,
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
        <button className="header-upload" onClick={handleUploadExcel}>Upload Excel</button>
        <button className="header-logout" onClick={handleLogout}>Log Out</button>

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
                setSelectedBatch("");
                setTableData([]);
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
          <div className="dropdown-container">
            <label htmlFor="batch-select" className="dropdown-label">
              Select Batch:
            </label>
            <select
              id="batch-select"
              className="custom-dropdown"
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                fetchTableData();
              }}
            >
              <option value="">-- Select Batch --</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBatch && (
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

        {selectedBatch && tableData.length > 0 && (
          <div className="table-container">
            <table className="state-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Shop Code</th>
                  <th>Shop Name</th>
                  <th>Incharge</th>
                  <th>Email</th>
                  <th>Opening Time</th>
                  <th>District</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Batch</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((shop, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!selectedRows[shop.shop_code]}
                        onChange={() => handleCheckboxChange(shop.shop_code)}
                      />
                    </td>
                    <td>{shop.shop_code}</td>
                    <td>{shop.shop_name}</td>
                    <td>{shop.shop_incharge}</td>
                    <td>{shop.email}</td>
                    <td>{shop.opening_time}</td>
                    <td>{shop.district}</td>
                    <td>{shop.status}</td>
                    <td>{shop.remarks}</td>
                    <td>{shop.upload_batch}</td>
                    <td>
                      {shop.status === "Closed" &&
                      (shop.remarks === "NIL" || shop.remarks === "-") ? (
                        <button className="action-button">Take Action</button>
                      ) : (
                        <span>{shop.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedBatch && tableData.length === 0 && (
          <p>No data available for the selected district and batch.</p>
        )}
      </div>
    </div>
  );
};

export default StatePage;
