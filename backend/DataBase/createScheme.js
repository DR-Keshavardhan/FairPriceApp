const db = require('./db');
const sql = require('mysql2');
const { file } = require('pdfkit');
const xlsx = require('xlsx');

const extract_data=(file) => {
    const workbook = xlsx.readFile(file); 
    const sheetName = workbook.SheetNames[0]; 
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
}

const createSchemaforSM = () => {
    const query = `CREATE TABLE IF NOT EXISTS SMadmin (
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

const createSchemaforKS = () => {
    const query = `CREATE TABLE IF NOT EXISTS KSadmin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(55) NOT NULL,
        password VARCHAR(55) NOT NULL,
        role VARCHAR(55) NOT NULL,
        count int
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
const createSchemaforSMtable = () => {
    const query = `CREATE TABLE SMdata (
        shop_id INT PRIMARY KEY,
        shop_name VARCHAR(255) NOT NULL,
        shop_incharge VARCHAR(255) NOT NULL,
        incharge_number VARCHAR(15) NOT NULL,
        email VARCHAR(255),
        opening_time varchar(55) NOT NULL,
        status varchar(110) NOT NULL,
        remarks TEXT,
        upload_batch VARCHAR(255),
        taluk VARCHAR(255),
        district VARCHAR(255)
    )`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Table created successfully");
    });
};


const insertdatatoSMTable = (filepath ) => {
    const data = extract_data(filepath);
    const query = `
      INSERT INTO SMdata 
      (shop_id, shop_name, shop_incharge, incharge_number,email, opening_time, district, status, remarks, upload_batch,taluk)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
  
    data.forEach((row) => {
      const values = [
        row['shop_id'],      
        row['shop_name'],
        row['shop_incharge'],
        row['incharge_number'],
        row['email'],
        row['opening_time'],
        row['district'],
        row['status'],
        row['remarks'],        
        row['upload_batch'],   
        row['taluk']           
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
  

const insertdatatookidsync = (filepath) => {
    data=extract_data(filepath);
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
const insertDatatoKSAuth = () => {
    const query = `INSERT INTO KSadmin (email, username, password, role) VALUES
    ('ram@gmail.com', 'Thiruvallur_district', 'td123', 'district')`;
    // ('ram@gmail.com', 'state_admin', 'ram123', 'state'), 
    // ('mani@gmial.com', 'chennai_district', 'mani123', 'district'),
    // ('ragavi@gmail.com', 'madurai_district', 'ragavi123', 'district'),
    // ('arvika@gmail.com', 'coimbatore_taluk', 'arvika123', 'taluk'),
    // ('jeya@gmail.com', 'tirunelveli_taluk', 'jeya123', 'taluk')`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Inserted successfully");
    });
};

const insertDatatoSMAuth = () => {
    // const query = `INSERT INTO SMadmin (email, username, password, role) VALUES
    // ('ram@gmail.com', 'state_admin', 'ram123', 'state'), 
    // ('mani@gmial.com', 'chennai_district', 'mani123', 'district'),
    // ('ragavi@gmail.com', 'madurai_district', 'ragavi123', 'district'),
    // ('arvika@gmail.com', 'coimbatore_taluk', 'arvika123', 'taluk'),
    // ('jeya@gmail.com', 'tirunelveli_taluk', 'jeya123', 'taluk')`;
    const query = `INSERT INTO SMadmin (email, username, password, role) VALUES
    ('mani@gmail.com', 'avadi_taluk', 'at123', 'taluk')`;
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
const alterTableForKidSync = () => {
  const query = `ALTER TABLE kidsync ADD COLUMN age INT, ADD COLUMN address VARCHAR(100)`;
  db.query(query,(err,result)=>{
    if(err) throw err;
    console.log("table altered for kidsync");
})
}


const createtableformonitor=()=>{
    const query=`create table shopmonitorstates
    )`
}

// alterTableForKidSync();

// createtableforkidsync();
// insertdatatookidsync();

// createSchemaforSMtable();
insertdatatoSMTable('shop_1030am.xlsx');

// createSchema();
// createSchemaforKS();
// createSchemaforSM();
// insertDatatoKSAuth();
// insertDatatoSMAuth();
// deleteEntireTable('SMdata');
// createSchemaforFPtableAuth();
// insertDataTOFPUser();



