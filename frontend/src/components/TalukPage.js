import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './UploadExcel.css';
import axios from 'axios'; 
const UploadExcel = () => {
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

  const sendMessage = async(phone) => {
    
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
  

  const callIncharge = async(phone) => {
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
  );
};

export default UploadExcel;