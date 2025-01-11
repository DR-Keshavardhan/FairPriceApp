import axios from "axios";
import "material-icons/iconfont/material-icons.css"; 
import React, { useEffect, useState } from "react";
import "./KSDistrict.css";
import logo from "./tnpds.png"; 

const KSDistrictPage = () => {
  const [districts] = useState(["Thiruvallur", "Chennai"]); 
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);

  const fetchTableData = async () => {
    console.log("Fetching table data for:", selectedDistrict, selectedBatch);
    
    try {
      const response = await axios.post('http://localhost:5000/SMapi/fetchdata', {
        taluk: sessionStorage.getItem('username').split('_')[0], selectedBatch
      });
      setTableData(response.data);
    
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleNotifyAll = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/notify-all`, {
        district: selectedDistrict,
        batch: selectedBatch,
      });
      if (response.status === 200) {
        console.log("Notifications sent to all shops successfully");
      }
    } catch (error) {
      console.log("Error in notifying all shops:", error);
    }
  };

  // Handle Call All functionality
  const handleCallAll = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/call-all`, {
        district: selectedDistrict,
        batch: selectedBatch,
      });
      if (response.status === 200) {
        console.log("Calls initiated to all shops successfully");
      }
    } catch (error) {
      console.error("Error in calling all shops:", error);
    }
  };

  return (
    <main>
      {/* Top Panel */}
      <section className="Ksdistrict-top-panel">
        <span className="Ksdistrict-panel-text">📞 1967 (or) 1800-425-5901</span>
        <button className="Ksdistrict-panel-button">Translate</button>
      </section>

      {/* Header Section */}
      <header className="Ksdistrict-page-header">
        <div className="Ksdistrict-header-left">
          <img src={logo} alt="Tamil Nadu Government Logo" />
          <div>
            <p>
              OFFICIAL WEBSITE OF CIVIL SUPPLIES AND CONSUMER PROTECTION
              DEPARTMENT, GOVERNMENT OF TAMILNADU
            </p>
            <h1>PUBLIC DISTRIBUTION SYSTEM</h1>
          </div>
        </div>

        {/* Header Dropdown Menus */}
        <nav className="Ksdistrict-header-right">
          <div className="Ksdistrict-dropdown">
            <button className="Ksdistrict-dropdown-button">
              <div className="Ksdistrict-button-content">
                <span className="material-icons">cloud_upload</span>
                <span className="Ksdistrict-button-text">Data Upload</span>
              </div>
            </button>
            <div className="Ksdistrict-dropdown-content">
              <a href="#">Feature X</a>
              <a href="#">Feature Y</a>
              <a href="#">Feature Z</a>
            </div>
          </div>

          <div className="Ksdistrict-dropdown">
            <button className="Ksdistrict-dropdown-button">
              <div className="Ksdistrict-button-content">
                <span className="Ksdistrict-button-text">Log Out</span>
              </div>
            </button>
            <div className="Ksdistrict-dropdown-content">
              <a href="#">Option A</a>
              <a href="#">Option B</a>
              <a href="#">Option C</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <section className="Ksdistrict-page-content">
        <h2 className="Ksdistrict-page-title">District Page</h2>

        {/* Select District */}
        <div className="Ksdistrict-dropdown-container">
          <label htmlFor="district-select">Select District:</label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedBatch(""); // Reset batch when district changes
            }}
          >
            <option value="">-- Select District --</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Batch */}
        <div className="Ksdistrict-batch-container">
          <label htmlFor="district-batch-select">Select Batch:</label>
          <select
            id="district-batch-select"
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

        {/* "Notify All" and "Call All" Buttons */}
        {selectedBatch && (
          <div className="Ksdistrict-action-buttons">
            <button className="Ksdistrict-notify-all-button" onClick={handleNotifyAll}>
              Notify All
            </button>
            <button className="Ksdistrict-call-all-button" onClick={handleCallAll}>
              Call All
            </button>
            <button className="Ksdistrict-call-all-button" onClick={handleCallAll}>
              Generate Report
            </button>
          </div>
        )}

        {/* Table Display */}
        {selectedBatch && tableData.length > 0 && (
          <div className="Ksdistrict-table-container">
            <table className="Ksdistrict-data-table">
              <thead>
                <tr>
                  <th>Shop Code</th>
                  <th>Shop Name</th>
                  <th>Incharge</th>
                  <th>Email</th>
                  <th>Opening Time</th>
                  <th>Taluk</th>
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
                    <td>{shop.shop_code}</td>
                    <td>{shop.shop_name}</td>
                    <td>{shop.shop_incharge}</td>
                    <td>{shop.email}</td>
                    <td>{shop.opening_time}</td>
                    <td>{shop.taluk}</td>
                    <td>{shop.district}</td>
                    <td>{shop.status}</td>
                    <td>{shop.remarks}</td>
                    <td>{shop.upload_batch}</td>
                    <td>
                      {shop.status === "Closed" && (shop.remarks === "NIL" || shop.remarks === "-") ? (
                        <>
                          <button className="Ksdistrict-message-button">
                            Send Message
                          </button>
                          <button className="Ksdistrict-call-button">
                            Call Incharge
                          </button>
                        </>
                      ) : shop.status === "Open" ? (
                        <span>Opened</span>
                      ) : (
                        <span>{shop.remarks}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No data message */}
        {selectedBatch && tableData.length === 0 && (
          <p className="Ksdistrict-no-data">No data available for the selected district and batch.</p>
        )}
      </section>
    </main>
  );
};

export default KSDistrictPage;
