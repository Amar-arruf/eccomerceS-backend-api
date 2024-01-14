const { connection } = require("../config/db");

const getTransaction = (req, res) => {
  try {
    const query = `SELECT
      itemorder.OrderID,
      MAX(itemorder.url_image) AS url_image,
      user.Nama,
      GROUP_CONCAT(DISTINCT itemorder.Produk_Name SEPARATOR ', ') AS Nama_Produk,
      COUNT(itemorder.Quantity) AS Jumlah_Item,
      userorder.tanggal_order 
    FROM
      itemorder 
    JOIN
      userorder ON itemorder.OrderID = userorder.OrderID 
    JOIN
      user ON itemorder.User_ID = user.AkunID 
    GROUP BY
      itemorder.OrderID, user.Nama, userorder.tanggal_order;`;
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
    const query = `SELECT
    MAX(itemorder.url_image) as url_image,
    GROUP_CONCAT(itemorder.Produk_Name SEPARATOR ", ") as Nama_Produk,
    user.Nama,
    itemorder.OrderID,
    MAX(itemorder.StatusPay) as StatusPay,
    MAX(userorder.tanggal_order) as tanggal_order,
    SUM(itemorder.TotalHarga) as TotalHarga,
    MAX(user.Telepon) as Telepon,
    MAX(user.Alamat1) as Alamat1,
    MAX(user.Alamat2) as Alamat2,
    MAX(user.kodepos) as kodepos,
    MAX(user.provinsi) as provinsi,
    MAX(user.Kota) as Kota
  FROM
    itemorder 
  JOIN
    userorder ON itemorder.OrderID = userorder.OrderID 
  JOIN
    user ON itemorder.User_ID = user.AkunID 
  WHERE
    itemorder.OrderID = ? 
  GROUP BY
    itemorder.OrderID, user.Nama;`;
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
