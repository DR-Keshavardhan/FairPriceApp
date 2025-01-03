// Import necessary modules
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

const csvFilePath = path.resolve('C:/SeleniumApp/Data/data.csv');

// ✅ Utility Function: Write to CSV
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

// ✅ Utility Function: Call External Application
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

    const query = 'SELECT * FROM KSadmin WHERE username = ? AND role = ? and password = ?'; ;
    db.query(query, [username, role,password], async (err, results) => {
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

router.post('/send-notifications', async (req, res) => {
    const { phone, message } = req.body;

    try {
        await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phone,
        });

        await client.calls.create({
            twiml: `<Response><Say>Your response here</Say></Response>`,
            to: phone,
            from: twilioPhoneNumber,
        });

        res.status(200).send('Notification sent (SMS and Call)!');
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).send(`Error sending notifications: ${error.message}`);
    }
});

// ✅ Endpoint: Send SMS Notifications (Shop Dealer)
router.post('/send-notifications-shopdealer', async (req, res) => {
    const { phone, message } = req.body;

    try {
        await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phone,
        });

        res.status(200).send('Notification sent (SMS)!');
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).send(`Error sending notifications: ${error.message}`);
    }
});

// ✅ Endpoint: Send Call Notifications (Shop Dealer)
router.post('/send-calls-shopdealer', async (req, res) => {
    const { phone } = req.body;

    try {
        await client.calls.create({
            twiml: `<Response><Say>Kindly report as early as possible</Say></Response>`,
            to: phone,
            from: twilioPhoneNumber,
        });

        res.status(200).send('Notification sent (Call)!');
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).send(`Error sending notifications: ${error.message}`);
    }
});

// ✅ Endpoint: Send WhatsApp Notification
router.post('/send-whatsapp-notification', (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).send('Contact and message are required.');
    }

    writeToCsv(phone, message);
    res.status(200).send('Notification request received.');
});

// Export Router
module.exports = router;
