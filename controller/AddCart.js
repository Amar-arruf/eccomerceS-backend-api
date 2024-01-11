const { connection } = require("../config/db");
const generateRandomId = require("../provider/generateRandomId");
const AddToCart = (req, res) => {
  // check jika user ada yang login apa atau tidak

  if (!req.session.user) {
    return res.status(401).send("kamu belum login");
  }

  const productId = req.body.Produk_ID;
  const userID = req.session.user.userID;
  const sqlSelectProduct = "SELECT * FROM produk WHERE Produk_ID = ?";

  connection.query(sqlSelectProduct, productId, (selectErr, product) => {
    if (selectErr) {
      console.error("Error selecting product:", selectErr);
      res.status(400).send(selectErr.message);
    } else {
      const qty = parseInt(req.params.qty);
      const Total_Harga = Number(product[0].Harga) * qty + "";

      const sqlInsertToCart =
        "INSERT INTO keranjang (CartID,Produk_ID,Produk_Name,User_ID,TotalHarga,Quantity, url_Image) VALUES (?,?,?,?,?,?,?)";
      connection.query(
        sqlInsertToCart,
        [
          `C${generateRandomId(4)}`,
          product[0].Produk_ID,
          product[0].Nama_Produk,
          Number(userID),
          Total_Harga,
          qty,
          product[0].thumbnail,
        ],
        (insertErr) => {
          if (insertErr) {
            console.error("Error inserting into cart:", insertErr);
            res.status(400).send(insertErr.message);
          }
          res.send("berhasil ditambahkan di keranjang");
        }
      );
    }
  });
};

module.exports = AddToCart;
