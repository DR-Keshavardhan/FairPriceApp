const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('../DataBase/db');
const xlsx = require('xlsx');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const pdfkit = require('pdfkit');
const fs = require('fs');
require('dotenv').config({ path: '../id.env' });

// Middleware for file uploads
const upload = multer({ dest: 'uploads/' }).single('file');

// ---------------------------
// Utility Functions
// ---------------------------
function convertTo24HourFormat(time) {
  if (typeof time === 'number') {
    const hours = Math.floor(time * 24);
    const minutes = Math.round((time * 24 - hours) * 60);
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:00`;
  }

  if (typeof time === 'string') {
    const [timePart, modifier] = time.split(' ');
    if (!timePart || !modifier) throw new Error(`Invalid time format: ${time}`);
    let [hours, minutes] = timePart.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}:00`;
  }

  throw new Error(`Invalid time format: ${time}`);
}

const calculatePoints = (status, remarks) => {
  let points = 0;
  if (status.toLowerCase() === 'open') points += 10;
  if (status.toLowerCase() === 'closed') {
    points += (remarks === 'NIL' || remarks === '' || remarks === '-') ? -3 : 3;
  }
  return points;
};

// ---------------------------
// Authentication Routes
// ---------------------------
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }

  try {
    const query = 'SELECT * FROM users WHERE username = ? AND role = ? AND password = ?';
    const [results] = await db.promise().query(query, [username, role, password]);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ role });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------------------------
// Shop Status Update Route
// ---------------------------
router.post('/api/updateShopStatus', (req, res) => {
  const { shopId, status, remarks } = req.body;
  db.query(
    "UPDATE Shops SET status = ?, remarks = ? WHERE shop_id = ?",
    [status, remarks, shopId],
    (err) => {
      if (err) return res.status(500).send(err.message);
      res.send("Shop status updated.");
    }
  );
});

// ---------------------------
// File Upload & Processing Route
// ---------------------------
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      for (const row of data) {
        const {
          shop_id,
          shop_name,
          shop_incharge,
          incharge_number,
          email,
          opening_time,
          status,
          remarks,
          upload_batch,
          taluk,
          district
        } = row;

        const formattedOpeningTime = convertTo24HourFormat(opening_time);
        const formattedUploadBatch = convertTo24HourFormat(upload_batch);

        await db.promise().query(
          'INSERT INTO shops (shop_code, shop_name, shop_incharge, incharge_number, email, opening_time, status, remarks, upload_batch, taluk, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [shop_id, shop_name, shop_incharge, incharge_number, email, formattedOpeningTime, status, remarks, formattedUploadBatch, taluk, district]
        );

        const points = calculatePoints(status, remarks);
        await db.promise().query(
          `INSERT INTO shoppoints (shop_code, shop_name, taluk, district, points, upload_batch) VALUES (?, ?, ?, ?, ?, ?)`,
          [shop_id, shop_name, taluk, district, points, upload_batch]
        );
      }

      res.json({ message: 'File uploaded and data stored successfully' });
    } catch (error) {
      console.error('Error processing file:', error.message);
      res.status(500).json({ message: 'Error processing file', error: error.message });
    }
  });
});

// ---------------------------
// Notification Routes
// ---------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

router.post('/notify-shop/:shopId', async (req, res) => {
  const shopId = parseInt(req.params.shopId);
  try {
    const [shop] = await db.promise().query('SELECT * FROM shops WHERE shop_code = ?', [shopId]);
    if (shop.length === 0) return res.status(404).json({ error: 'Shop not found' });

    const shopDetails = shop[0];
    const formattedNumber = `+91${shopDetails.incharge_number}`;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.SENDER_MAIL,
      subject: 'Shop Status Alert',
      text: `Shop ${shopDetails.shop_name} in ${shopDetails.taluk} is closed. Please check the status.`
    });

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error in notify-shop:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------
// Report Generation
// ---------------------------
router.post('/generate-report', async (req, res) => {
  try {
    const doc = new pdfkit();
    const filePath = './reports/detailed_report.pdf';
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(18).text('Detailed Report for Closed Shops:', { align: 'center' });
    doc.end();

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.SENDER_MAIL,
      subject: 'Daily Report for Closed Shops',
      text: 'Please find the attached detailed report.',
      attachments: [{ filename: 'detailed_report.pdf', path: filePath }]
    });

    res.json({ message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

module.exports = router;
