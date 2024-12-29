const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Keshav@1435',
    database: 'tnpds'
  });

// Using promises for cleaner code
const updateUserPasswords = async () => {
  try {
    // Fetch all users with plain text passwords
    const [users] = await db.promise().query('SELECT userId, password FROM users');
    console.log(users[0]);
    // Iterate over each user and update the password
    for (const user of users) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Update the user's password in the database
      await db.promise().query('UPDATE users SET password = ? WHERE userId = ?', [hashedPassword, user.userId]);
      console.log(`Password for user ID ${user.userId} updated successfully.`);
    }

    console.log('All passwords updated to hashed versions.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    db.end(); // Close the database connection
  }
};

// Start the password update process
updateUserPasswords();
