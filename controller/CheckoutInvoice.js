const PDFDocument = require("pdfkit");
const { connection } = require("../config/db");
const queryAsync = require("../provider/queryAsync");

function generateRandomId(length) {
  let id = "";
  const characters = "123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    id += characters.charAt(randomIndex);
  }

  return id;
}

// Fungsi untuk menjalankan kueri dengan async/await
const query = (sql, values) => {
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

const getNumberRandom = generateRandomId(9);

const addItemToUserOrder = async (user_Id, data) => {
  // bikin post data invoice ke userOrder
  const queryUserOrder =
    "INSERT INTO userorder (OrderID,User_ID,tanggal_order) VALUES (?,?,?)";

  const result = await query(queryUserOrder, [
    data.OrderID,
    user_Id,
    data.tanggal_Order,
  ]);
  return result;
};

const updateOrderIDKeranjang = async () => {
  // update keranjang
  const queryUpdateKeranjang = `UPDATE keranjang SET OrderID = ${getNumberRandom} WHERE OrderID IS NULL`;
  const resultupdatekeranjang = await queryAsync(queryUpdateKeranjang);
  if (Array.isArray(resultupdatekeranjang)) {
    console.log("berhasil di update");
  }
};

const addItemOrder = async (arrayItem) => {
  const resultArray = arrayItem.map((item) => {
    const sqlQuery = `INSERT INTO  itemorder (ItemOrderID, Produk_ID, OrderID, Produk_Name, User_ID, TotalHarga, Quantity, url_image, StatusPay) VALUES(?,?,?,?,?,?,?,?,?)`;
    return queryAsync(sqlQuery, [
      "I" + generateRandomId(5),
      item.Produk_ID,
      getNumberRandom,
      item.Produk_Name,
      item.User_ID,
      item.TotalHarga,
      item.Quantity,
      item.url_image,
      item.StatusPay,
    ]);
  });

  return await Promise.all(resultArray);
};

const getItemOrder = async (userId) => {
  const sqlsyntax = "SELECT * FROM itemorder WHERE User_ID =?";
  const getData = await queryAsync(sqlsyntax, userId);

  return getData;
};

const createInvoice = (req, res) => {
  // Ambil data dari keranjang belanja (cart) dari database
  const userId = req.query.user_id; // Ganti dengan cara Anda mengidentifikasi pengguna
  const query = `SELECT * FROM keranjang WHERE User_ID = ?`;
  connection.query(query, [userId], async (error, results) => {
    if (error) throw error;

    // new Format
    const date = new Date();
    const formatDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const datawithoutId = {
      OrderID: getNumberRandom,
      tanggal_Order: formatDate,
    };
    const getData = await addItemToUserOrder(userId, datawithoutId);
    // membuat insert ke item orde ke database
    // ganti item order

    const responseAddItemOrder = await addItemOrder(results);

    const responseGetItem = await getItemOrder(userId);

    // hapus data keranjang setelah item masuk ke item Order

    // Gunakan pdfkit untuk membuat file PDF
    const doc = new PDFDocument();
    const invoiceFileName = `invoice${getNumberRandom}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    // Buat header invoice
    doc.fontSize(18).text("Invoice", { align: "center" });
    doc.fontSize(12).text(`Invoice Number: ${getNumberRandom}`);
    doc.moveDown();

    // Tambahkan detail produk dari cart
    let totalPrice = 0;
    const createInvoice = responseGetItem.filter(
      (value) => value.OrderID === Number(getNumberRandom)
    );
    createInvoice.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.Produk_Name} - Quantity: ${
          product.Quantity
        } - Harga:${product.TotalHarga}`
      );
      totalPrice += Number(product.TotalHarga);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Price: Rp.${totalPrice}`, { align: "right" });

    // Simpan file PDF
    doc.pipe(res);
    doc.end();
  });
};

module.exports = {
  addItemToUserOrder,
  createInvoice,
};
