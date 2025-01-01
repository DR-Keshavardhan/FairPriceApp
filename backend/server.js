// Import required modules
const express = require('express');
const cors = require('cors'); // Ensure CORS is imported
const KSapiRoutes = require('./KSapi');
const SMapiRoutes = require('./SMapi');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/KSapi', KSapiRoutes); // Mount KSapi routes on /KSapi
app.use('/SMapi', SMapiRoutes); // Mount SMapi routes on /SMapi

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API backend!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

