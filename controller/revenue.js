const { connection } = require("../config/db");

const getRevenue = (req, res) => {
  const sql = `SELECT SUM(TotalHarga) as 'TotalHarga' FROM itemorder WHERE StatusPay = 'Success'`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(400).send(err.message);
    }
    res.status(200).send(result);
  });
};

module.exports = getRevenue;
