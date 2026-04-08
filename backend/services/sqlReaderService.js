const fs = require("fs");
const path = require("path");

class SqlReaderService {
  readSqlFile(filename) {
    const filePath = path.join(__dirname, "../sql", filename);
    let sql = fs.readFileSync(filePath, "utf8");

    // Remove comments, escape semicolons in strings
    sql = sql.replace(/--.*$/gm, ""); // Remove -- comments
    sql = sql.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove /* */ comments

    // Split by semicolon (not inside quotes)
    const statements = sql.split(";").filter((stmt) => stmt.trim());

    return statements;
  }
}

module.exports = new SqlReaderService();
