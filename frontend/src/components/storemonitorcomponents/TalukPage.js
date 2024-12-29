import axios from 'axios'; // Import Axios for HTTP requests
import 'material-icons/iconfont/material-icons.css'; // Import Material Icons
import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import XLSX for Excel file processing
import './talukpage.css'; // Import the CSS for styling
import logo from './tnpds.png'; // Import the logo properly

const TalukPage = () => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const convertTo24HourFormat = (time) => {
    if (typeof time === 'number') {
      const hours = Math.floor(time * 24);
      const minutes = Math.round((time * 24 - hours) * 60);
      return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }
    return time;
  };

  const handleFileUpload = () => {
    if (!file) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const processedData = jsonData.map((row) => {
          if (row.opening_time) {
            row.opening_time = convertTo24HourFormat(row.opening_time);
          }
          if (row.upload_batch) {
            row.upload_batch = convertTo24HourFormat(row.upload_batch);
          }
          return row;
        });

        setExcelData(processedData);
        setErrorMessage('');
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setErrorMessage('Error parsing the file. Please try again.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const sendMessage = async (phone) => {
    const message = "kindly report as soon as possible"; 
    try {
      const response = await axios.post('http://localhost:5000/send-notifications-shopdealer', {
        phone,
        message,
      });
      alert(response.data);
    } catch (error) {
      alert(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  const callIncharge = async (phone) => {
    const message = "kindly report as soon as possible"; 
    try {
      const response = await axios.post('http://localhost:5000/send-calls-shopdealer', {
        phone,
        message,
      });
      alert(response.data);
    } catch (error) {
      alert(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div>
      {/* Top Panel */}
      <div className="top-panel">
        <span className="panel-text">📞 1967 (or) 1800-425-5901</span>
        <button className="panel-button">Translate</button>
      </div>

      {/* Header below the panel */}
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

        {/* Dropdown menu buttons */}
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
      {/* Excel Upload Section */}
      <div className="upload-container">
        <h2 className="title">Upload Excel File</h2>
        <input type="file" onChange={handleFileChange} className="file-input" accept=".xlsx, .xls" />
        <button onClick={handleFileUpload} className="upload-button">
          Upload and View
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {excelData.length > 0 && (
          <div className="table-container">
            <h3 className="subtitle">Uploaded Excel Data</h3>
            <table className="excel-table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                    <td>
                      {row.status === 'Closed' && row.remarks === 'NIL' ? (
                        <div className="action-buttons">
                          <button onClick={() => sendMessage(row['incharge_number'])} className="action-button send">Send Message</button>
                          <button onClick={() => callIncharge(row['incharge_number'])} className="action-button call">Call Incharge</button>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalukPage;
