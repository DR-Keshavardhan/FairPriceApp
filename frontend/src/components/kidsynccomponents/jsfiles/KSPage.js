import React, { useEffect, useState } from "react";
import axios from "axios";
import "./KSPage.css";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import "material-icons/iconfont/material-icons.css"; // Material icons
import logo from "./tnpds.png"; // Logo for header]
import { translatePage } from "../../../translate";

const StatePage = () => {
  const shop_id = "";
  const navigate = useNavigate();

  const [states] = useState(["Tamil Nadu", "Kerala"]);
  const [districts] = useState([
    "Chennai",
    "Tiruvannamalai",
    "Vellore",
    "Thiruvallur",
  ]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({}); // State to track selected rows

  // Fetch table data from KSapi based on the selected district
  const fetchTableData = async () => {
    if (!selectedDistrict) return; // Avoid API call if no district is selected

    try {
      const response = await axios.post(
        "http://localhost:5000/KSapi/fetchdata",
        { selectedDistrict }
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleNotifyAll = async () => {
    if (!selectedDistrict) {
      alert("Please select a district first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/KSapi/notify-all",
        { district: selectedDistrict }
      );
      if (response.status === 200) {
        alert("Notifications sent to all shops successfully.");
      }
    } catch (error) {
      console.error("Error notifying all shops:", error);
    }
  };

  const handleCallAll = async () => {
    if (!selectedDistrict) {
      alert("Please select a district first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/KSapi/call-all",
        { district: selectedDistrict }
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

  const handleUploadExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
  
    try {
      // Read the file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
  
      // Convert the first sheet to JSON
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
  
      // Send JSON data to backend
      const response = await axios.post("http://localhost:5000/KSapi/upload-excel", jsonData);
      if (response.status === 200) {
        alert("Excel file uploaded and processed successfully.");
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      alert("Failed to upload Excel file.");
    }
  };


  const handleGenerateReport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/KSapi/generate-report", {
        responseType: "blob", // Expect a file
      });
  
      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.xlsx"); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
      alert("Report generated and downloaded successfully.");
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
  };
  


  // const handleNotifyIndividual = async (phone) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/KSapi/notify",
  //       { phone }
  //     );
  //     if (response.status === 200) {
  //       alert(`Notification sent to Shop ID ${shop_id} successfully.`);
  //     }
  //   } catch (error) {
  //     console.error(`Error notifying Shop ID ${shop_id}:`, error);
  //   }
  // };


  const handleNotifyIndividual = async (phone) => {
    try {
        console.log("Hello");
        const response = await axios.post(
            "http://localhost:5000/KSapi/notify",
            { phone }
        );
        if (response.status === 200) {
            alert(`Notification sent to ${phone} successfully.`);
        }
    } catch (error) {
        console.error(`Error notifying ${phone}`, error);
        alert(`Failed to send notification to ${phone}.`);
    }
};


  const handleCallIndividual = async (phone) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/KSapi/call",
        { phone }
      );
      if (response.status === 200) {
        alert(`Call initiated to Shop ID ${shop_id} successfully.`);
      }
    } catch (error) {
      console.error(`Error calling Shop ID ${shop_id}:`, error);
    }
  };
  const googleTranslateElementInit = () => {
    console.log("Initializing Google Translate...");
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,ta",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
  
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    addScript.onload = () => console.log("Google Translate script loaded successfully.");
    addScript.onerror = () => console.error("Failed to load Google Translate script.");
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);
  
  
  const handleTranslate = () => { 
    console.log("Translating...");
    translatePage('ta');
  };
  

  useEffect(() => {
    if (selectedDistrict) {
      fetchTableData();
    }
  }, [selectedDistrict]);



  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/login2", { replace: true });
  };

  useEffect(() => {
    if (selectedDistrict) {
      fetchTableData();
    }
  }, [selectedDistrict]);

  return (
    <div>
      <div className="top-panel">
        <span className="panel-text">📞 1967 (or) 1800-425-5901</span>
        <div className="panel-buttons">
          <div id="google_translate_element" style={{ display: 'none' }}></div>
        <button className="panel-button" onClick={handleTranslate}>Translate</button>
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
          <button className="header-upload" onClick={handleUploadExcel}>
            Upload Excel
          </button>
          <button className="header-logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="state-page">
        <h2 className="page-title">Select a District to View Data</h2>

        <div className="dropdown-container">
          <label htmlFor="district-select" className="dropdown-label">
            Select District:
          </label>
          <div className="dropdown-wrapper">
            <select
              id="district-select"
              className="custom-dropdown"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
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
          <div className="button-container">
            <button className="notify-all-button" onClick={handleNotifyAll}>
              Notify All
            </button>
            <button className="call-all-button" onClick={handleCallAll}>
              Call All
            </button>
            <button
              className="generate-report-button"
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
        )}

        {selectedDistrict && tableData.length > 0 && (
          <div className="table-container">
            <table className="state-table">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Shop No</th>
                  <th>Taluk</th>
                  <th>District</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Family Head Name</th>
                  <th>Mobile Number</th>
                  <th>Aadhaar Status</th>
                  <th>Aadhaar Linkage Status</th>
                  <th>call</th>
                  <th>notify</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((member, index) => (
                  <tr key={index}>
                    <td>{member.id}</td>
                    <td>{member.shop_no}</td>
                    <td>{member.taluk}</td>
                    <td>{member.district}</td>
                    <td>{member.name}</td>
                    <td>{member.gender}</td>
                    <td>{member.dob}</td>
                    <td>{member.family_head}</td>
                    <td>{member.mobile_number}</td>
                    <td>{member.aadhaar_status}</td>
                    <td>{member.aadhaar_linkage_status}</td>
                    <td>
                      <button
                        onClick={() => handleCallIndividual(member.mobile_number)}
                      >
                        Call
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleNotifyIndividual(member.mobile_number)}
                      >
                        Notify
                      </button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedDistrict && tableData.length === 0 && (
          <p>No data available for the selected district.</p>
        )}
      </div>
    </div>
  );
};

export default StatePage;
