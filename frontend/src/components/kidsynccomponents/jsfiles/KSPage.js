import axios from "axios";
import "material-icons/iconfont/material-icons.css"; 
import React, { useEffect, useState } from "react";
import "frontend/src/components/kidsynccomponents/cssfiles/KSPage.css"
const logo="frontend/src/components/kidsynccomponents/tnpds.png" 
const StatePage = () => {
  const [states] = useState(["Tamil Nadu", "Kerala", "Karnataka"]); 
  const [districts, setDistricts] = useState(["Chenn"]);
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]); 
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);

  const fetchDistricts = async (state) => {
    if (!state) {
      setDistricts([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/districts`, {
        params: { state },
      });
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Fetch data based on state, district, and batch
  const fetchTableData = async () => {
    if (!selectedState || !selectedDistrict || !selectedBatch) return; // Ensure all are selected
    try {
      const response = await axios.get(`http://localhost:5000/api/state-data`, {
        params: {
          state: selectedState,
          district: selectedDistrict,
          batch: selectedBatch,
        },
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Handle Notify All functionality
  const handleNotifyAll = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/notify-all`, {
        state: selectedState,
        district: selectedDistrict,
        batch: selectedBatch,
      });
      if (response.status === 200) {
        console.log("Notifications sent to all shops successfully");
      }
    } catch (error) {
      console.error("Error in notifying all shops:", error);
    }
  };

  // Handle Call All functionality
  const handleCallAll = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/call-all`, {
        state: selectedState,
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

  // Update districts when state changes
  useEffect(() => {
    fetchDistricts(selectedState);
    setSelectedDistrict("");
    setSelectedBatch("");
  }, [selectedState]);

  // Update table data when selection changes
  useEffect(() => {
    fetchTableData();
  }, [selectedState, selectedDistrict, selectedBatch]);

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
      </header>

      {/* Main Content */}
      <div className="state-page">
        <h2 className="page-title">State Page</h2>

        {/* Dropdown for State */}
        <div className="dropdown-container">
          <label htmlFor="state-select" className="dropdown-label">
            Select State:
          </label>
          <div className="dropdown-wrapper">
            <select
              id="state-select"
              className="custom-dropdown"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">-- Select State --</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <span className="dropdown-icon material-icons">arrow_drop_down</span>
          </div>
        </div>

        {/* Dropdown for District */}
        {selectedState && (
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
              <span className="dropdown-icon material-icons">arrow_drop_down</span>
            </div>
          </div>
        )}

        {/* Dropdown for Batch */}
        {selectedDistrict && (
          <div className="dropdown-container">
            <label htmlFor="batch-select" className="dropdown-label">
              Select Batch:
            </label>
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
            <table className="state-table">
              <thead>
                <tr>
                  <th>Shop Code</th>
                  <th>Shop Name</th>
                  <th>Incharge</th>
                  <th>Email</th>
                  <th>Opening Time</th>
                  <th>District</th>
                  <th>State</th>
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
                    <td>{shop.district}</td>
                    <td>{shop.state}</td>
                    <td>{shop.status}</td>
                    <td>{shop.remarks}</td>
                    <td>{shop.upload_batch}</td>
                    <td>
                      {shop.status === "Closed" &&
                      (shop.remarks === "NIL" || shop.remarks === "-") ? (
                        <button className="action-button">Take Action</button>
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
          <p>No data available for the selected state, district, and batch.</p>
        )}
      </div>
    </div>
  );
};

export default StatePage;
