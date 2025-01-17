const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Example data fetching function (replace with actual database query)
async function fetchData() {
    return [
        { number: '7904939875', message: 'Hello, this is a test message.' },
        // Add more data
    ];
}

async function createCSV() {
    const data = await fetchData();
    const csvWriter = createCsvWriter({
        path: "C:/WeWha/SeleniumApp/Data/data.csv",
        header: [
            { id: 'number', title: 'number' },
            { id: 'message', title: 'message' },
        ],
    });

    await csvWriter.writeRecords(data);
    console.log('CSV file created successfully.');
}

module.exports = createCSV;
