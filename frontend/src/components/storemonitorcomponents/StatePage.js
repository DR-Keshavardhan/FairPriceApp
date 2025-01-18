import axios from "axios";
import Chart from 'chart.js/auto';
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./StatePage.css";


import { useNavigate } from "react-router-dom";

import "material-icons/iconfont/material-icons.css";
import logo from "./tnpds.png";

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
  const [selectedRows, setSelectedRows] = useState({}); 
  const [filterStatus, setFilterStatus] = useState("All");


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
      for (const data of tableData) {
        if(data.status==='Closed' && data.remarks==='NIL'){
        await notify(data.shop_id, data.shop_incharge, data.phone?data.phone:"9360670658");
        }
      }
      
    } catch (error) {
      console.error("Error notifying all shops:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login2", { replace: true });
  };

  const handleCallAll = async () => {
    try {
      for (const data of tableData) {
        if(data.status==='Closed' && data.remarks==='NIL'){
        await call(data.shop_id, data.shop_incharge, data.phone?data.phone:"9360670658");
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
  
  const handleCheckboxChange = (shopCode) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [shopCode]: !prevSelectedRows[shopCode],
    }));
  };


const handleGenerateReport = () => {
  // Filter the data for the report
  const filteredData = tableData.filter(
    (shop) =>
      shop.status === "Closed" &&
      (shop.remarks === "NIL" || shop.remarks === "-")
  );

  if (filteredData.length === 0) {
    alert("No data available to generate the report.");
    return;
  }

  const doc = new jsPDF();
  const totalClosedShops = filteredData.length;

  // Add title and metadata
  doc.setFontSize(18);
  doc.text("Closed Shops Report", 70, 20); // Adjust position
  doc.setFontSize(12);
  doc.text(`District: ${selectedDistrict}`, 14, 40);
  doc.text(`Batch: ${selectedBatch}`, 14, 47);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 54);

  // Add analytics
  doc.setFontSize(12);
  doc.text(`Total Closed Shops: ${totalClosedShops}`, 14, 61);

  // Add a horizontal line separator
  doc.setLineWidth(0.5);
  doc.line(14, 65, 200, 65);

  // Create the canvas for the chart
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;

  const ctx = canvas.getContext("2d");

  // Generate the chart with Chart.js
  const shopNames = filteredData.map((shop) => shop.shop_name);
  const shopCounts = filteredData.map(() => 1); // Replace with relevant data if needed

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: shopNames,
      datasets: [
        {
          label: "Closed Shops",
          data: shopCounts,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false, // Disable responsiveness for consistent rendering
      maintainAspectRatio: false,
    },
  });

  // Wait for the chart to render
  setTimeout(() => {
    const chartImage = canvas.toDataURL("image/png");
    doc.addImage(chartImage, "PNG", 14, 70, 180, 90); // Adjust chart position

    // Add table headers and rows
    const headers = [
      ["Shop Code", "Shop Name", "Incharge", "Number", "Remarks", "Status"],
    ];
    const rows = filteredData.map((shop) => [
      shop.shop_code,
      shop.shop_name,
      shop.shop_incharge,
      shop.incharge_number,
      shop.remarks,
      shop.status,
    ]);

    // Add table to PDF
    doc.autoTable({
      startY: 170, // Adjust startY position after the chart
      head: headers,
      body: rows,
      theme: "grid",
      styles: { fontSize: 10 },
      margin: { top: 10, left: 14, right: 14 },
    });

    // Save the PDF
    doc.save(`Closed_Shops_Report_${selectedDistrict}_${selectedBatch}.pdf`);
  }, 500); // Allow time for the chart to render
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

      const response = await axios.post(
        "http://localhost:5000/SMapi/uploadExcel",
        { data: sheetData }
      );
  
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




  
  const notify=async (shop_id,shop_incharege,phone)=>{
    try {
      const response = await axios.post(
        "http://localhost:5000/SMapi/notify",
        {
          shop_id:shop_id,
          shop_incharege:shop_incharege,
          phone:phone
        }
      );
      if (response.status === 200) {
        alert("Notifications sent to shop incharege successfully.");
      }
    } catch (error) {
      console.error("Error notifying all shops:", error);
    }
  }
  const call=async (shop_id,shop_incharege,phone)=>{
    try {
      const response = await axios.post(
        "http://localhost:5000/SMapi/call",
        {
          shop_id:shop_id,
          shop_incharege:shop_incharege,
          phone:phone
        }
      );
      if (response.status === 200) {
        alert("Notifications sent to shop incharege successfully.");
      }
    } catch (error) {
      console.error("Error notifying all shops:", error);
    }
  }


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
  <label className="header-upload">
    Upload Excel
    <input
      type="file"
      accept=".xlsx, .xls"
      style={{ display: "none" }}
      onChange={handleUploadExcel}
    />
  </label>
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
            <span className="dropdown-icon material-icons">
              arrow_drop_down
            </span>
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
            <button
              className="generate-report-button"
              onClick={handleGenerateReport}
            >
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
                  <th>Taluk</th>
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
                        checked={!!selectedRows[shop.shop_id]}
                        onChange={() => handleCheckboxChange(shop.shop_id)}
                      />
                    </td>
                    <td>{shop.shop_id}</td>
                    <td>{shop.shop_name}</td>
                    <td>{shop.shop_incharge}</td>
                    <td>{shop.email}</td>
                    <td>{shop.opening_time}</td>
                    <td>{shop.district}</td>
                    <td>{shop.taluk}</td>
                    <td>{shop.status}</td>
                    <td>{shop.remarks}</td>
                    <td>{shop.upload_batch}</td>
                    <td>
  {shop.status === "Closed" ? (
    <>
      {shop.remarks === "NIL" || shop.remarks === "-" ? (
        <button
          className="action-button"
          onClick={() =>
            notify(
              shop.id,
              shop.shop_incharge,
              shop.phone ? shop.phone : "9360670658"
            )
          }
        >
          Take Action
        </button>
      ) : (
        <>
          <span>{shop.status}/</span>
          <button
            className="action-button"
            onClick={() =>
              notify(
                shop.id,
                shop.shop_incharge,
                shop.phone ? shop.phone : "9360670658"
              )
            }
          >
            Take Action
          </button>
        </>
      )}
    </>
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
