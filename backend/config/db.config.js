// Import the mysql2 module Promise Wrapper
const mysql = require("mysql2/promise");
// Prepare connection parameters we use to connect to the database
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // ✅ correct
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
};


// Create the connection pool
const pool = mysql.createPool(dbConfig);
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database Connected Successfully (MySQL - MAMP)");
    connection.release(); // Important: release the connection back to pool
  } catch (error) {
    console.log("❌ Database Connection Failed!");
    console.error("Error Details:", error.message);
    console.log("\n💡 Check these things:");
    console.log("   - Is MAMP running?");
    console.log("   - Is MySQL server started in MAMP?");
    console.log("   - Are your .env variables correct?");
  }
}
testConnection();
// Prepare a function that will execute the SQL queries asynchronously
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}
// Export the query function for use in the application
module.exports = { query };
