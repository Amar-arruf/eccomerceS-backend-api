const mysql = require("mysql");
require("dotenv").config();
const fs = require("fs");
const connection = mysql.createConnection({
  host: process.env.DB_HOST_DEV,
  user: process.env.DB_USER_DEV,
  password: process.env.DB_PASS_DEV,
  database: process.env.DB_NAME_DEV,
  port: process.env.DB_PORT_DEV || 3306,
  ssl:
    process.env.DB_ENABLE_SSL === "true"
      ? {
          minVersion: "TLSv1.2",
          ca: process.env.DB_SSL_CA_PATH
            ? fs.readFileSync(process.env.DB_SSL_CA_PATH)
            : undefined,
        }
      : null,
});

//koneksi;
connection.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected ...");
});

module.exports = {
  connection,
};
