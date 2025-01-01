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
    <main>
      {/* Top Panel */}
      <section className="district-top-panel">
        <span className="district-panel-text">📞 1967 (or) 1800-425-5901</span>
        <button className="district-panel-button">Translate</button>
      </section>

      {/* Header Section */}
      <header className="district-page-header">
        <div className="district-header-left">
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
        <nav className="district-header-right">
          <div className="district-dropdown">
            <button className="district-dropdown-button">
              <div className="district-button-content">
                <span className="material-icons">home</span>
                <span className="district-button-text">Home</span>
              </div>
            </button>
            <div className="district-dropdown-content">
              <a href="#">Option 1</a>
              <a href="#">Option 2</a>
              <a href="#">Option 3</a>
            </div>
          </div>

          <div className="district-dropdown">
            <button className="district-dropdown-button">
              <div className="district-button-content">
                <span className="material-icons">cloud_upload</span>
                <span className="district-button-text">Data Upload</span>
              </div>
            </button>
            <div className="district-dropdown-content">
              <a href="#">Feature X</a>
              <a href="#">Feature Y</a>
              <a href="#">Feature Z</a>
            </div>
          </div>

          <div className="district-dropdown">
            <button className="district-dropdown-button">
              <div className="district-button-content">
                <span className="material-icons">help_outline</span>
                <span className="district-button-text">FAQ</span>
              </div>
            </button>
            <div className="district-dropdown-content">
              <a href="#">Option A</a>
              <a href="#">Option B</a>
              <a href="#">Option C</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <section className="district-page-content">
        <h2 className="district-page-title">District Page</h2>

        {/* Dropdown for District */}
        <div className="district-dropdown-container">
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
          <div className="district-batch-container">
            <label htmlFor="district-batch-select">Select Batch:</label>
            <select
              id="district-batch-select"
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

        {selectedDistrict && (
          <div className="district-upload-button-container">
            <button className="district-upload-button">Data Upload</button>
          </div>
        )}

        {/* "Notify All" and "Call All" Buttons */}
        {selectedBatch && (
          <div className="district-action-buttons">
            <button className="district-notify-all-button" onClick={handleNotifyAll}>
              Notify All
            </button>
            <button className="district-call-all-button" onClick={handleCallAll}>
              Call All
            </button>
          </div>
        )}

        {/* Table Display */}
        {selectedBatch && tableData.length > 0 && (
          <div className="district-table-container">
            <table className="district-data-table">
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
                          <button className="district-message-button">
                            Send Message
                          </button>
                          <button className="district-call-button">
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
          <p className="district-no-data">No data available for the selected district and batch.</p>
        )}
      </section>
    </main>
  );
};

export default DistrictPage;
