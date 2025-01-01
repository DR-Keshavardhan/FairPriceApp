import axios from "axios";
import "material-icons/iconfont/material-icons.css"; // Material icons for styling
import React, { useEffect, useState } from "react";
import "./shop.css"; // Import the corresponding CSS file
import logo from "./tnpds.png"; // Logo for header

const ShopPage = () => {
  const [shops] = useState(["Shop A", "Shop B"]); // Static dropdown for shops
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]); // Static dropdown for batches
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);

  // Fetch data based on shop and batch
  const fetchTableData = async () => {
    if (!selectedShop || !selectedBatch) return; // Ensure both are selected
    try {
      const response = await axios.get(`http://localhost:5000/api/shop-data`, {
        params: {
          shop: selectedShop,
          batch: selectedBatch,
        },
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Trigger fetch when shop or batch changes
  useEffect(() => {
    fetchTableData();
  }, [selectedShop, selectedBatch]);

  return (
    <main>
      {/* Top Panel */}
      <section className="shop-top-panel">
        <span className="shop-panel-text">📞 1967 (or) 1800-425-5901</span>
        <button className="shop-panel-button">Translate</button>
      </section>

      {/* Header Section */}
      <header className="shop-page-header">
        <div className="shop-header-left">
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
        <nav className="shop-header-right">
          <div className="shop-dropdown">
            <button className="shop-dropdown-button">
              <div className="shop-button-content">
                <span className="material-icons">home</span>
                <span className="shop-button-text">Home</span>
              </div>
            </button>
          </div>

          <div className="shop-dropdown">
            <button className="shop-dropdown-button">
              <div className="shop-button-content">
                <span className="material-icons">help_outline</span>
                <span className="shop-button-text">FAQ</span>
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <section className="shop-page-content">
        <h2 className="shop-page-title">Shop Page</h2>

        {/* Dropdown for Shop */}
        <div className="shop-dropdown-container">
          <label htmlFor="shop-select">Select Shop:</label>
          <select
            id="shop-select"
            value={selectedShop}
            onChange={(e) => {
              setSelectedShop(e.target.value);
              setSelectedBatch(""); // Reset batch when shop changes
            }}
          >
            <option value="">-- Select Shop --</option>
            {shops.map((shop, index) => (
              <option key={index} value={shop}>
                {shop}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Batch */}
        {selectedShop && (
          <div className="shop-batch-container">
            <label htmlFor="shop-batch-select">Select Batch:</label>
            <select
              id="shop-batch-select"
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

        {/* Button Container */}
        <div className="shop-button-container">
          {selectedBatch && (
            <>
              <button className="shop-message-button">Send Message</button>
              <button className="shop-call-button">Call Incharge</button>
              <button className="shop-upload-button">Upload Data</button>
            </>
          )}
        </div>

        {/* Table Display */}
        {selectedBatch && tableData.length > 0 && (
          <div className="shop-table-container">
            <table className="shop-data-table">
              <thead>
                <tr>
                  <th>Shop Code</th>
                  <th>Shop Name</th>
                  <th>Incharge</th>
                  <th>Email</th>
                  <th>Opening Time</th>
                  <th>Shop</th>
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
                    <td>{shop.shop}</td>
                    <td>{shop.status}</td>
                    <td>{shop.remarks}</td>
                    <td>{shop.upload_batch}</td>
                    <td>
                      {shop.status === "Closed" && (
                        <>
                          <button className="shop-message-button">
                            Send Message
                          </button>
                          <button className="shop-call-button">
                            Call Incharge
                          </button>
                        </>
                      )}
                      {shop.status === "Open" && <span>Opened</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No data message */}
        {selectedBatch && tableData.length === 0 && (
          <p className="shop-no-data">No data available for the selected shop and batch.</p>
        )}
      </section>
    </main>
  );
};

export default ShopPage;
