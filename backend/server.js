// Import required modules
const express = require('express');
const cors = require('cors'); 
const KSapiRoutes = require('./APIs/KSapi');
const SMapiRoutes = require('./APIs/SMapi');

const app = express();

app.use(express.json());
app.use(cors()); 
app.use('/KSapi', KSapiRoutes); 
app.use('/SMapi', SMapiRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to the API backend!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

