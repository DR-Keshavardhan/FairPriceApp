import React, { useState } from 'react'; 
import 'frontend/src/components/kidsynccomponents/cssfiles/UploadExcel1.css';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf'; 
import 'jspdf-autotable'; 
import axios from 'axios';

function UploadExcel1({ userIdentifier, userType }) { 
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [notificationType, setNotificationType] = useState('both');

  const filterData = (data, identifier, userType) => {
    switch(userType) {
      case 'shop': 
        return data.filter(row => row['Shop No'] === identifier);
      case 'taluk': 
        return data.filter(row => row['Taluk'] === identifier);
      case 'district': 
        return data.filter(row => row['District'] === identifier);
      default:
        return data;
    }
  };

  const handleFileUpload = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    
    if (!file) {
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
      if (!sheet) {
        setLoading(false);
        return;
      }
      
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      
      if (!jsonData || jsonData.length === 0) {
        setLoading(false);
        return;
      }

      const filteredData = jsonData.filter(row => 
        row['Aadhaar Status'] === 'Not Available' || 
        row['Aadhaar Linkage Status'] === 'Not Linked'
      );
      
      const filteredByUser = filterData(filteredData, userIdentifier, userType);
      setFileData(filteredByUser); 
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleSendNotification = async (phone,dob,name,gender) => {
    const pronoun = gender === "male" ? "his" : "her";
    const message=`Dear citizen, Your child ${name}, born on ${dob}, will turn 5 years old within the next month. Please ensure that the Aadhaar card is created before ${pronoun} 5th birthday.`;
    try {
      const response = await axios.post('http://localhost:5000/send-notifications', {
        phone,
        dob,
        name,
        gender,
        message,
      });
      const response1 = await axios.post('http://localhost:5000/send-whatsapp-notification', {
        phone,
        message
      });

      alert(response.data);
    } catch (error) {
      alert(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  const handleSendNotificationToAll = async () => {
    if (!Array.isArray(fileData)) return;

    for (const row of fileData) {
      const phone = row['Mobile Number'];
      const dob=row['Date of Birth'];
      const name=row['Name'];
      const gender=row['Gender'];
      await handleSendNotification(phone,dob,name,gender);
    }
    
  };

  const handleSendNotificationToSelected = async () => {
    if (!Array.isArray(fileData)) return;

    const phonesToNotify = selectedRecipients.map(index => fileData[index]['Mobile Number']);
    for (const phone of phonesToNotify) {
      await handleSendNotification(phone);
    }
  };

  const handleRecipientSelection = (index) => {
    if (selectedRecipients.includes(index)) {
      setSelectedRecipients(selectedRecipients.filter(item => item !== index));
    } else {
      setSelectedRecipients([...selectedRecipients, index]);
    }
  };

  const handleDownloadPDF = () => {
    if (!Array.isArray(fileData)) return;

    const doc = new jsPDF();
    
    const tableColumns = [
      'Shop No', 'Taluk', 'District', 'Name', 'Gender', 
      'DOB', 'Family Head', 'Mobile Number', 'Aadhaar Status', 'Aadhaar Linkage Status'
    ];

    const tableData = fileData.map(row => [
      row['Shop No'], row['Taluk'], row['District'], row['Name'], row['Gender'], 
      row['Date of Birth'], row['Family Head Name'], row['Mobile Number'], 
      row['Aadhaar Status'], row['Aadhaar Linkage Status']
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      margin: { top: 20 },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 2,
        halign: 'center',
      },
    });

    doc.save('aadhaar_data.pdf');
  };

  return (
    <div className="upload-container">
      <h1>Upload Excel File</h1>
      
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="upload-input" />
      {loading && <div className="loading">Loading...</div>}

      <div className="notification-type">
        <h3>Select Notification Type</h3>
        <label>
          <input 
            type="radio" 
            value="message" 
            checked={notificationType === 'message'} 
            onChange={() => setNotificationType('message')} 
          />
          Send Message Only
        </label>
        <label>
          <input 
            type="radio" 
            value="call" 
            checked={notificationType === 'call'} 
            onChange={() => setNotificationType('call')} 
          />
          Send Call Only
        </label>
        <label>
          <input 
            type="radio" 
            value="both" 
            checked={notificationType === 'both'} 
            onChange={() => setNotificationType('both')} 
          />
          Send Both Message and Call
        </label>
      </div>

      {Array.isArray(fileData) && fileData.length > 0 && (
        <div className="table-container">
          <table className="file-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Shop No</th>
                <th>Taluk</th>
                <th>District</th>
                <th>Name</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Family Head</th>
                <th>Mobile Number</th>
                <th>Aadhaar Status</th>
                <th>Aadhaar Linkage Status</th>
                <th>Send Notification</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(index)}
                      onChange={() => handleRecipientSelection(index)}
                    />
                  </td>
                  <td>{row['Shop No']}</td>
                  <td>{row['Taluk']}</td>
                  <td>{row['District']}</td>
                  <td>{row['Name']}</td>
                  <td>{row['Gender']}</td>
                  <td>{row['Date of Birth']}</td>
                  <td>{row['Family Head Name']}</td>
                  <td>{row['Mobile Number']}</td>
                  <td>{row['Aadhaar Status']}</td>
                  <td>{row['Aadhaar Linkage Status']}</td>
                  <td>
                    <button className="notify-btn" onClick={() => handleSendNotification(row['Mobile Number'],row['Date of Birth'],row['Name'],row['Gender'])}>Send</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="button-group">
        <button className="send-selected-btn" onClick={handleSendNotificationToAll}>Send Notifications to All</button>
        <button className="send-selected-btn" onClick={handleSendNotificationToSelected}>Send Notifications to Selected</button>
        <button className="download-pdf-btn" onClick={handleDownloadPDF}>
          Download Report
        </button>
      </div>
    </div>
  );
}

export default UploadExcel1;
