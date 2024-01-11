const { connection } = require("../config/db");
const getCart = (req, res) => {
  // check jika user ada yang login apa atau tidak

  if (!req.session.user) {
    return res.status(401).send("kamu belum login");
  }

  const sqlGetToCart = `SELECT * FROM keranjang WHERE ${req.session.user.userID}`;
  connection.query(sqlGetToCart, (insertErr, results) => {
    if (insertErr) {
      console.error("Error inserting into cart:", insertErr);
      res.status(400).send(insertErr.message);
    }
    res.send(results);
  });
};

module.exports = getCart;
