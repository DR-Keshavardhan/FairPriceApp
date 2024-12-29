import axios from "axios";
import "material-icons/iconfont/material-icons.css"; // Material icons for styling
import React, { useEffect, useState } from "react";
import "./DistrictPage.css";
import logo from "./tnpds.png"; // Logo for header

const DistrictPage = () => {
  const [districts] = useState(["Thiruvallur", "Chennai"]); // Static dropdown for districts
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]); // Static dropdown for batches
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);

  // Fetch data based on district and batch
  const fetchTableData = async () => {
    if (!selectedDistrict || !selectedBatch) return; // Ensure both are selected
    try {
      const response = await axios.get(`http://localhost:5000/api/district-data`, {
        params: {
          district: selectedDistrict,
          batch: selectedBatch,
        },
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Trigger fetch when district or batch changes
  useEffect(() => {
    fetchTableData();
  }, [selectedDistrict, selectedBatch]);

  // Handle Notify All functionality
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
    <div>
      {/* Top Panel */}
      <div className="top-panel">
        <span className="panel-text">📞 1967 (or) 1800-425-5901</span>
        <button className="panel-button">Translate</button>
      </div>

      {/* Header Section */}
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

        {/* Header Dropdown Menus */}
        <div className="header-right">
          <div className="dropdown">
            <button className="dropdown-button">
              <div className="button-content">
                <span className="material-icons">home</span>
                <span className="button-text">Home</span>
              </div>
            </button>
            <div className="dropdown-content">
              <a href="#">Option 1</a>
              <a href="#">Option 2</a>
              <a href="#">Option 3</a>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropdown-button">
              <div className="button-content">
                <span className="material-icons">cloud_upload</span>
                <span className="button-text">Data Upload</span>
              </div>
            </button>
            <div className="dropdown-content">
              <a href="#">Feature X</a>
              <a href="#">Feature Y</a>
              <a href="#">Feature Z</a>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropdown-button">
              <div className="button-content">
                <span className="material-icons">help_outline</span>
                <span className="button-text">FAQ</span>
              </div>
            </button>
            <div className="dropdown-content">
              <a href="#">Option A</a>
              <a href="#">Option B</a>
              <a href="#">Option C</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="district-page">
        <h2 className="d">District Page</h2>

        {/* Dropdown for District */}
        
        <div className="dropdown-container">
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
        {selectedDistrict && (
          <div className="dropdown-container">
            <label htmlFor="batch-select">Select Batch:</label>
            <select
              id="batch-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
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

        {/* "Notify All" and "Call All" Buttons */}
        {selectedBatch && (
          <div className="button-container">
            <button className="notify-all-button" onClick={handleNotifyAll}>
              Notify All
            </button>
            <button className="call-all-button" onClick={handleCallAll}>
              Call All
            </button>
          </div>
        )}

        {/* Table Display */}
        {selectedBatch && tableData.length > 0 && (
          <div className="table-container">
            <table className="district-table">
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
                      {shop.status === "Closed" &&
                      (shop.remarks === "NIL" || shop.remarks === "-") ? (
                        <>
                          <button
                            className="message-button"
                            /*OnCLick to send message*/
                          >
                            Send Message
                          </button>
                          <button
                            className="call-button"
                            /*on click to all the customers*/
                          >
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
          <p>No data available for the selected district and batch.</p>
        )}
      </div>
    </div>
  );
};

export default DistrictPage;
