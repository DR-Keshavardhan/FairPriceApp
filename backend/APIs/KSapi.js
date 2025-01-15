const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('../DataBase/db');
const xlsx = require('xlsx');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const pdfkit = require('pdfkit');
const fs = require('fs');
const { exec } = require('child_process');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

router.use(bodyParser.json());

const accountSid = 'AC3ef333278f3108e82ddc4b925ed4a22d';
const authToken = '3fd0b085da326e009668653b7ec0064e';
const twilioPhoneNumber = '+12184844803';
const client = twilio(accountSid, authToken);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const csvFilePath = path.resolve('C:/SeleniumApp/Data/data.csv');

function writeToCsv(contact, message) {
    const fileExists = fs.existsSync(csvFilePath);

    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'contact', title: 'CONTACT' },
            { id: 'message', title: 'MESSAGE' },
        ],
        append: fileExists,
    });

    const data = [{ contact: contact, message: message }];

    csvWriter
        .writeRecords(data)
        .then(() => {
            console.log('Data written to CSV successfully.');
            callApplication();
        })
        .catch((error) => {
            console.error('Error writing to CSV:', error);
        });
}

function callApplication() {
    const appCommand = '/resources/SeleniumApp.exe';

    exec(appCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }

        console.log(`Application output: ${stdout}`);
    });
}

router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body);
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'SELECT * FROM KSadmin WHERE username = ? AND role = ? AND password = ?';
    db.query(query, [username, role, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username, password, or role' });
        }

        return res.json({ role });
    });
});

router.post('/notify-all', async (req, res) => {
    const { district, message } = req.body;

    if (!district || !message) {
        return res.status(400).json({ message: 'District and message are required' });
    }

    const query = 'SELECT phone FROM kidsync WHERE district = ?';
    db.query(query, [district], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        for (const { phone } of results) {
            try {
                await client.messages.create({
                    body: message,
                    from: twilioPhoneNumber,
                    to: phone,
                });
            } catch (error) {
                console.error(`Error notifying phone ${phone}:`, error);
            }
        }

        res.json({ message: 'Notifications sent successfully.' });
    });
});

router.post('/call-all', async (req, res) => {
    const { district } = req.body;

    if (!district) {
        return res.status(400).json({ message: 'District is required' });
    }

    const query = 'SELECT phone FROM kidsync WHERE district = ?';
    db.query(query, [district], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        for (const { phone } of results) {
            try {
                await client.calls.create({
                    twiml: '<Response><Say>Kindly report as early as possible</Say></Response>',
                    to: phone,
                    from: twilioPhoneNumber,
                });
            } catch (error) {
                console.error(`Error calling phone ${phone}:`, error);
            }
        }

        res.json({ message: 'Calls initiated successfully.' });
    });
});

router.post('/fetchdata', (req, res) => {
    console.log('Fetch data request received');
    const { selectedDistrict } = req.body;

    if (!selectedDistrict) {
        return res.status(400).json({ message: 'District is required' });
    }

    const query = 'SELECT * FROM kidsync WHERE district = ?';
    db.query(query, [selectedDistrict], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

router.post('/generate-report', async (req, res) => {
    try {
        const query = 'SELECT * FROM kidsync';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const doc = new pdfkit();
            const filePath = './reports/detailed_report.pdf';

            doc.pipe(fs.createWriteStream(filePath));
            doc.fontSize(18).text('Detailed Report for Shops:', { align: 'center' });

            results.forEach((row, index) => {
                doc.fontSize(12).text(`${index + 1}. Shop ID: ${row.shop_id}, Name: ${row.shop_name}, District: ${row.district}, Taluk: ${row.taluk}`);
            });

            doc.end();

            transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: process.env.SENDER_MAIL,
                subject: 'Daily Report for Shops',
                text: 'Please find the attached detailed report.',
                attachments: [{ filename: 'detailed_report.pdf', path: filePath }],
            }, (err, info) => {
                if (err) {
                    console.error('Error sending email:', err);
                    return res.status(500).json({ message: 'Error sending email' });
                }
                res.json({ message: 'Report generated and sent successfully.' });
            });
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
});

router.post("/upload-excel", (req, res) => {
    const excelData = req.body;
  
    try {
      // Process the Excel data (save to database, validate, etc.)
      console.log("Received Excel data:", excelData);
  
      excelData.forEach((row) => {
        const query = "INSERT INTO your_table (column1, column2) VALUES (?, ?)";
        db.query(query, [row.column1, row.column2], (err) => {
          if (err) console.error("Database error:", err);
        });
      });
  
      res.status(200).json({ message: "Excel data processed successfully." });
    } catch (error) {
      console.error("Error processing Excel data:", error);
      res.status(500).json({ message: "Failed to process Excel data." });
    }
  });


router.post('/notify', async (req, res) => {
    const { shop_id } = req.body;
  
    try {
      // Fetch shop details by ID (you can query the database if needed)
      const query = 'SELECT phone FROM SMdata WHERE shop_id = ?';
      db.query(query, [shop_id], async (err, results) => {
        if (err || results.length === 0) {
          return res.status(404).json({ message: 'Shop not found' });
        }
  
        const phone = results[0].phone;
        await client.messages.create({
          body: 'Notification message',
          from: twilioPhoneNumber,
          to: phone,
        });
  
        res.status(200).json({ message: 'Notification sent successfully' });
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ message: 'Error sending notification' });
    }
  });
  
  router.post('/call', async (req, res) => {
    const { shop_id } = req.body;
  
    try {
      const query = 'SELECT phone FROM SMdata WHERE shop_id = ?';
      db.query(query, [shop_id], async (err, results) => {
        if (err || results.length === 0) {
          return res.status(404).json({ message: 'Shop not found' });
        }
  
        const phone = results[0].phone;
        await client.calls.create({
          twiml: '<Response><Say>Kindly report as early as possible</Say></Response>',
          from: twilioPhoneNumber,
          to: phone,
        });
  
        res.status(200).json({ message: 'Call initiated successfully' });
      });
    } catch (error) {
      console.error('Error initiating call:', error);
      res.status(500).json({ message: 'Error initiating call' });
    }
  });
  
module.exports = router;
