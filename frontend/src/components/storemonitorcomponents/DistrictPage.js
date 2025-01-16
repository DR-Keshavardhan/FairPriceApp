import axios from "axios";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "material-icons/iconfont/material-icons.css";
import React, { useEffect, useState } from "react";
import "./DistrictPage.css";
import logo from "./tnpds.png";

const DistrictPage = () => {
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]);
  const [selectedDistrict, setSelectedDistrict] = useState(
    sessionStorage.getItem("username").split("_")[0] || ""
  );
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchTableData = async () => {
    if (!selectedBatch) {
      console.warn("No batch selected, skipping fetch.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/SMapi/fetchdata", {
        selectedDistrict,
        selectedBatch,
      });
      setTableData(response.data);
      console.log("Table data fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleNotifyAll = async () => {
    try {
      for (const data of tableData) {
        if (data.status === "Closed" && data.remarks === "NIL") {
          await notify(data.shop_id, data.shop_incharge, data.phone || "9360670658");
        }
      }
    } catch (error) {
      console.error("Error notifying all shops:", error);

    }
  };
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === "Closed" || status === "Open") {
      const filteredData = [...tableData].sort((a, b) => {
        if (a.status === status && b.status !== status) return -1;
        if (a.status !== status && b.status === status) return 1;
        return 0;
      });
      setTableData(filteredData);
    } else {
      fetchTableData(); // Reset to original order
    }
  };

  const handleCallAll = async () => {
    try {
      for (const data of tableData) {
        if (data.status === "Closed" && data.remarks === "NIL") {
          await call(data.shop_id, data.shop_incharge, data.phone || "9360670658");
        }
      }
    } catch (error) {
      console.error("Error calling all shops:", error);
    }
  };

  const handleUploadExcel = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please select an Excel file to upload.");
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log("Excel data:", sheetData);

      const response = await axios.post("http://localhost:5000/SMapi/uploadExcel", {
        data: sheetData,
      });

      if (response.status === 200) {
        alert("Excel file uploaded and processed successfully.");
      } else {
        alert("Failed to upload Excel file.");
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      alert("An error occurred while processing the Excel file.");
    }
  };

  const handleGenerateReport = () => {
    const filteredData = tableData.filter(
      (shop) => shop.status === "Closed" && (shop.remarks === "NIL" || shop.remarks === "-")
    );

    if (filteredData.length === 0) {
      alert("No data available to generate the report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Closed Shops Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`District: ${selectedDistrict}`, 14, 30);
    doc.text(`Batch: ${selectedBatch}`, 14, 37);

    const headers = [["Shop Code", "Shop Name", "Incharge", "Email", "Remarks", "Status"]];
    const rows = filteredData.map((shop) => [
      shop.shop_code,
      shop.shop_name,
      shop.shop_incharge,
      shop.email,
      shop.remarks,
      shop.status,
    ]);

    doc.autoTable({
      startY: 45,
      head: headers,
      body: rows,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    doc.save(`Closed_Shops_Report_${selectedDistrict}_${selectedBatch}.pdf`);
  };

  const notify = async (shop_id, shop_incharge, phone) => {
    try {
      const response = await axios.post("http://localhost:5000/SMapi/notify", {
        shop_id,
        shop_incharge,
        phone,
      });
      if (response.status === 200) {
        alert(`Notification sent to ${shop_incharge} successfully.`);
      }
    } catch (error) {
      console.error("Error notifying shop:", error);
    }
  };

  const call = async (shop_id, shop_incharge, phone) => {
    try {
      const response = await axios.post("http://localhost:5000/SMapi/call", {
        shop_id,
        shop_incharge,
        phone,
      });
      if (response.status === 200) {
        alert(`Called ${shop_incharge} successfully.`);
      }
    } catch (error) {
      console.error("Error calling shop:", error);
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
        <nav className="district-header-right">
          <label className="district-file-upload">
            <span className="material-icons">cloud_upload</span>
            <input type="file" accept=".xlsx, .xls" onChange={handleUploadExcel} />
            <span>Data Upload</span>
          </label>
          <button className="district-dropdown-button">Log Out</button>
        </nav>
      </header>

      {/* Main Content */}
      <section className="district-page-content">
        <h2 className="district-page-title">District Page</h2>
        <div className="district-batch-container">
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
        {selectedBatch && (
          <div className="district-action-buttons">
            <button onClick={handleNotifyAll}>Notify All</button>
            <button onClick={handleCallAll}>Call All</button>
            <button onClick={handleGenerateReport}>Generate Report</button>
          </div>
        )}
        {selectedBatch && tableData.length > 0 ? (
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
                          <button
                            onClick={() => notify(shop.shop_id, shop.shop_incharge, shop.phone || "9360670658")}
                          >
                            Send Message
                          </button>
                          <button
                            onClick={() => call(shop.shop_id, shop.shop_incharge, shop.phone || "9360670658")}
                          >
                            Call Incharge
                          </button>
                          <div className="filter-container">
              <label htmlFor="filter-select" className="filter-label">
                Filter:
              </label>
              <select
                id="filter-select"
                className="custom-dropdown"
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Closed">Closed</option>
                <option value="Open">Open</option>
              </select>
            </div>
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
        ) : (
          selectedBatch && <p className="district-no-data">No data available for the selected batch.</p>
        )}
      </section>
    </main>
  );
};

export default DistrictPage;
