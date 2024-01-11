const mysql = require("mysql");
require("dotenv").config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST_DEV,
  user: process.env.DB_USER_DEV,
  password: process.env.DB_PASS_DEV,
  database: process.env.DB_NAME_DEV,
});

//koneksi;
connection.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected ...");
});

module.exports = {
  connection,
};
