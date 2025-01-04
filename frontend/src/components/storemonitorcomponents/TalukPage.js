import axios from "axios";
import "material-icons/iconfont/material-icons.css"; // Material icons for styling
import React, { useEffect, useState } from "react";
import "./talukpage.css";
import logo from "./tnpds.png"; // Logo for header

const TalukPage = () => {
  const [taluks] = useState(["Ambattur", "Madhavaram"]); // Static dropdown for taluks
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]); // Static dropdown for batches
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);

  // Fetch data based on taluk and batch
  const fetchTableData = async () => {
    console.log("Fetching table data for taluk:", sessionStorage.getItem('username').split('_')[0], "and batch:", selectedBatch);
    
    try {
      const response = await axios.post(`http://localhost:5000/SMapi/fetchtalukdata`, {
        params: {
          taluk:sessionStorage.getItem('username').split('_')[0],
          batch: selectedBatch,
        },
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Trigger fetch when taluk or batch changes
  useEffect(() => {
    fetchTableData();
  }, [selectedTaluk, selectedBatch]);

  return (
    <main>
      {/* Top Panel */}
      <section className="taluk-top-panel">
        <span className="taluk-panel-text">📞 1967 (or) 1800-425-5901</span>
        <button className="taluk-panel-button">Translate</button>
      </section>

      {/* Header Section */}
      <header className="taluk-page-header">
        <div className="taluk-header-left">
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
        <nav className="taluk-header-right">
          <div className="taluk-dropdown">
            <button className="taluk-dropdown-button">
              <div className="taluk-button-content">
                <span className="material-icons">home</span>
                <span className="taluk-button-text">Home</span>
              </div>
            </button>
          </div>

          <div className="taluk-dropdown">
            <button className="taluk-dropdown-button">
              <div className="taluk-button-content">
                <span className="material-icons">help_outline</span>
                <span className="taluk-button-text">FAQ</span>
              </div>
            </button>
          </div>
        </nav>
      </header>
      <section className="taluk-page-content">
        <h2 className="taluk-page-title">Taluk Page</h2>

         <div className="taluk-dropdown-container">
          <label htmlFor="taluk-select">Select Taluk:</label>
          <select
            id="taluk-select"
            value={selectedTaluk}
            onChange={(e) => {
              setSelectedTaluk(e.target.value);
              setSelectedBatch(""); // Reset batch when taluk changes
            }}
          >
            <option value="">-- Select Taluk --</option>
            {taluks.map((taluk, index) => (
              <option key={index} value={taluk}>
                {taluk}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Button (appears after selecting Taluk) */}
        {selectedTaluk && (
          <div className="taluk-button-container">
            <button className="taluk-upload-button">
              Upload Data
            </button>
          </div>
        )}

        {/* Dropdown for Batch */}
       
          <div className="taluk-batch-container">
            <label htmlFor="taluk-batch-select">Select Batch:</label>
            <select
              id="taluk-batch-select"
              value={selectedBatch}
              onChange={(e) =>{
                 setSelectedBatch(e.target.value)
                 fetchTableData();}

              }
            >
              <option value="">-- Select Batch --</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
        

        {/* Button Container (only shows after selecting Batch) */}
        <div className="taluk-button-container">
          {selectedBatch && (
            <>
              <button className="taluk-message-button">
                Send Message
              </button>
              <button className="taluk-call-button">
                Call Incharge
              </button>
            </>
          )}
        </div>

        {/* Table Display */}
        {selectedBatch && tableData.length > 0 && (
          <div className="taluk-table-container">
            <table className="taluk-data-table">
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
                          <button className="taluk-message-button">
                            Send Message
                          </button>
                          <button className="taluk-call-button">
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
          <p className="taluk-no-data">No data available for the selected taluk and batch.</p>
        )}
      </section>
    </main>
  );
};

export default TalukPage;
