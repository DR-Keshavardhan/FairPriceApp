import axios from "axios";
import "material-icons/iconfont/material-icons.css"; 
import React, { useEffect, useState } from "react";
import "./talukpage.css";
import logo from "./tnpds.png"; 
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
const TalukPage = () => {
  const [taluks] = useState(["Ambattur", "Madhavaram"]); 
  const [batches] = useState(["10:00:00", "10:30:00", "11:00:00"]); 
  const [selectedTaluk, setSelectedTaluk] =  useState(
      sessionStorage.getItem("username").split("_")[0] || ""
  );
  const [selectedBatch, setSelectedBatch] = useState("");
  const [tableData, setTableData] = useState([]);

  const fetchTableData = async () => {
    try {
      console.log(selectedTaluk);
      const response = await axios.post(
        "http://localhost:5000/SMapi/fetchtalukdata",
        {
          taluk:selectedTaluk,
          batch:selectedBatch
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
        if (data.status === "Closed" && data.remarks === "NIL") {
          await notify(data.shop_id, data.shop_incharge, data.phone || "9360670658");
        }
      }
    } catch (error) {
      console.error("Error notifying all shops:", error);
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
      console.error("Error calling all incharges:", error);
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

  const handleGenerateReport = () => {
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

    doc.setFontSize(18);
    doc.text("Closed Shops Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`District: ${selectedTaluk}`, 14, 30);
    doc.text(`Batch: ${selectedBatch}`, 14, 37);

    const headers = [
      ["Shop Code", "Shop Name", "Incharge", "Email", "Remarks", "Status"],
    ];
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

    doc.save(`Closed_Shops_Report_${selectedTaluk}_${selectedBatch}.pdf`);
  };

  const notify = async (shop_id, shop_incharge, phone) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/SMapi/notify",
        { shop_id, shop_incharge, phone }
      );
      if (response.status === 200) {
        console.log(`Notification sent to ${shop_incharge}`);
      }
    } catch (error) {
      console.error(`Error notifying shop: ${shop_id}`, error);
    }
  };

  const call = async (shop_id, shop_incharge, phone) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/SMapi/call",
        { shop_id, shop_incharge, phone }
      );
      if (response.status === 200) {
        console.log(`Call initiated to ${shop_incharge}`);
      }
    } catch (error) {
      console.error(`Error calling shop: ${shop_id}`, error);
    }
  };

  return (
    <main>
      <section className="taluk-top-panel">
        <span className="taluk-panel-text">📞 1967 (or) 1800-425-5901</span>
        <button className="taluk-panel-button">Translate</button>
      </section>
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
        <nav className="taluk-header-right">
          <div className="taluk-dropdown">
            <button className="taluk-dropdown-button">
              <div className="taluk-button-content">
                <span className="taluk-button-text">
                  <input type="file" accept=".xlsx" onChange={handleUploadExcel} />
                  Upload Excel
                </span>
              </div>
            </button>
          </div>
          <div className="taluk-dropdown">
            <button className="taluk-dropdown-button">
              <div className="taluk-button-content">
                <span className="taluk-button-text">Log Out</span>
              </div>
            </button>
          </div>
        </nav>
      </header>
      <section className="taluk-page-content">
        <h2 className="taluk-page-title">Taluk Page</h2>

        <div className="taluk-batch-container">
          <label htmlFor="taluk-batch-select">Select Batch:</label>
          <select
            id="taluk-batch-select"
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

        <div className="taluk-button-container">
          {selectedBatch && (
            <>
              <button className="taluk-message-button" onClick={handleNotifyAll}>
                Send Message
              </button>
              <button className="taluk-call-button" onClick={handleCallAll}>
                Call Incharge
              </button>
              <button className="taluk-call-button" onClick={handleGenerateReport}>
                Generate Report
              </button>
            </>
          )}
        </div>

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
                          <button
                            className="taluk-message-button"
                            onClick={() => notify(shop.shop_id, shop.shop_incharge, shop.phone || "9360670658")}
                          >
                            Send Message
                          </button>
                          <button
                            className="taluk-call-button"
                            onClick={() => call(shop.shop_id, shop.shop_incharge, shop.phone || "9360670658")}
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
        {selectedBatch && tableData.length === 0 && (
          <p className="taluk-no-data">No data available for the selected taluk and batch.</p>
        )}
      </section>
    </main>
  );
};
export default TalukPage;
