const db = require('./db.js');
const sql = require('mysql2');
const xlsx = require('xlsx');

const createSchema = () => {
    const query = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(55) NOT NULL,
        password VARCHAR(55) NOT NULL,
        role VARCHAR(55) NOT NULL
    )`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Table created successfully");
    });
};

const createSchemaforFPtableAuth = () => {
    const query = `CREATE TABLE IF NOT EXISTS FPusers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(55) NOT NULL,
        password VARCHAR(55) NOT NULL,
        role VARCHAR(55) NOT NULL
    )`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Table created successfully");
    });
};

const deleteEntireTable = (tablename) => {
    const query = `DROP TABLE ${tablename}`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Table deleted successfully");
    });
};

const createSchemaforFPtable = () => {
    const query = `CREATE TABLE Shop (
        shop_id INT AUTO_INCREMENT PRIMARY KEY,
        shop_name VARCHAR(255) NOT NULL,
        shop_incharge VARCHAR(255) NOT NULL,
        incharge_number VARCHAR(15) NOT NULL,
        email VARCHAR(255),
        formattedOpeningTime TIME NOT NULL,
        status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
        remarks TEXT,
        formattedUploadBatch DATETIME NOT NULL,
        taluk VARCHAR(255),
        district VARCHAR(255)
    )`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Table created successfully");
    });
};



const workbook = xlsx.readFile('KidSync_data.xlsx'); 
const sheetName = workbook.SheetNames[0]; 
const worksheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(worksheet);

const insertdatatookidsync = () => {
  const query = `INSERT INTO kidsync 
    (shop_no, taluk, district, name, gender, dob, family_head, mobile_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  data.forEach((row) => {
    const values = [
      row['Shop No'],          
      row['Taluk'],            
      row['District'],         
      row['Name'],             
      row['Gender'],           
      new Date(row['Date of Birth']),             
      row['Family Head Name'],     
      row['Mobile Number'],   
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return;
      }
      console.log('Data inserted:', result.insertId);
    });
  });
};

const insertDataTOFPUser = () => {
    const query = `INSERT INTO users (email, username, password, role) VALUES
    ('ram@gmail.com', 'state_admin', 'ram123', 'state'), 
    ('mani@gmial.com', 'chennai_district', 'mani123', 'district'),
    ('ragavi@gmail.com', 'madurai_district', 'ragavi123', 'district'),
    ('arvika@gmail.com', 'coimbatore_taluk', 'arvika123', 'taluk'),
    ('jeya@gmail.com', 'tirunelveli_taluk', 'jeya123', 'taluk')`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Inserted successfully");
    });
};


const insertData = () => {
    const query = `INSERT INTO users (email, username, password, role) VALUES
    ('ram@gmail.com', 'state_admin', 'ram123', 'state'), 
    ('mani@gmial.com', 'chennai_district', 'mani123', 'district'),
    ('ragavi@gmail.com', 'madurai_district', 'ragavi123', 'district'),
    ('arvika@gmail.com', 'coimbatore_taluk', 'arvika123', 'taluk'),
    ('jeya@gmail.com', 'tirunelveli_taluk', 'jeya123', 'taluk')`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Inserted successfully");
    });
};

const createtableforkidsync=()=>{
    const query=`CREATE TABLE kidsync (
        id INT AUTO_INCREMENT PRIMARY KEY,
        shop_no VARCHAR(100) NOT NULL,
        taluk VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        dob DATE NOT NULL,
        family_head VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(15) NOT NULL,
        aadhaar_status int default 0,
        aadhaar_linkage_status int default 0,
        number_of_reminder_sent int default 0,
        numbdr_of_call_made int default 0 );`
    db.query(query,(err,result)=>{
        if(err) throw err;
        console.log("table created for kidsync");
    })
    
}

const createtableformonitor=()=>{
    const query=`create table shopmonitorstates(

    )`
}

// createtableforkidsync();
// insertdatatookidsync();
// createSchema();
// createSchemaforFPtable();
// insertData();
// deleteEntireTable('ShopDetails');
// createSchemaforFPtableAuth();
// insertDataTOFPUser();