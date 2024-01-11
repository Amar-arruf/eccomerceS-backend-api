const { connection } = require("../config/db");

const getTransaction = (req, res) => {
  try {
    const query =
      "SELECT itemorder.OrderID, itemorder.url_image, user.Nama, GROUP_CONCAT(DISTINCT Produk_Name SEPARATOR ', ') AS Nama_Produk, COUNT(Quantity) AS Jumlah_Item, userorder.tanggal_order FROM itemorder JOIN userorder ON itemorder.OrderID = userorder.OrderID JOIN user ON itemorder.User_ID = user.AkunID GROUP BY itemorder.OrderID;";
    connection.query(query, (err, result, field) => {
      if (err) {
        res.status(400).send(err.message);
      }
      res.send(result);
    });
  } catch (error) {
    res.status(404).send("Not Found");
  }
};

const getTransactionDetail = (req, res) => {
  try {
    const params = req.params;
    const query = `SELECT itemorder.url_image, GROUP_CONCAT(itemorder.Produk_Name SEPARATOR ", ") as Nama_Produk, user.Nama, itemorder.OrderID,itemorder.StatusPay, userorder.tanggal_order, SUM(itemorder.TotalHarga) as TotalHarga, user.Telepon, user.Alamat1, user.Alamat2, user.kodepos, user.provinsi, user.Kota FROM itemorder JOIN userorder ON itemorder.OrderID = userorder.OrderID JOIN user ON itemorder.User_ID = user.AkunID WHERE itemorder.OrderID = ? GROUP BY userorder.OrderID;`;
    connection.query(query, Number(req.params.id), (err, result, field) => {
      if (err) {
        res.status(400).send(err.message);
      }
      res.send(result);
    });
  } catch (error) {
    res.status(404).send("Not Found");
  }
};

const updatePayment = (req, res) => {
  const params = req.params;
  const queryState = req.query.State;
  const sql = `UPDATE itemorder SET StatusPay = '${queryState}' WHERE OrderID = ?`;
  connection.query(sql, [params.OrderID], (err, result) => {
    if (err) {
      res.status(400).send(err.message);
    }
    res.status(200).send(result);
  });
};

module.exports = { getTransaction, getTransactionDetail, updatePayment };
