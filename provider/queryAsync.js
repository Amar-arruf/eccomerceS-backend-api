const { connection } = require("../config/db");

// Fungsi untuk menjalankan kueri dengan async/await
const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = queryAsync;
