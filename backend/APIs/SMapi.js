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
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
require('dotenv').config({ path: '../id.env' });

const accountSid = 'AC3ef333278f3108e82ddc4b925ed4a22d';
const authToken = '3fd0b085da326e009668653b7ec0064e';
const twilioPhoneNumber = '+12184844803';
const client = twilio(accountSid, authToken);
router.use(cors());
router.use(express.json());
router.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' }).single('file');

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

// router.post('/send-notifications-shopdealer', async (req, res) => {
//     const { phone, message } = req.body;

//     try {
//         await client.messages.create({
//             body: message,
//             from: twilioPhoneNumber,
//             to: phone,
//         });

//         res.status(200).send('Notification sent (SMS)!');
//     } catch (error) {
//         console.error('Error sending notifications:', error);
//         res.status(500).send(`Error sending notifications: ${error.message}`);
//     }
// });


// app.post("/uploadExcel", (req, res) => {
//     const { data } = req.body;
  
//     // Process the data (e.g., save it to the database)
//     console.log("Received Excel data:", data);
  
//     // Respond to the client
//     res.status(200).send({ message: "Excel data processed successfully." });
//   });
  

// router.post('/send-calls-shopdealer', async (req, res) => {
//     const { phone } = req.body;

//     try {
//         await client.calls.create({
//             twiml: '<Response><Say>Kindly report as early as possible</Say></Response>',
//             to: phone,
//             from: twilioPhoneNumber,
//         });

//         res.status(200).send('Notification sent (Call)!');
//     } catch (error) {
//         console.error('Error sending notifications:', error);
//         res.status(500).send(`Error sending notifications: ${error.message}`);
//     }
// });

router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'SELECT * FROM SMadmin WHERE username = ? AND role = ? AND password = ?';
    db.query(query, [username, role, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or role' });
        }

        return res.json({ role: role });
    });
});

router.post('/notify', async (req, res) => {
  const {shop_id,shop_incharge,phone}=req.body;
  console.log("call came", shop_incharge);
  try {
    await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: phone,
    });

  return res.json({ shop_id:shop_id });
  } catch (error) {
      console.error('Error generating report',error);
      return res.json({ shop_id:shop_id });
  }
});

router.post('/call', async (req, res) => {
    const {shop_id,shop_incharge,phone}=req.body;
    console.log("call came", shop_incharge);
    try {
      await client.calls.create({
        twiml: '<Response><Say>Kindly report as early as possible</Say></Response>',
        to: phone,
        from: twilioPhoneNumber,
    });
    return res.json({ shop_id:shop_id });
    } catch (error) {
        console.error('Error generating report',error);
        return res.json({ shop_id:shop_id });
    }
  });

  
router.post('/fetchdata', async (req, res) => {
    console.log('fetch data');
    const { selectedDistrict,batch } = req.body;
    console.log(selectedDistrict,'hello');
    const query = 'SELECT * FROM SMdata WHERE district = ?';
    db.query(query, [selectedDistrict], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});
router.post('/fetchtalukdata', async (req, res) => {
    const  taluk=req.body.taluk;
    const batch  = req.body.batch;
    console.log("hello taluk",taluk,batch);
    const query = 'SELECT * FROM SMdata WHERE LOWER(taluk) = LOWER(?)';
    db.query(query, [taluk], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('hi',results);
        return res.json(results);
    });

});


router.post('/uploadExcel', async (req, res) => {
    console.log("Received request to upload Excel data");
    const data = req.body.data;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty data received' });
    }

    try {
        const query = `
            INSERT INTO SMdata (
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
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                shop_name = VALUES(shop_name),
                shop_incharge = VALUES(shop_incharge),
                incharge_number = VALUES(incharge_number),
                email = VALUES(email),
                opening_time = VALUES(opening_time),
                status = VALUES(status),
                remarks = VALUES(remarks),
                upload_batch = VALUES(upload_batch),
                taluk = VALUES(taluk),
                district = VALUES(district);
        `;

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

            const values = [
                shop_id,
                shop_name,
                shop_incharge,
                incharge_number,
                email,
                formattedOpeningTime,
                status,
                remarks,
                formattedUploadBatch,
                taluk,
                district
            ];

             db.query(query, values, (err, result) => {
                if (err) {
                  console.error('Error inserting data:', err);
                  return;
                }
                console.log('Data inserted:', result);
              });
        }

        return res.json({ message: 'File uploaded and data stored successfully' });
    } catch (error) {
        console.error('Error processing file:', error.message);
        return res.status(500).json({ message: 'Error processing file', error: error.message });
    }
});


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
        console.error('Error generating report');
    }
  });
  
  module.exports=router;