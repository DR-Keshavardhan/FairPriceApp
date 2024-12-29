const db=require('./db.js');

const createSchema=()=>{
    const sql=`Create Table If Not Exists users
    (id Int AUTO_INCREMENT PRIMARY KEY,
    email varchar(255) NOT NULL,
    username varchar(55) NOT NULL,
    password varchar(55) NOT NULL,
    role varchar(55) Not Null)`;
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log("Table created successfully");
    });
}


const deleteEntireTable=(tablename)=>{
    const sql=`DROP TABLE ${tablename}`;
    db.query(sql,(err,result)=>{
        console.log("Table deleted successfully");
    })
}

const createSchemaforFPtable=()=>{
    const sql=`CREATE TABLE Shop (
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
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log("Table created successfully");
    })
}
// createSchemaforFPtable();
createSchema();
// deleteEntireTable('users');