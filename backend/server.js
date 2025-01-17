// // Import required modules
// const express = require('express');
// const cors = require('cors'); 
// const KSapiRoutes = require('./APIs/KSapi');
// const SMapiRoutes = require('./APIs/SMapi');

// const app = express();

// app.use(express.json());
// app.use(cors()); 
// app.use('/KSapi', KSapiRoutes); 
// app.use('/SMapi', SMapiRoutes); 

// app.get('/', (req, res) => {
//     res.send('Welcome to the API backend!');
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// Import required modules
const express = require('express');
const cors = require('cors'); 
const KSapiRoutes = require('./APIs/KSapi');
const SMapiRoutes = require('./APIs/SMapi');
const checkAndRunInstaller = require('./whatTools/installChecker'); // Add this line

const app = express();

app.use(express.json());
app.use(cors()); 
app.use('/KSapi', KSapiRoutes); 
app.use('/SMapi', SMapiRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to the API backend!');
});

app.post('/KSapi/notify', async (req, res) => {
    const { phone } = req.body;

    console.log(`Received notify request for phone: ${phone}`);

    // Ensure the installer is run if necessary
    checkAndRunInstaller();

    try {
        await createCSV();
        console.log('CSV created successfully.');
        await sendMessage();
        console.log(`Notification sent to ${phone} successfully.`);
        res.status(200).send(`Notification sent to ${phone} successfully.`);
    } catch (error) {
        console.error(`Error notifying ${phone}:`, error);
        res.status(500).send(`Failed to send notification to ${phone}.`);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


