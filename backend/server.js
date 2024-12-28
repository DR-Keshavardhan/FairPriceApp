const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const { exec } = require('child_process');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./api');

const PORT = process.env.PORT || 5000;
const accountSid = 'AC3ef333278f3108e82ddc4b925ed4a22d';
const authToken = '3fd0b085da326e009668653b7ec0064e';
const twilioPhoneNumber = '+12184844803';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Path to the CSV file
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

// Function to call the application
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

// Twilio client
const client = twilio(accountSid, authToken);

// Routes
app.use('/api', apiRoutes);

// Endpoint for sending SMS and call notifications
app.post('/send-notifications', async (req, res) => {
    const { phone, message } = req.body;

    try {
        // Send SMS
        await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phone,
        });

        // Make Call
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

app.post('/send-notifications-shopdealer', async (req, res) => {
    const { phone, message } = req.body;

    try {
        // Send SMS
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

app.post('/send-calls-shopdealer', async (req, res) => {
    const { phone, message } = req.body;

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

app.post('/send-whatsapp-notification', (req, res) => {
    const { phone, message } = req.body;


    if (!phone || !message) {
        return res.status(400).send('Contact and message are required.');
    }

    writeToCsv(phone, message);
    res.status(200).send('Notification request received.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
