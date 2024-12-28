const mysql = require('mysql2');
require('dotenv').config({ path: '../id.env' });

const connection = mysql.createConnection({
  host: 'buro3wnchwujbbuvv4vl-mysql.services.clever-cloud.com',
  user: 'ufnwy2l0xwc5rcmu',
  password: 'tLGO0fyUkhTocE4YN8jF',
  database:'buro3wnchwujbbuvv4vl',
  port:3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the MySQL database!');
});

module.exports = connection;
